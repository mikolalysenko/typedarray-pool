'use strict'

// contains non-power of 2 sized arrays
if(!global.poolExact) {
  global.poolExact = {
    DATA: {},
    BUFFER: {}
  }
}

var POOL = global.poolExact

// key is array size, value is array of available arrays
var DATA   = POOL.DATA
  , BUFFER = POOL.BUFFER

exports.clearCache = function clearCache() {
  var i, key, keys = Object.keys(DATA)
  for(i=0; i < keys.length; i++) {
    key = keys[i]
    POOL.DATA[key].length = 0
  }

  keys = Object.keys(BUFFER)
  for(i=0; i < keys.length; i++) {
    key = keys[i]
    POOL.BUFFER[key].length = 0
  }
}

exports.mallocArrayBuffer = function(n) {
  if (!DATA[n])
    DATA[n] = []

  if (DATA[n].length)
    return DATA[n].pop()

  return new ArrayBuffer(n)
}

exports.mallocBuffer = function(n) {
  if (!BUFFER[n])
    BUFFER[n] = []

  if (BUFFER[n].length)
    return BUFFER[n].pop()

  return new Buffer(n)
}

exports.freeArrayBuffer = function(buffer) {
  if(!buffer) {
    return
  }

  var n = buffer.length || buffer.byteLength
  if (!DATA[n])
    DATA[n] = []

  DATA[n].push(buffer)
}

exports.freeBuffer = function freeBuffer(array) {
  BUFFER[array.length].push(array)
}
