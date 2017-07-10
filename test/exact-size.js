'use exact'

var bits = require('bit-twiddle')
var pool = require('../pool')


// tests for the exactSize feature
require('tape')('typedarray-pool-exact-size', function(t) {

  var uic = (typeof Uint8ClampedArray !== 'undefined') ? Uint8ClampedArray : Uint8Array
  var types = [
    { name: 'int8', type: Int8Array },
    { name: 'int16', type: Int16Array },
    { name: 'int32', type: Int32Array },
    { name: 'uint8', type: Uint8Array },
    { name: 'uint16', type: Uint16Array },
    { name: 'uint32', type: Uint32Array },
    { name: 'float', type: Float32Array },
    { name: 'double', type: Float64Array },
    { name: 'uint8_clamped', type: uic }
  ]

  var log_n, i, a, n, exactSize = true

  // freeing exact size allocated array should end up in the exact size pool
  n = 14
  for(i=0; i < types.length; i++) {
    a = pool.malloc(n, types[i].name, exactSize)
    t.assert(a instanceof types[i].type, types[i].type + 'array valid')
    t.assert(a.length === n, types[i].type + 'array exact length')

    log_n = bits.log2(bits.nextPow2(a.byteLength))

    pool.free(a)

    t.assert(global.__TYPEDARRAY_POOL.DATA[log_n].length === 0, 'not returned to pow2 pool')
    t.assert(global.poolExact.DATA[a.byteLength].length === 1, 'returned to exact size pool')
    pool.clearCache()
  }

  /*
  // freeing exact size allocated arrays which are power of 2 should end up in power of 2 pool
  n = 16
  for(i=0; i < types.length; i++) {
    a = pool.malloc(n, types[i].name, exactSize)
    t.assert(a instanceof types[i].type, types[i].name + 'array valid')
    t.assert(a.length === n, types[i].name + 'array exact length')

    log_n = bits.log2(bits.nextPow2(a.byteLength))

    pool.free(a)

    t.assert(global.__TYPEDARRAY_POOL.DATA[log_n].length > 0, 'returned to pow2 pool')
    t.assert(global.poolExact.DATA[a.byteLength] === undefined, 'not returned to exact size pool')
    pool.clearCache()
  }
  */

  t.end()
})
