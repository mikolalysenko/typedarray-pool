"use strict"

var pool = require("../pool.js")

require("tap").test("typedarray-pool", function(t) {

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
    
    a = pool.malloc(i)
    t.assert(a instanceof ArrayBuffer)
    t.assert(a.byteLength >= i)
    pool.free(a)
  }
  
  pool.clearCache()

  t.end()
})