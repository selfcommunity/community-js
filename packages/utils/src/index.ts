import {capitalize, isString, stripHtml, camelCase, copyTextToClipboard, fallbackCopyTextToClipboard, random} from './utils/string';
import {isValidUrl, isValidUrls, urlReplacer, getDomain, appendURLSearchParams, urlB64ToUint8Array} from './utils/url';
import {getHighestSafeWindowContext, getWindowWidth, getWindowHeight, isClientSideRendering} from './utils/window';
import {mergeDeep, isObject} from './utils/object';
import {loadVersionBrowser} from './utils/browser';
import LRUCache, {LruCache, LruCacheType, CacheStrategies} from './utils/cache';
import {Logger} from './utils/logger';
import WSClient, {WSClientType, WSClientPropTypes} from './utils/websocket';

/**
 * Export all utilities
 */
export {
  capitalize,
  isString,
  stripHtml,
  camelCase,
  copyTextToClipboard,
  fallbackCopyTextToClipboard,
  random,
  isValidUrl,
  isValidUrls,
  urlReplacer,
  getDomain,
  appendURLSearchParams,
  urlB64ToUint8Array,
  getHighestSafeWindowContext,
  getWindowWidth,
  getWindowHeight,
  isClientSideRendering,
  Logger,
  mergeDeep,
  isObject,
  WSClient,
  WSClientType,
  WSClientPropTypes,
  loadVersionBrowser,
  LRUCache,
  LruCache,
  LruCacheType,
  CacheStrategies
};
