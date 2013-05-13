"use strict"

var bits = require("bit-twiddle")
var dup = require("dup")
if(!global.__TYPEDARRAY_POOL) {
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
}
var POOL = global.__TYPEDARRAY_POOL
var UINT8   = POOL.UINT8
  , UINT16  = POOL.UINT16
  , UINT32  = POOL.UINT32
  , INT8    = POOL.INT8
  , INT16   = POOL.INT16
  , INT32   = POOL.INT32
  , FLOAT   = POOL.FLOAT
  , DOUBLE  = POOL.DOUBLE
  , DATA    = POOL.DATA

function free(array) {
  if(array instanceof ArrayBuffer) {
    var n = array.byteLength|0
      , log_n = bits.log2(n)
    if(n < 32) {
      return
    }
    DATA[log_n].push(array)
  } else {
    var n = array.length|0
      , log_n = bits.log2(n)
    if(n < 32) {
      return
    }
    if(array instanceof Uint8Array) {
      UINT8[log_n].push(array)
    } else if(array instanceof Uint16Array) {
      UINT16[log_n].push(array)
    } else if(array instanceof Uint32Array) {
      UINT32[log_n].push(array)
    } else if(array instanceof Int8Array) {
      INT8[log_n].push(array)
    } else if(array instanceof Int16Array) {
      INT16[log_n].push(array)
    } else if(array instanceof Int32Array) {
      INT32[log_n].push(array)
    } else if(array instanceof Float32Array) {
      FLOAT[log_n].push(array)
    } else if(array instanceof Float64Array) {
      DOUBLE[log_n].push(array)
    }
  }
}
exports.free = free

function malloc(n, dtype) {
  n = Math.max(bits.nextPow2(n), 32)
  var log_n = bits.log2(n)
  if(dtype === undefined) {
    var d = DATA[log_n]
    if(d.length > 0) {
      var r = d[d.length-1]
      d.pop()
      return r
    }
    return new ArrayBuffer(n)
  } else {
    switch(dtype) {
      case "uint8":
        var u8 = UINT8[log_n]
        if(u8.length > 0) {
          var r8 = u8[u8.length-1]
          u8.pop()
          return r8
        }
        return new Uint8Array(n)
      break
      
      case "uint16":
        var u16 = UINT16[log_n]
        if(u16.length > 0) {
          var r16 = u16[u16.length-1]
          u16.pop()
          return r16
        }
        return new Uint16Array(n)
      break
      
      case "uint32":
        var u32 = UINT32[log_n]
        if(u32.length > 0) {
          var r32 = u32[u32.length-1]
          u32.pop()
          return r32
        }
        return new Uint32Array(n)
      break
      
      case "int8":
        var i8 = INT8[log_n]
        if(i8.length > 0) {
          var s8 = i8[i8.length-1]
          i8.pop()
          return s8
        }
        return new Int8Array(n)
      break
      
      case "int16":
        var i16 = INT16[log_n]
        if(i16.length > 0) {
          var s16 = i16[i16.length-1]
          i16.pop()
          return s16
        }
        return new Int16Array(n)
      break
      
      case "int32":
        var i32 = INT32[log_n]
        if(i32.length > 0) {
          var s32 = i32[i32.length-1]
          i32.pop()
          return s32
        }
        return new Int32Array(n)
      break
      
      case "float":
      case "float32":
        var f = FLOAT[log_n]
        if(f.length > 0) {
          var q = f[f.length-1]
          f.pop()
          return q
        }
        return new Float32Array(n)
      break
      
      case "double":
      case "float64":
        var dd = DOUBLE[log_n]
        if(dd.length > 0) {
          var p = dd[dd.length-1]
          dd.pop()
          return p
        }
        return new Float64Array(n)
      break
      
      default:
        return null
    }
  }
  return null
}
exports.malloc = malloc


function clearCache() {
  for(var i=0; i<32; ++i) {
    UINT8[i].length = 0
    UINT16[i].length = 0
    UINT32[i].length = 0
    INT8[i].length = 0
    INT16[i].length = 0
    INT32[i].length = 0
    FLOAT[i].length = 0
    DOUBLE[i].length = 0
    DATA[i].length = 0
  }
}
exports.clearCache = clearCache