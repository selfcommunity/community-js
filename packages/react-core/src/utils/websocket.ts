/**
 * WSClientPropTypes interface
 */
export interface WSClientPropTypes {
  /**
   * The Websocket URI
   */
  uri: string;

  /**
   * The Websocket Protocols
   */
  protocols: string | string[];

  /**
   * String to identify the heartbeat message.
   */
  heartbeatMsg?: string;

  /**
   * Reconnect the websocket if close
   */
  mustReconnect?: boolean;

  /**
   * Callback called after the websocket is connected.
   */
  connected?: () => any;

  /**
   * Callback called when the websocket is connecting.
   */
  connecting?: () => any;

  /**
   * Callback called after the websocket is disconnected.
   */
  disconnected?: (evt) => any;

  /**
   * Callback called when a message is received from the websocket.
   */
  receiveMessage?: (data) => any;

  /**
   * Enable/disable debug
   */
  debug?: boolean;
}

export interface WSClientType {
  /**
   * Send message
   * @param message
   */
  sendMessage: (message) => void;

  /**
   * Get current state
   */
  getState: () => string;

  /**
   * Get current connection state
   */
  isConnecting: () => boolean;

  /**
   * Check if ws is connected
   */
  isConnected: () => boolean;

  /**
   * Check if ws is closing connection
   */
  isClosing: () => boolean;

  /**
   * Return if ws is closed
   */
  isClosed: () => boolean;

  /**
   * Close the connection
   */
  close: () => void;
}

/**
 * WSClient: manage socket connection
 * @param options
 * @constructor
 */
export default class WSClient implements WSClientType {
  private static _instance;
  private _cfg;
  private _ws;
  private _timer;
  private _attempts = 1;
  private _heartbeatInterval = null;
  private _missedHeartbeats = 0;

  /**
   * Constructor
   * @param cfg
   */
  constructor(cfg: WSClientPropTypes) {
    if (!this.isValidOptions(cfg)) {
      return;
    }
    this._cfg = Object.assign({}, {heartbeatMsg: null, debug: false, mustReconnect: true}, cfg);
    this.connect();
  }

  /**
   * Get instance
   */
  public static getInstance(cfg): WSClient {
    this._instance = this._instance || new WSClient(cfg);
    return this._instance;
  }

  /**
   * Connect
   */
  connect() {
    try {
      if (this._ws && (this.isConnecting() || this.isConnected())) {
        // There is already a connection
        this._cfg.debug && console.info('Websocket is connecting or already connected.');
        return;
      }

      // Callback 'connecting' if exist
      typeof this._cfg.connecting === 'function' && this._cfg.connecting();
      this._cfg.debug && console.info(`Connecting to ${this._cfg.uri} ...`);

      // Open the connection
      this._ws = new WebSocket(this._cfg.uri, this._cfg.protocols);
      this._ws.onopen = this.onOpen.bind(this);
      this._ws.onmessage = this.onMessage.bind(this);
      this._ws.onerror = this.onError.bind(this);
      this._ws.onclose = this.onClose.bind(this);
      this._timer = null;
    } catch (err) {
      console.error(err);
      this.tryToReconnect();
    }
  }

  /**
   * Validate options
   * @param cfg
   */
  isValidOptions(cfg: WSClientPropTypes) {
    let _error = false;
    if (!cfg) {
      console.error('Invalid WSClient options.');
      return _error;
    }
    if (!cfg.uri) {
      console.error('Invalid WSClient Uri options.');
      _error = true;
    }
    if (cfg && cfg.connecting && !(typeof cfg.connecting === 'function')) {
      console.error('Invalid WSClient connecting options.');
      _error = true;
    }
    if (cfg && cfg.connected && !(typeof cfg.connected === 'function')) {
      console.error('Invalid WSClient connected options.');
      _error = true;
    }
    if (cfg && cfg.receiveMessage && !(typeof cfg.receiveMessage === 'function')) {
      console.error('Invalid WSClient receiveMessage options.');
      _error = true;
    }
    if (cfg && cfg.disconnected && !(typeof cfg.disconnected === 'function')) {
      console.error('Invalid WSClient connecting options.');
      _error = true;
    }
    if (cfg && cfg.heartbeatMsg && !(typeof cfg.heartbeatMsg === 'string')) {
      console.error('Invalid WSClient heartbeatMsg options.');
      _error = true;
    }
    if (cfg && cfg.debug && !(typeof cfg.debug === 'boolean')) {
      console.error('Invalid WSClient debug options.');
      _error = true;
    }
    return !_error;
  }

  /**
   * Try to reconnect if previous connection failed
   * Generate an interval, after that try to reconnect
   */
  tryToReconnect() {
    if (this._cfg.mustReconnect && !this._timer) {
      this._cfg.debug && console.info(`Reconnecting...`);
      let interval = this.generateInteval(this._attempts);
      this._timer = setTimeout(this.reconnect.bind(this), interval);
    }
  }

  /**
   * Reestablish the connection
   * Increase the number of attempts
   */
  reconnect() {
    this._attempts++;
    this.connect();
  }

  /**
   * Send heartbeat every 5 seconds
   * If missing more than 3 heartbeats close connection
   */
  sendHeartbeat() {
    try {
      this._missedHeartbeats++;
      if (this._missedHeartbeats > 3) throw new Error('Too many missed heartbeats.');
      this._ws.send(this._cfg.heartbeatMsg);
    } catch (e) {
      clearInterval(this._heartbeatInterval);
      this._heartbeatInterval = null;
      this._cfg.debug && console.warn(`Closing connection. Reason: ${e.message}`);
      if (!this.isClosing() && !this.isClosed()) {
        this.close();
      }
    }
  }

  /**
   * Established the new connection
   * Reset this._attempts counter
   */
  onOpen() {
    this._cfg.debug && console.info('Connected!');
    this._attempts = 1;
    if (this._cfg.heartbeatMsg && this._heartbeatInterval === null) {
      this._missedHeartbeats = 0;
      this._heartbeatInterval = setInterval(this.sendHeartbeat.bind(this), 5000);
    }
    typeof this._cfg.connected === 'function' && this._cfg.connected();
  }

  /**
   * Connection closed. Try to reconnect.
   * @param evt
   */
  onClose(evt) {
    this._cfg.debug && console.info('Connection closed!');
    typeof this._cfg.disconnected === 'function' && this._cfg.disconnected(evt);
    this.tryToReconnect();
  }

  /**
   * An error occured
   * @param evt
   */
  onError(evt) {
    this._cfg.debug && console.error('Websocket connection is broken!');
    this._cfg.debug && console.error(evt);
  }

  /**
   * A message has arrived.
   * If it is the heartbeat -> reset this._missedHeartbeats
   * If it is data pass data to the callback
   * @param evt
   */
  onMessage(evt) {
    if (this._cfg.heartbeatMsg && evt.data === this._cfg.heartbeatMsg) {
      // reset the counter for missed heartbeats
      this._missedHeartbeats = 0;
    } else if (typeof this._cfg.receiveMessage === 'function') {
      return this._cfg.receiveMessage(evt.data);
    }
  }

  /**
   * Generate an interval that is randomly between 0 and 2^k - 1, where k is
   * the number of connection attmpts, with a maximum interval of 30 seconds,
   * so it starts at 0 - 1 seconds and maxes out at 0 - 30 seconds
   */
  generateInteval(k) {
    let maxInterval = (Math.pow(2, k) - 1) * 1000;
    // If the generated interval is more than 30 seconds, truncate it down to 30 seconds.
    if (maxInterval > 30 * 1000) {
      maxInterval = 30 * 1000;
    }
    // generate the interval to a random number between 0 and the maxInterval determined from above
    return Math.random() * maxInterval;
  }

  /**
   * Send message
   * @param message
   */
  public sendMessage(message) {
    this._ws && this._ws.send(message);
  }

  /**
   * Get the ws state
   */
  public getState() {
    return this._ws && this._ws.readyState;
  }

  /**
   * Check if ws is in connecting state
   */
  public isConnecting() {
    return this._ws && this._ws.readyState === 0;
  }

  /**
   * Check if ws is connected
   */
  public isConnected() {
    return this._ws && this._ws.readyState === 1;
  }

  /**
   * Check if ws is in closing state
   */
  public isClosing() {
    return this._ws && this._ws.readyState === 2;
  }

  /**
   * Check if ws is closed
   */
  public isClosed() {
    return this._ws && this._ws.readyState === 3;
  }

  /**
   * Close the connection
   */
  public close() {
    clearInterval(this._heartbeatInterval);
    this._cfg.mustReconnect = false;
    if (!this.isClosing() || !this.isClosed()) {
      this._ws.close();
      this._cfg.debug && console.error('Websocket closed.');
    }
  }
}
