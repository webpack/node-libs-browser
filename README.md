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

## testling

To run the tests locally just do `npm test`

If you want to run the tests in a browser, use [zuul](https://github.com/shtylman/zuul)

```
zuul --server 9000 --ui qunit ./test/*.js
```

[![Dependency Status](http://david-dm.org/webpack/node-libs-browser.png)](http://david-dm.org/webpack/node-libs-browser)
