import {capitalize, isString, stripHtml, camelCase, copyTextToClipboard, fallbackCopyTextToClipboard, random, slugify} from './utils/string';
import {
  isValidUrl,
  isValidUrls,
  urlReplacer,
  getDomain,
  appendURLSearchParams,
  urlB64ToUint8Array,
  getQueryStringParameter,
  updateQueryStringParameter
} from './utils/url';
import {getHighestSafeWindowContext, getWindowWidth, getWindowHeight, isClientSideRendering} from './utils/window';
import {mergeDeep, isObject, objectWithoutProperties, isFunc} from './utils/object';
import {isInteger} from './utils/number';
import {arraysEqual} from './utils/array';
import {loadVersionBrowser} from './utils/browser';
import {LocalStorageDB} from './utils/localStorage';
import LRUCache, {LruCache, LruCacheType, CacheStrategies} from './utils/cache';
import {Logger} from './utils/logger';
import WSClient, {WSClientType, WSClientPropTypes} from './utils/websocket';
import {resizeImage} from './utils/image';

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
  slugify,
  isValidUrl,
  isValidUrls,
  urlReplacer,
  getDomain,
  appendURLSearchParams,
  urlB64ToUint8Array,
  getQueryStringParameter,
  updateQueryStringParameter,
  getHighestSafeWindowContext,
  getWindowWidth,
  getWindowHeight,
  isClientSideRendering,
  Logger,
  mergeDeep,
  isObject,
  objectWithoutProperties,
  isFunc,
  isInteger,
  arraysEqual,
  WSClient,
  WSClientType,
  WSClientPropTypes,
  loadVersionBrowser,
  LocalStorageDB,
  LRUCache,
  LruCache,
  LruCacheType,
  CacheStrategies,
  resizeImage
};
