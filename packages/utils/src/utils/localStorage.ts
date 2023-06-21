/**
 * Manage window.localStorage
 */
export class LocalStorageDB {
  /**
   * Set a key in window.localStorage
   * @param key
   * @param value
   */
  static set(key, value) {
    if (this.checkifSupport()) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('No support. Use a fallback such as browser cookies or store on the server.');
    }
  }

  /**
   * Get a key from window.localStorage, else return null
   * @param key
   */
  static get(key) {
    try {
      let data = window.localStorage.getItem(key);
      if (data && typeof data === 'object') {
        return JSON.parse(data);
      } else {
        return data;
      }
    } catch (e) {
      return null;
    }
  }

  /**
   * Get all keys
   */
  static getAll() {
    let array = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      let key = localStorage.key(i);
      array.push(this.get(key));
    }
    return array;
  }

  /**
   * Remove a single item from window.localStorage
   * @param key
   */
  static remove(key) {
    try {
      window.localStorage.removeItem(key);
      if (window.localStorage.length == 0) {
        this.clearAll();
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (this.get(key)) {
        delete window.localStorage[key];
        if (window.localStorage.length == 0) {
          this.clearAll();
        }
      }
    }
  }

  /**
   * Clear all keys from window.localStorage
   */
  static clearAll() {
    try {
      window.localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Check if localStorage is supported
   */
  static checkifSupport() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }
}
