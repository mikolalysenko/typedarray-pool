"use strict"

//Check upgrade works
var dup = require("dup")
global.__TYPEDARRAY_POOL = {
  UINT8   : dup([32, 0])
, UINT16  : dup([32, 0])
, UINT32  : dup([32, 0])
, INT8    : dup([32, 0])
, INT16   : dup([32, 0])
, INT32   : dup([32, 0])
, FLOAT   : dup([32, 0])
, DOUBLE  : dup([32, 0])
, DATA    : dup([32, 0])
}

var pool = require("../pool.js")

require("tape")("typedarray-pool", function(t) {

  pool.clearCache()

  for(var i=1; i<100; ++i) {
    var a
    a = pool.malloc(i, "int8")
    t.assert(a instanceof Int8Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "int16")
    t.assert(a instanceof Int16Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "int32")
    t.assert(a instanceof Int32Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "uint8")
    t.assert(a instanceof Uint8Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "uint16")
    t.assert(a instanceof Uint16Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "uint32")
    t.assert(a instanceof Uint32Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "float")
    t.assert(a instanceof Float32Array)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i, "double")
    t.assert(a instanceof Float64Array)
    t.assert(a.length >= i)
    pool.free(a)

    a = pool.malloc(i, "uint8_clamped")
    t.assert(a instanceof Uint8ClampedArray)
    t.assert(a.length >= i)
    pool.free(a)

    a = pool.malloc(i, "buffer")
    t.assert(a instanceof Buffer)
    t.assert(a.length >= i)
    pool.free(a)
    
    a = pool.malloc(i)
    t.assert(a instanceof ArrayBuffer)
    t.assert(a.byteLength >= i)
    pool.free(a)
  }
  
  for(var i=1; i<100; ++i) {
    var a
    a = pool.mallocInt8(i)
    t.assert(a instanceof Int8Array)
    t.assert(a.length >= i)
    pool.freeInt8(a)
    
    a = pool.mallocInt16(i)
    t.assert(a instanceof Int16Array)
    t.assert(a.length >= i)
    pool.freeInt16(a)
    
    a = pool.mallocInt32(i)
    t.assert(a instanceof Int32Array)
    t.assert(a.length >= i)
    pool.freeInt32(a)
    
    a = pool.mallocUint8(i)
    t.assert(a instanceof Uint8Array)
    t.assert(a.length >= i)
    pool.freeUint8(a)
    
    a = pool.mallocUint16(i)
    t.assert(a instanceof Uint16Array)
    t.assert(a.length >= i)
    pool.freeUint16(a)
    
    a = pool.mallocUint32(i)
    t.assert(a instanceof Uint32Array)
    t.assert(a.length >= i)
    pool.freeUint32(a)
    
    a = pool.mallocFloat(i)
    t.assert(a instanceof Float32Array)
    t.assert(a.length >= i)
    pool.freeFloat(a)
    
    a = pool.mallocDouble(i)
    t.assert(a instanceof Float64Array)
    t.assert(a.length >= i)
    pool.freeDouble(a)
    
    a = pool.mallocUint8Clamped(i)
    t.assert(a instanceof Uint8ClampedArray)
    t.assert(a.length >= i)
    pool.freeUint8Clamped(a)

    a = pool.mallocBuffer(i)
    t.assert(a instanceof Buffer)
    t.assert(a.length >= i)
    pool.freeBuffer(a)
    
    a = pool.mallocArrayBuffer(i)
    t.assert(a instanceof ArrayBuffer)
    t.assert(a.byteLength >= i)
    pool.freeArrayBuffer(a)
  }
  
  pool.clearCache()

  t.end()
})