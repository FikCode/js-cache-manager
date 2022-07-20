export default class SessionStorageManager 
{
    /**
     * @param {Object?} options options 
     * @param {String?} options.namespace Namespace to use as part of cache key
     * @param {String?} options.maxCacheItems Number of cache items to have
     */
    constructor(options)
    {
        options = options || {};
        this.namespace = options.namespace || 'pageCache';
        this.maxCacheItems = options.maxCacheItems || 10;
        this.cacheQueueKeys = [];
    }

    /**
     * Save an object in cache
     * @param {String} key Key used to save in cache
     * @param {Object} item Object to save in cache
     */
    set(key, item) 
    {
        const exists = this.get(key) != null;
        if(exists) this.delete(key);

        if(this.cacheQueueKeys.length > this.maxCacheItems - 1)
        {
            this.delete(this.cacheQueueKeys[0]);
        }

        const cacheKey = this.createKey(key);
        sessionStorage.setItem(cacheKey, JSON.stringify(item));
        this.cacheQueueKeys.push(key);
    }

    /**
     * Get the value cached by key
     * @param {*} key Key used to save in cache
     * @returns {Object} Object saved with that key or null if it doesn't exists
     */
    get(key) 
    {
        const item = sessionStorage.getItem(this.createKey(key));
        if(item == null) return null;

        return JSON.parse(item);
    }

    /**
     * Delete the value cached by key
     * @param {String} key Key used to save in cache
     */
    delete(key)
    {
        this.cacheQueueKeys = this.cacheQueueKeys.filter(value => value != key);
        sessionStorage.removeItem(this.createKey(key));
    }

    /**
     * Creates a key including the namespace to avoid collisions.
     * @param {String} key 
     * @returns {String} Returns a formatted key: {namespace}.{key}
     */
    createKey(key)
    {
        return `${this.namespace}.${key}`;
    }
}