/**
 * @author adearriba <https://github.com/adearriba/>
 * @copyright Inspired in: <https://github.com/highrisehq/snapback_cache>
 * @description A client side page cache with Javascript.
 */
import {SessionStorageManager} from "./SessionStorageManager";

export class PageCacheManager {
    /**
     * 
     * @param {Object} options 
     * @param {string} options.bodySelector Element to be cached and position saved
     * @param {function?} options.onLoaded Callback to execute when cache is loaded
     * @param {function?} options.onCached Callback to execute when item is cached
     * @param {number?} options.maxCacheItems Max number of items to cache
     * @param {string?} options.cacheNamespace Namespace for Cache items
     * @example 
     * var pageCache = SnapbackCache({ bodySelector: "#cache" })
     * @returns {PageCacheManager} Returns a SnapbackCache object
     */
    constructor(options) {
        this.options = options || {};
        this.enabled = true;

        const sessionStorageOptions = {
            namespace: options.cacheNamespace,
            maxCacheItems: options.maxCacheItems,
        }
        this.sessionStorageManager = new SessionStorageManager(sessionStorageOptions);
        this.cacheElement = document.querySelector(this.options.bodySelector);

        if (options.onLoaded)
            this.on('loaded', options.onLoaded);

        if (options.onCached)
            this.on('cached', options.onCached);

        this.loadFromCache();
    }

    /**
     * Enable cache
     */
    enable() {
        this.enabled = true;
    }

    /**
     * Disable cache
     */
    disable() {
        this.enabled = false;
    }

    /**
     * Returns `true` if its enabled and browser supports sessionStorage and history
     */
    isSupported() {
        return !!(sessionStorage && history && this.enabled);
    }

    /**
     * Saves item by key in cache
     * @param {String} key Cache key
     * @param {Object} value Cache value
     */
    setItem(key, value) {
        this.sessionStorageManager.set(key, value);
    }

    /**
     * Gets cached value by key
     * @param {String} key Cache key to fetch
     * @returns {Object} Cached object
     */
    getItem(key) {
        return this.sessionStorageManager.get(key);
    }

    /**
     * Removes cache value by key
     * @param {String} key Cached key
     */
    removeItem(key) {
        this.sessionStorageManager.delete(key);
    }

    /**
     * Returns `true` if cache is supported and not expired
     * @returns {Boolean} If cache is supported and not expired
     */
    willUseCacheOnThisPage() {
        if (!this.isSupported()) return false;

        const cachedPage = this.getItem(document.location.href);

        let date = new Date();
        let last15min = date.setMinutes(date.getMinutes() - 15);

        if (cachedPage && cachedPage.cachedAt > last15min) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Caches the `bodySelector` element if supported and triggers callback afterwards.
     * @fires CacheManager#cached
     * @param {function} callbackFunction 
     */
    cachePage(callbackFunction) {
        if (!this.isSupported()) {
            if (callbackFunction) {
                callbackFunction();
            }
            return;
        }

        var cachedPage = {
            body: this.cacheElement.innerHTML,
            title: document.title,
            positionY: window.pageYOffset,
            positionX: window.pageXOffset,
            cachedAt: new Date().getTime()
        };

        this.setItem(document.location.href, cachedPage);
        this.trigger('cached', cachedPage);

        if (callbackFunction) {
            callbackFunction(cachedPage);
        }
    }

    /**
     * Loads cache and updated HTML
     * @fires CacheManager#loaded
     * @param {function} noCacheCallback Function to execute in case no cache is loaded.
     */
    loadFromCache(noCacheCallback) {
        if (this.willUseCacheOnThisPage()) {
            var cachedPage = this.getItem(document.location.href);
            this.cacheElement.innerHTML = cachedPage.body;

            setTimeout(function () {
                window.scrollTo(cachedPage.positionX, cachedPage.positionY);
            }, 1);

            this.removeItem(document.location.href);
            this.trigger('loaded', cachedPage);
            return false;
        }
        else {
            if (noCacheCallback) noCacheCallback();

            this.trigger('loaded', cachedPage);
            return;
        }
    }

    trigger(eventName, details) {
        const cachedEvent = new CustomEvent(`cacheManager:${eventName}`, {
            detail: {
                cache: details
            }
        });
        this.cacheElement.dispatchEvent(cachedEvent);
    }

    /**
     * Add an event listener for the available events
     * @param {String} eventName Available event names are: `cached` and `loaded`
     * @param {function} callback Function to call when an event is fired
     * @example 
     * cacheManager.on('loaded', function(e){
     *  console.log(e);
     * })
     * @example 
     * cacheManager.on('cached', function(e){
     *  console.log(e);
     * })
     */
    on(eventName, callback) {
        this.cacheElement.addEventListener(`cacheManager:${eventName}`, callback);
    }
}

/**
 * Cached event
 * @event CacheManager#cached
 * @type {object}
 * @property {object} cache
 */

/**
 * Loaded cache event
 * @event CacheManager#loaded
 * @type {object}
 * @property {object} cache
 */