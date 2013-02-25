# node-libs-browser

The node core libs for in browser usage.

They are in CommonJs exports style and may have dependencies to other files with a CommonJs `require`. Shared util functions are layed out in shared modules.

## Formats

Modules exist in up to four formats:

### `full`

fully featured

### `part` (optional)

a comprimise of features and file size

### `minimal`

a minimal export without any features, just to make other modules happy.

### `test` (optional)

version for testing, you may have to provide test data.

## Module exports

``` javascript
{
  full: {
    assert: "/absolute/path/to/assert",
	events: "/absolute/path/to/events",
	/* ... */
  },
  part: {
    /* ... */
  },
  minimal: {
    /* ... */
  },
  test: {
    /* ... */
  },
  best: {
    /* full or part or minimal in this order whatever available */
    assert: "/absolute/path/to/assert",
	events: "/absolute/path/to/events",
	/* ... */
  },
  modules: {
    /* absolute paths to available types */
    assert: {
	  full: "/absolute/path/to/assert",
	  minimal: "/absolute/path/to/assert-minimal"
	},
    events: {
	  full: "/absolute/path/to/assert"
	},
	/* ... */
  }
}
```

[![Dependency Status](http://david-dm.org/webpack/node-libs-browser.png)](http://david-dm.org/webpack/node-libs-browser)