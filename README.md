# CacheManager <!-- omit in toc -->

> Inspired in: [snapback_cache](https://github.com/highrisehq/snapback_cache "snapback_cache")

## Table of Content <!-- omit in toc -->
- [Manual build](#manual-build)
- [Using NPM](#using-npm)
- [Import library to your code](#import-library-to-your-code)
- [How to use it](#how-to-use-it)

One of the pain points of an infinite scrolling feed is maintaining the feed and scroll position when you are sent to a new page and click to return to the feed. This little library wants to help you accomplish this easily.

## Manual build

To build you only need to execute:
```
npm install
gulp build
```

This will create a `/dist` folder with the final JS file `CacheManager.js` and `CacheManager.js.min`.

## Using NPM

You can add this to your code by running: 

```javascript
npm i @adearriba/cache.manager
```

## Import library to your code

Library is using ES6 `export default` so you can import it to your code using:
```javascript
import CacheManager from "./CacheManager.js";
```

## How to use it
1. Configure your InfiniteScroll 
Create functions to execute at different moments in the lifetime of the cache manager. It is recommended to set infinite scroll after loading the cache.
```javascript
function onLoaded(e){
  configureInfiniteScroll();
};

function onCached(e){
  console.log(e);
};
```

2. Create a cache manager instance
```javascript
let cacheManagerOptions = {
	bodySelector: '#cache', //Mandatory. Selector of the HTML element you want to cache
	onLoaded: onLoaded, //Optional. Callback to execute when cache is loaded
	onCached: onCached, //Optional. Callback to execute when item is cached
};

let cacheManager = new CacheManager(cacheManagerOptions);
```

3. Decide when you want to cache
For example, let's cache when the person clicks a product card.

```javascript
document.querySelector('#product').addEventListener('click', function(e){
	cacheManager.cachePage();
});
```

