import {SCOPE_SC_CORE} from '../constants/Errors';
import {Logger} from './logger';

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
  protocols: string[];

  /**
   * String to identify the heartbeat message.
   */
  heartbeatMsg?: string;

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
}

/**
 * WSClient: manage socket connection
 * @param options
 * @constructor
 */
export default function WSClient(options: WSClientPropTypes) {
  let opts,
    ws,
    timer,
    attempts = 1,
    must_reconnect = true,
    heartbeat_interval = null,
    missed_heartbeats = 0,
    _DEBUG = true;

  /**
   * Validate required options
   */
  if (options.uri === undefined) {
    Logger.error(SCOPE_SC_CORE, 'No Websocket URI in options.');
    return;
  }

  /**
   * Set intial options
   */
  opts = Object.assign({}, {heartbeatMsg: null}, options);

  /**
   * Open websocket connection
   */
  connect();

  /**
   * Handle open socket connection
   */
  function connect() {
    try {
      if (ws && (isConnecting() || isConnected())) {
        // There is already a connection
        _DEBUG && Logger.debug(SCOPE_SC_CORE, 'Websocket is connecting or already connected.');
        return;
      }

      // Callback 'connecting' if exist
      typeof opts.connecting === 'function' && opts.connecting();
      _DEBUG && Logger.debug(SCOPE_SC_CORE, `Connecting to ${opts.uri} ...`);

      // Open the connection
      ws = new WebSocket(opts.uri, opts.protocols);
      ws.onopen = onOpen;
      ws.onmessage = onMessage;
      ws.onerror = onError;
      ws.onclose = onClose;
      timer = null;
    } catch (err) {
      console.log(err);
      tryToReconnect();
      Logger.error(SCOPE_SC_CORE, err);
    }
  }

  /**
   * Try to reconnect if previous connection failed
   * Generate an interval, after that try to reconnect
   */
  function tryToReconnect() {
    if (must_reconnect && !timer) {
      _DEBUG && Logger.debug(SCOPE_SC_CORE, `Reconnecting...`);
      let interval = generateInteval(attempts);
      timer = setTimeout(function () {
        attempts++;
        connect();
      }, interval);
    }
  }

  /**
   * Send heartbeat every 5 seconds
   * If missing more than 3 heartbeats close connection
   */
  function sendHeartbeat() {
    try {
      missed_heartbeats++;
      if (missed_heartbeats > 3) throw new Error('Too many missed heartbeats.');
      ws.send(opts.heartbeatMsg);
    } catch (e) {
      clearInterval(heartbeat_interval);
      heartbeat_interval = null;
      _DEBUG && Logger.warn(SCOPE_SC_CORE, `Closing connection. Reason: ${e.message}`);
      if (!isClosing() && !isClosed()) {
        ws.close();
      }
    }
  }

  /**
   * Established the new connection
   * Reset attempts counter
   */
  function onOpen() {
    _DEBUG && Logger.debug(SCOPE_SC_CORE, 'Connected!');
    attempts = 1;
    if (opts.heartbeatMsg && heartbeat_interval === null) {
      missed_heartbeats = 0;
      heartbeat_interval = setInterval(sendHeartbeat, 5000);
    }
    typeof opts.connected === 'function' && opts.connected();
  }

  /**
   * Connection closed. Try to reconnect.
   * @param evt
   */
  function onClose(evt) {
    _DEBUG && Logger.debug(SCOPE_SC_CORE, 'Connection closed!');
    typeof opts.disconnected === 'function' && opts.disconnected(evt);
    tryToReconnect();
  }

  /**
   * An error occured
   * @param evt
   */
  function onError(evt) {
    _DEBUG && Logger.error(SCOPE_SC_CORE, 'Websocket connection is broken!');
    _DEBUG && Logger.error(SCOPE_SC_CORE, evt);
  }

  /**
   * A message has arrived.
   * If it is the heartbeat -> reset missed_heartbeats
   * If it is data pass data to the callback
   * @param evt
   */
  function onMessage(evt) {
    if (opts.heartbeatMsg && evt.data === opts.heartbeatMsg) {
      // reset the counter for missed heartbeats
      missed_heartbeats = 0;
    } else if (typeof opts.receiveMessage === 'function') {
      return opts.receiveMessage(evt.data);
    }
  }

  /**
   * Generate an interval that is randomly between 0 and 2^k - 1, where k is
   * the number of connection attmpts, with a maximum interval of 30 seconds,
   * so it starts at 0 - 1 seconds and maxes out at 0 - 30 seconds
   */
  function generateInteval(k) {
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
  function sendMessage(message) {
    ws && ws.send(message);
  };

  /**
   * Get the ws state
   */
  function getState() {
    return ws && ws.readyState;
  };

  /**
   * Check if ws is in connecting state
   */
  function isConnecting() {
    return ws && ws.readyState === 0;
  }

  /**
   * Check if ws is connected
   */
  function isConnected() {
    return ws && ws.readyState === 1;
  }

  /**
   * Check if ws is in closing state
   */
  function isClosing() {
    return ws && ws.readyState === 2;
  }

  /**
   * Check if ws is closed
   */
  function isClosed() {
    return ws && ws.readyState === 3;
  }

  /**
   * Close the connection
   */
  function close() {
    clearInterval(heartbeat_interval);
    must_reconnect = false;
    if (!isClosing() || !isClosed()) {
      ws.close();
    }
  }

  /**
   * Attach methods
   */
  this.sendMessage = sendMessage;
  this.getState = getState;
  this.isConnecting = isConnecting;
  this.isConnected = isConnected;
  this.isClosing = isClosing;
  this.isClosed = isClosed;
  this.close = close;
}
