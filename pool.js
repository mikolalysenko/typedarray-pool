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

exports.free = function free(array) {
  if(array instanceof ArrayBuffer) {
    var n = array.byteLength|0
      , log_n = bits.log2(n)
    DATA[log_n].push(array)
  } else {
    var n = array.length|0
      , log_n = bits.log2(n)
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

exports.freeUint8 = function freeUint8(array) {
  UINT8[bits.log2(array.length)].push(array)
}

exports.freeUint16 = function freeUint16(array) {
  UINT16[bits.log2(array.length)].push(array)
}

exports.freeUint32 = function freeUint32(array) {
  UINT32[bits.log2(array.length)].push(array)
}

exports.freeInt8 = function freeInt8(array) {
  INT8[bits.log2(array.length)].push(array)
}

exports.freeInt16 = function freeInt16(array) {
  INT16[bits.log2(array.length)].push(array)
}

exports.freeInt32 = function freeInt32(array) {
  INT32[bits.log2(array.length)].push(array)
}

exports.freeFloat32 = exports.freeFloat = function freeFloat(array) {
  FLOAT[bits.log2(array.length)].push(array)
}

exports.freeFloat64 = exports.freeDouble = function freeDouble(array) {
  DOUBLE[bits.log2(array.length)].push(array)
}

exports.freeArrayBuffer = function freeArrayBuffer(array) {
  DATA[bits.log2(array.length)].push(array)
}

exports.malloc = function malloc(n, dtype) {
  n = bits.nextPow2(n)
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
          return u8.pop()
        }
        return new Uint8Array(n)
      break

      case "uint16":
        var u16 = UINT16[log_n]
        if(u16.length > 0) {
          return u16.pop()
        }
        return new Uint16Array(n)
      break

      case "uint32":
        var u32 = UINT32[log_n]
        if(u32.length > 0) {
          return u32.pop()
        }
        return new Uint32Array(n)
      break

      case "int8":
        var i8 = INT8[log_n]
        if(i8.length > 0) {
          return i8.pop()
        }
        return new Int8Array(n)
      break

      case "int16":
        var i16 = INT16[log_n]
        if(i16.length > 0) {
          return i16.pop()
        }
        return new Int16Array(n)
      break

      case "int32":
        var i32 = INT32[log_n]
        if(i32.length > 0) {
          return i32.pop()
        }
        return new Int32Array(n)
      break

      case "float":
      case "float32":
        var f = FLOAT[log_n]
        if(f.length > 0) {
          return f.pop()
        }
        return new Float32Array(n)
      break

      case "double":
      case "float64":
        var dd = DOUBLE[log_n]
        if(dd.length > 0) {
          return dd.pop()
        }
        return new Float64Array(n)
      break

      default:
        return null
    }
  }
  return null
}

exports.mallocUint8 = function mallocUint8(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = UINT8[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Uint8Array(n)
}

exports.mallocUint16 = function mallocUint16(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = UINT16[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Uint16Array(n)
}

exports.mallocUint32 = function mallocUint32(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = UINT32[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Uint32Array(n)
}

exports.mallocInt8 = function mallocInt8(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = INT8[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Int8Array(n)
}

exports.mallocInt16 = function mallocInt16(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = INT16[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Int16Array(n)
}

exports.mallocInt32 = function mallocInt32(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = INT32[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Int32Array(n)
}

exports.mallocFloat32 = exports.mallocFloat = function mallocFloat(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = FLOAT[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Float32Array(n)
}

exports.mallocFloat64 = exports.mallocDouble = function mallocDouble(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = DOUBLE[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Float64Array(n)
}

exports.mallocArrayBuffer = function mallocArrayBuffer(n) {
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = DATA[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new ArrayBuffer(n)
}

exports.clearCache = function clearCache() {
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
