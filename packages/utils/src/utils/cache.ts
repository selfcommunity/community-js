/**
 * LruCache interface
 */
export interface LruCacheType<T> {
  get: (key: string, value?: T) => T;
  set: (key: string, value: T) => void;
  hasKey: (key: string) => Boolean;
  delete: (key: string) => void;
  clean: () => void;
  evaluate: () => void;
}

/**
 * LruCache
 */
class LruCache<T> {

  private values: Map<string, T> = new Map<string, T>();
  private maxEntries: number = 500000;

  /**
   * Get a key from the map store
   * @param key
   */
  public get(key: string, value?: T): T {
    const hasKey = this.values.has(key);
    let entry: T;
    if (hasKey) {
      // peek the entry, re-insert(updated if value) for LRU strategy
      entry = value || this.values.get(key);
      this.values.delete(key);
      this.values.set(key, entry);
    }else if (value) {
      // insert value if passed
      entry = value;
      this.values.set(key, entry);
    }
    return entry;
  }

  /**
   * Set a key in the store
   * @param key
   * @param value
   */
  public set(key: string, value: T): void {
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
  public hasKey(key: string): Boolean {
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
   * Clean the store
   */
  public clean(): void {
    this.values = new Map<string, T>();
  }

  /**
   * Print the store in the console
   * Only for debug
   */
  public evaluate() {
    console.log('CURRENT Cache:');
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
