# node-libs-browser

The node core libs for in browser usage.

They are in CommonJs exports style and may have dependencies to other files with a CommonJs `require`. Shared util functions are layed out in shared modules.

## Module exports

``` javascript
{
  assert: "/absolute/path/to/assert",
  events: "/absolute/path/to/events",
  /* ... */
}
```

[![Dependency Status](http://david-dm.org/webpack/node-libs-browser.png)](http://david-dm.org/webpack/node-libs-browser)