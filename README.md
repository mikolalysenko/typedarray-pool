typedarray-pool
===============
A global pool for typed arrays.

## Example

```javascript
var pool = require("typedarray-pool")

//Allocate a buffer with at least 128 floats
var f = pool.malloc(128, "float")

// ... do stuff ...

//When done, release buffer
pool.free(f)
```

## Install

    npm install typedarray-pool

## API

```javascript
var pool = require("typedarray-pool")
```

### `pool.malloc(n[, dtype])`
Allocates a typed array (or ArrayBuffer) with at least n elements.

* `n` is the number of elements in the array
* `dtype` is the data type of the array to allocate.  Must be one of:

  + `"uint8"`
  + `"uint16"`
  + `"uint32"`
  + `"int8"`
  + `"int16"`
  + `"int32"`
  + `"float"`
  + `"float32"`
  + `"double"`
  + `"float64"`

**Returns** A typed array with at least `n` elements in it.

### `pool.free(array)`
Returns the array back to the pool.

* `array` The array object to return to the pool.

### `pool.clearCache()`
Removes all references to cached arrays.  Use this when you are done with the pool to return all the cached memory to the garbage collector.

## FAQ

### Why cache typed arrays?
Creating typed arrays is stupidly expensive in most JS engines.  So it makes sense to pool them, both so that frequently used typed arrays stay hot in cache and so that you can avoid having to trigger some expensive realloc operation whenever you use them.

### Why not cache ArrayBuffers instead?
Because creating a typed array from an array buffer is almost as expensive as allocating the typed array in the first place.  While this approach would save memory, it doesn't give much of a performance benefit for small arrays.  (See for example this experiment:  

https://github.com/mikolalysenko/typedarray-cache-experiment

### Is this library safe to use?
Only if you know what you are doing.  This library will create a global pool of typed array buffers that you can use across many modules.  The downside though is that you have to manage all the memory yourself, so you can easily shoot yourself in the foot if you screw up.

# Credits
(c) 2013 Mikola Lysenko. MIT License
