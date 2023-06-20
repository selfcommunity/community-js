/**
 * LruCache interface
 */
export interface LruCacheType<T> {
  get: (key: string, value?: T, options?: {noSsr: boolean}) => T;
  set: (key: string, value: T, options?: {noSsr: boolean}) => void;
  hasKey: (key: string) => boolean;
  delete: (key: string) => void;
  deleteKeys: (keys: string[]) => void;
  deleteKeysWithPrefix: (prefix: string) => void;
  clean: () => void;
  evaluate: () => void;
}

/**
 * LruCache
 */
export class LruCache<T> {
  private values: Map<string, T> = new Map<string, T>();
  private maxEntries;
  private ssr: boolean;

  /**
   * Initialize Cache
   * @param maxEntries
   */
  constructor(maxEntries = 10000) {
    this.maxEntries = maxEntries;
    this.ssr = typeof window === 'undefined';
    if (!this.ssr) {
      window['__viewSCCache'] = this.values;
    }
  }

  /**
   * Get a key from the map store
   * @param key
   * @param value
   * @param options
   */
  public get(key: string, value?: T, options: {noSsr: boolean} = {noSsr: true}): T {
    const hasKey = this.values.has(key);
    let entry: T;
    if (hasKey) {
      // peek the entry, re-insert(updated if value) for LRU strategy
      entry = this.values.get(key);
      this.values.delete(key);
      this.values.set(key, entry);
    } else if (value) {
      // insert value if passed
      entry = value;
      !(this.ssr && options.noSsr) && this.values.set(key, entry);
    }
    return entry;
  }

  /**
   * Set a key in the store
   * @param key
   * @param value
   * @param options
   */
  public set(key: string, value: T, options: {noSsr: boolean} = {noSsr: true}): void {
    if (this.ssr && options.noSsr) {
      return;
    }
    if (this.values.size >= this.maxEntries) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;
      this.values.delete(keyToDelete);
    }
    this.values.set(key, value);
  }

  /**
   * Check if key is in cache
   * @param key
   */
  public hasKey(key: string): boolean {
    return this.values.has(key);
  }

  /**
   * Delete a key in the store
   * @param key
   */
  public delete(key: string): void {
    const hasKey = this.values.has(key);
    if (hasKey) {
      this.values.delete(key);
    }
  }

  /**
   * Delete all entry with prefix keys
   * @param keys
   */
  public deleteKeys(keys: string[]): void {
    keys.forEach((k) => {
      const hasKey = this.values.has(k);
      if (hasKey) {
        this.values.delete(k);
      }
    });
  }

  /**
   * Delete all entry with prefix keys
   * @param prefix
   */
  public deleteKeysWithPrefix(prefix: string): void {
    this.values.forEach((v, k) => {
      if (k.startsWith(prefix)) {
        this.values.delete(k);
      }
    });
  }

  /**
   * Clean the store
   */
  public clean(): void {
    this.values = new Map<string, T>();
  }

  /**
   * Print the store in the console
   * Only for debug
   */
  public evaluate(): void {
    console.log(this.values);
  }
}

/**
 * Define the various types of caching strategies
 */
export enum CacheStrategies {
  CACHE_FIRST = 'Cache-first',
  NETWORK_ONLY = 'Network-only',
  STALE_WHILE_REVALIDATE = 'Stale-While-Revalidate'
}

/**
 * Export global cache
 */
const cache: LruCacheType<any> = new LruCache<any>();
export default cache;
