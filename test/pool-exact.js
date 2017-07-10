'use strict'

var pool = require('../pool-exact')

// isolated tests for the pool-exact module
require('tape')('typedarray-pool-exact', function(t) {
  var i, a

  for(i=1; i<100; ++i) {
    a = pool.mallocArrayBuffer(i)
    t.assert(a instanceof ArrayBuffer, 'arraybuffer valid')
    t.assert(a.byteLength === i, 'arraybuffer length')
    pool.freeArrayBuffer(a)

    a = pool.mallocBuffer(i)
    t.assert(Buffer.isBuffer(a), 'buffer')
    t.assert(a.length === i)
    pool.freeBuffer(a)
  }

  pool.clearCache()
  for(i=1; i<100; ++i) {
    t.assert(poolExact.DATA[i].length === 0, 'arraybuffer pool cleared')
    t.assert(poolExact.BUFFER[i].length === 0, 'buffer pool cleared')
  }

  // malloc'ing and freeing identical sized array shouldn't grow the pool
  for(i=1; i<100; ++i) {
    a = pool.mallocArrayBuffer(300)
    pool.freeArrayBuffer(a)

    a = pool.mallocBuffer(200)
    pool.freeBuffer(a)
  }

  t.assert(poolExact.DATA[300].length === 1, 'arraybuffer pool has 1 element')
  t.assert(poolExact.BUFFER[200].length === 1, 'buffer pool has 1 element')

  pool.clearCache()

  t.end()
})
