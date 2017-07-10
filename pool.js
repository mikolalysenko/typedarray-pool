'use strict'

var bits  = require('bit-twiddle')
var dup   = require('dup')
var exact = require('./pool-exact')


// Legacy pool support
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
    , UINT8C  : dup([32, 0])
    , BUFFER  : dup([32, 0])
  }
}

var hasUint8C = (typeof Uint8ClampedArray) !== 'undefined'
var POOL = global.__TYPEDARRAY_POOL

// Upgrade pool
if(!POOL.UINT8C) {
  POOL.UINT8C = dup([32, 0])
}
if(!POOL.BUFFER) {
  POOL.BUFFER = dup([32, 0])
}

// New technique: Only allocate from ArrayBufferView and Buffer
var DATA    = POOL.DATA
  , BUFFER  = POOL.BUFFER

function isPow2(n) {
  return bits.nextPow2(n) === n
}

function freeArrayBuffer(buffer) {
  if(!buffer) {
    return
  }
  var log_n, n = buffer.length || buffer.byteLength
  if(isPow2(n)) {
    log_n = bits.log2(n)
    DATA[log_n].push(buffer)
  } else {
    exact.freeArrayBuffer(buffer)
  }
}

function freeBuffer(array) {
  if(isPow2(array.length)) {
    BUFFER[bits.log2(array.length)].push(array)
  } else {
    exact.freeBuffer(array)
  }
}

exports.free = function free(array) {
  if(Buffer.isBuffer(array)) {
    freeBuffer(array)
  } else {
    if(Object.prototype.toString.call(array) !== '[object ArrayBuffer]') {
      array = array.buffer
    }
    freeArrayBuffer(array)
  }
}

function freeTypedArray(array) {
  freeArrayBuffer(array.buffer)
}

exports.freeUint8 =
exports.freeUint16 =
exports.freeUint32 =
exports.freeInt8 =
exports.freeInt16 =
exports.freeInt32 =
exports.freeFloat32 =
exports.freeFloat =
exports.freeFloat64 =
exports.freeDouble =
exports.freeUint8Clamped =
exports.freeDataView = freeTypedArray

exports.freeArrayBuffer = freeArrayBuffer
exports.freeBuffer = freeBuffer

exports.malloc = function malloc(n, dtype, exactSize) {
  if(dtype === undefined || dtype === 'arraybuffer') {
    return mallocArrayBuffer(n, exactSize)
  } else {
    switch(dtype) {
      case 'uint8':
        return mallocUint8(n, exactSize)
      case 'uint16':
        return mallocUint16(n, exactSize)
      case 'uint32':
        return mallocUint32(n, exactSize)
      case 'int8':
        return mallocInt8(n, exactSize)
      case 'int16':
        return mallocInt16(n, exactSize)
      case 'int32':
        return mallocInt32(n, exactSize)
      case 'float':
      case 'float32':
        return mallocFloat(n, exactSize)
      case 'double':
      case 'float64':
        return mallocDouble(n, exactSize)
      case 'uint8_clamped':
        return mallocUint8Clamped(n, exactSize)
      case 'buffer':
        return mallocBuffer(n, exactSize)
      case 'data':
      case 'dataview':
        return mallocDataView(n, exactSize)

      default:
        return null
    }
  }
  return null
}

function mallocArrayBuffer(n, exactSize) {
  if(exactSize === true && !isPow2(n)) {
    return exact.mallocArrayBuffer(n)
  }
  var n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var d = DATA[log_n]
  if(d.length > 0) {
    return d.pop()
  }
  return new ArrayBuffer(n)
}
exports.mallocArrayBuffer = mallocArrayBuffer

function mallocUint8(n, exactSize) {
  return new Uint8Array(mallocArrayBuffer(n, exactSize), 0, n)
}
exports.mallocUint8 = mallocUint8

function mallocUint16(n, exactSize) {
  return new Uint16Array(mallocArrayBuffer(2*n, exactSize), 0, n)
}
exports.mallocUint16 = mallocUint16

function mallocUint32(n, exactSize) {
  return new Uint32Array(mallocArrayBuffer(4*n, exactSize), 0, n)
}
exports.mallocUint32 = mallocUint32

function mallocInt8(n, exactSize) {
  return new Int8Array(mallocArrayBuffer(n, exactSize), 0, n)
}
exports.mallocInt8 = mallocInt8

function mallocInt16(n, exactSize) {
  return new Int16Array(mallocArrayBuffer(2*n, exactSize), 0, n)
}
exports.mallocInt16 = mallocInt16

function mallocInt32(n, exactSize) {
  return new Int32Array(mallocArrayBuffer(4*n, exactSize), 0, n)
}
exports.mallocInt32 = mallocInt32

function mallocFloat(n, exactSize) {
  return new Float32Array(mallocArrayBuffer(4*n, exactSize), 0, n)
}
exports.mallocFloat32 = exports.mallocFloat = mallocFloat

function mallocDouble(n, exactSize) {
  return new Float64Array(mallocArrayBuffer(8*n, exactSize), 0, n)
}
exports.mallocFloat64 = exports.mallocDouble = mallocDouble

function mallocUint8Clamped(n, exactSize) {
  if(hasUint8C) {
    return new Uint8ClampedArray(mallocArrayBuffer(n, exactSize), 0, n)
  } else {
    return mallocUint8(n, exactSize)
  }
}
exports.mallocUint8Clamped = mallocUint8Clamped

function mallocDataView(n, exactSize) {
  return new DataView(mallocArrayBuffer(n, exactSize), 0, n)
}
exports.mallocDataView = mallocDataView

function mallocBuffer(n, exactSize) {
  if(exactSize === true && !isPow2(n)) {
    return exact.mallocBuffer(n)
  }
  n = bits.nextPow2(n)
  var log_n = bits.log2(n)
  var cache = BUFFER[log_n]
  if(cache.length > 0) {
    return cache.pop()
  }
  return new Buffer(n)
}
exports.mallocBuffer = mallocBuffer

exports.clearCache = function clearCache() {
  for(var i=0; i<32; ++i) {
    POOL.UINT8[i].length = 0
    POOL.UINT16[i].length = 0
    POOL.UINT32[i].length = 0
    POOL.INT8[i].length = 0
    POOL.INT16[i].length = 0
    POOL.INT32[i].length = 0
    POOL.FLOAT[i].length = 0
    POOL.DOUBLE[i].length = 0
    POOL.UINT8C[i].length = 0
    DATA[i].length = 0
    BUFFER[i].length = 0
  }
  exact.clearCache()
}
