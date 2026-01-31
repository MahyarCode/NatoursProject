// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"../../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../../node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../../node_modules/buffer/node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../../node_modules/base64-js/index.js","ieee754":"../../node_modules/ieee754/index.js","isarray":"../../node_modules/buffer/node_modules/isarray/index.js","buffer":"../../node_modules/buffer/index.js"}],"axios.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*! Axios v1.13.2 Copyright (c) 2025 Matt Zabriskie and contributors */
!function (e, t) {
  'object' == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && 'undefined' != typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define(t) : (e = 'undefined' != typeof globalThis ? globalThis : e || self).axios = t();
}(void 0, function () {
  'use strict';

  function e(e) {
    var r, n;
    function o(r, n) {
      try {
        var a = e[r](n),
          u = a.value,
          s = u instanceof t;
        Promise.resolve(s ? u.v : u).then(function (t) {
          if (s) {
            var n = 'return' === r ? 'return' : 'next';
            if (!u.k || t.done) return o(n, t);
            t = e[n](t).value;
          }
          i(a.done ? 'return' : 'normal', t);
        }, function (e) {
          o('throw', e);
        });
      } catch (e) {
        i('throw', e);
      }
    }
    function i(e, t) {
      switch (e) {
        case 'return':
          r.resolve({
            value: t,
            done: !0
          });
          break;
        case 'throw':
          r.reject(t);
          break;
        default:
          r.resolve({
            value: t,
            done: !1
          });
      }
      (r = r.next) ? o(r.key, r.arg) : n = null;
    }
    this._invoke = function (e, t) {
      return new Promise(function (i, a) {
        var u = {
          key: e,
          arg: t,
          resolve: i,
          reject: a,
          next: null
        };
        n ? n = n.next = u : (r = n = u, o(e, t));
      });
    }, 'function' != typeof e.return && (this.return = void 0);
  }
  function t(e, t) {
    this.v = e, this.k = t;
  }
  function r(e) {
    var r = {},
      n = !1;
    function o(r, o) {
      return n = !0, o = new Promise(function (t) {
        t(e[r](o));
      }), {
        done: !1,
        value: new t(o, 1)
      };
    }
    return r['undefined' != typeof Symbol && Symbol.iterator || '@@iterator'] = function () {
      return this;
    }, r.next = function (e) {
      return n ? (n = !1, e) : o('next', e);
    }, 'function' == typeof e.throw && (r.throw = function (e) {
      if (n) throw n = !1, e;
      return o('throw', e);
    }), 'function' == typeof e.return && (r.return = function (e) {
      return n ? (n = !1, e) : o('return', e);
    }), r;
  }
  function n(e) {
    var t,
      r,
      n,
      i = 2;
    for ('undefined' != typeof Symbol && (r = Symbol.asyncIterator, n = Symbol.iterator); i--;) {
      if (r && null != (t = e[r])) return t.call(e);
      if (n && null != (t = e[n])) return new o(t.call(e));
      r = '@@asyncIterator', n = '@@iterator';
    }
    throw new TypeError('Object is not async iterable');
  }
  function o(e) {
    function t(e) {
      if (Object(e) !== e) return Promise.reject(new TypeError(e + ' is not an object.'));
      var t = e.done;
      return Promise.resolve(e.value).then(function (e) {
        return {
          value: e,
          done: t
        };
      });
    }
    return o = function o(e) {
      this.s = e, this.n = e.next;
    }, o.prototype = {
      s: null,
      n: null,
      next: function next() {
        return t(this.n.apply(this.s, arguments));
      },
      return: function _return(e) {
        var r = this.s.return;
        return void 0 === r ? Promise.resolve({
          value: e,
          done: !0
        }) : t(r.apply(this.s, arguments));
      },
      throw: function _throw(e) {
        var r = this.s.return;
        return void 0 === r ? Promise.reject(e) : t(r.apply(this.s, arguments));
      }
    }, new o(e);
  }
  function i(e) {
    return new t(e, 0);
  }
  function a(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t && (n = n.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })), r.push.apply(r, n);
    }
    return r;
  }
  function u(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2 ? a(Object(r), !0).forEach(function (t) {
        m(e, t, r[t]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : a(Object(r)).forEach(function (t) {
        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
      });
    }
    return e;
  }
  function s() {
    s = function s() {
      return t;
    };
    var e,
      t = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (e, t, r) {
        e[t] = r.value;
      },
      i = 'function' == typeof Symbol ? Symbol : {},
      a = i.iterator || '@@iterator',
      u = i.asyncIterator || '@@asyncIterator',
      c = i.toStringTag || '@@toStringTag';
    function f(e, t, r) {
      return Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), e[t];
    }
    try {
      f({}, '');
    } catch (e) {
      f = function f(e, t, r) {
        return e[t] = r;
      };
    }
    function l(e, t, r, n) {
      var i = t && t.prototype instanceof m ? t : m,
        a = Object.create(i.prototype),
        u = new P(n || []);
      return o(a, '_invoke', {
        value: k(e, r, u)
      }), a;
    }
    function p(e, t, r) {
      try {
        return {
          type: 'normal',
          arg: e.call(t, r)
        };
      } catch (e) {
        return {
          type: 'throw',
          arg: e
        };
      }
    }
    t.wrap = l;
    var d = 'suspendedStart',
      h = 'executing',
      v = 'completed',
      y = {};
    function m() {}
    function b() {}
    function g() {}
    var w = {};
    f(w, a, function () {
      return this;
    });
    var E = Object.getPrototypeOf,
      O = E && E(E(L([])));
    O && O !== r && n.call(O, a) && (w = O);
    var S = g.prototype = m.prototype = Object.create(w);
    function x(e) {
      ['next', 'throw', 'return'].forEach(function (t) {
        f(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function R(e, t) {
      function r(o, i, a, u) {
        var s = p(e[o], e, i);
        if ('throw' !== s.type) {
          var c = s.arg,
            f = c.value;
          return f && 'object' == _typeof(f) && n.call(f, '__await') ? t.resolve(f.__await).then(function (e) {
            r('next', e, a, u);
          }, function (e) {
            r('throw', e, a, u);
          }) : t.resolve(f).then(function (e) {
            c.value = e, a(c);
          }, function (e) {
            return r('throw', e, a, u);
          });
        }
        u(s.arg);
      }
      var i;
      o(this, '_invoke', {
        value: function value(e, n) {
          function o() {
            return new t(function (t, o) {
              r(e, n, t, o);
            });
          }
          return i = i ? i.then(o, o) : o();
        }
      });
    }
    function k(t, r, n) {
      var o = d;
      return function (i, a) {
        if (o === h) throw new Error('Generator is already running');
        if (o === v) {
          if ('throw' === i) throw a;
          return {
            value: e,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var u = n.delegate;
          if (u) {
            var s = T(u, n);
            if (s) {
              if (s === y) continue;
              return s;
            }
          }
          if ('next' === n.method) n.sent = n._sent = n.arg;else if ('throw' === n.method) {
            if (o === d) throw o = v, n.arg;
            n.dispatchException(n.arg);
          } else 'return' === n.method && n.abrupt('return', n.arg);
          o = h;
          var c = p(t, r, n);
          if ('normal' === c.type) {
            if (o = n.done ? v : 'suspendedYield', c.arg === y) continue;
            return {
              value: c.arg,
              done: n.done
            };
          }
          'throw' === c.type && (o = v, n.method = 'throw', n.arg = c.arg);
        }
      };
    }
    function T(t, r) {
      var n = r.method,
        o = t.iterator[n];
      if (o === e) return r.delegate = null, 'throw' === n && t.iterator.return && (r.method = 'return', r.arg = e, T(t, r), 'throw' === r.method) || 'return' !== n && (r.method = 'throw', r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = p(o, t.iterator, r.arg);
      if ('throw' === i.type) return r.method = 'throw', r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[t.resultName] = a.value, r.next = t.nextLoc, 'return' !== r.method && (r.method = 'next', r.arg = e), r.delegate = null, y) : a : (r.method = 'throw', r.arg = new TypeError('iterator result is not an object'), r.delegate = null, y);
    }
    function j(e) {
      var t = {
        tryLoc: e[0]
      };
      1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t);
    }
    function A(e) {
      var t = e.completion || {};
      t.type = 'normal', delete t.arg, e.completion = t;
    }
    function P(e) {
      this.tryEntries = [{
        tryLoc: 'root'
      }], e.forEach(j, this), this.reset(!0);
    }
    function L(t) {
      if (t || '' === t) {
        var r = t[a];
        if (r) return r.call(t);
        if ('function' == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            i = function r() {
              for (; ++o < t.length;) if (n.call(t, o)) return r.value = t[o], r.done = !1, r;
              return r.value = e, r.done = !0, r;
            };
          return i.next = i;
        }
      }
      throw new TypeError(_typeof(t) + ' is not iterable');
    }
    return b.prototype = g, o(S, 'constructor', {
      value: g,
      configurable: !0
    }), o(g, 'constructor', {
      value: b,
      configurable: !0
    }), b.displayName = f(g, c, 'GeneratorFunction'), t.isGeneratorFunction = function (e) {
      var t = 'function' == typeof e && e.constructor;
      return !!t && (t === b || 'GeneratorFunction' === (t.displayName || t.name));
    }, t.mark = function (e) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(e, g) : (e.__proto__ = g, f(e, c, 'GeneratorFunction')), e.prototype = Object.create(S), e;
    }, t.awrap = function (e) {
      return {
        __await: e
      };
    }, x(R.prototype), f(R.prototype, u, function () {
      return this;
    }), t.AsyncIterator = R, t.async = function (e, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new R(l(e, r, n, o), i);
      return t.isGeneratorFunction(r) ? a : a.next().then(function (e) {
        return e.done ? e.value : a.next();
      });
    }, x(S), f(S, c, 'Generator'), f(S, a, function () {
      return this;
    }), f(S, 'toString', function () {
      return '[object Generator]';
    }), t.keys = function (e) {
      var t = Object(e),
        r = [];
      for (var n in t) r.push(n);
      return r.reverse(), function e() {
        for (; r.length;) {
          var n = r.pop();
          if (n in t) return e.value = n, e.done = !1, e;
        }
        return e.done = !0, e;
      };
    }, t.values = L, P.prototype = {
      constructor: P,
      reset: function reset(t) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = 'next', this.arg = e, this.tryEntries.forEach(A), !t) for (var r in this) 't' === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e);
      },
      stop: function stop() {
        this.done = !0;
        var e = this.tryEntries[0].completion;
        if ('throw' === e.type) throw e.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(t) {
        if (this.done) throw t;
        var r = this;
        function o(n, o) {
          return u.type = 'throw', u.arg = t, r.next = n, o && (r.method = 'next', r.arg = e), !!o;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var a = this.tryEntries[i],
            u = a.completion;
          if ('root' === a.tryLoc) return o('end');
          if (a.tryLoc <= this.prev) {
            var s = n.call(a, 'catchLoc'),
              c = n.call(a, 'finallyLoc');
            if (s && c) {
              if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
              if (this.prev < a.finallyLoc) return o(a.finallyLoc);
            } else if (s) {
              if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
            } else {
              if (!c) throw new Error('try statement without catch or finally');
              if (this.prev < a.finallyLoc) return o(a.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(e, t) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, 'finallyLoc') && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ('break' === e || 'continue' === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = e, a.arg = t, i ? (this.method = 'next', this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function complete(e, t) {
        if ('throw' === e.type) throw e.arg;
        return 'break' === e.type || 'continue' === e.type ? this.next = e.arg : 'return' === e.type ? (this.rval = this.arg = e.arg, this.method = 'return', this.next = 'end') : 'normal' === e.type && t && (this.next = t), y;
      },
      finish: function finish(e) {
        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
          var r = this.tryEntries[t];
          if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), A(r), y;
        }
      },
      catch: function _catch(e) {
        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
          var r = this.tryEntries[t];
          if (r.tryLoc === e) {
            var n = r.completion;
            if ('throw' === n.type) {
              var o = n.arg;
              A(r);
            }
            return o;
          }
        }
        throw new Error('illegal catch attempt');
      },
      delegateYield: function delegateYield(t, r, n) {
        return this.delegate = {
          iterator: L(t),
          resultName: r,
          nextLoc: n
        }, 'next' === this.method && (this.arg = e), y;
      }
    }, t;
  }
  function c(e) {
    var t = function (e, t) {
      if ('object' != _typeof(e) || !e) return e;
      var r = e[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(e, t || 'default');
        if ('object' != _typeof(n)) return n;
        throw new TypeError('@@toPrimitive must return a primitive value.');
      }
      return ('string' === t ? String : Number)(e);
    }(e, 'string');
    return 'symbol' == _typeof(t) ? t : String(t);
  }
  function f(e) {
    return f = 'function' == typeof Symbol && 'symbol' == _typeof(Symbol.iterator) ? function (e) {
      return _typeof(e);
    } : function (e) {
      return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? 'symbol' : _typeof(e);
    }, f(e);
  }
  function l(t) {
    return function () {
      return new e(t.apply(this, arguments));
    };
  }
  function p(e, t, r, n, o, i, a) {
    try {
      var u = e[i](a),
        s = u.value;
    } catch (e) {
      return void r(e);
    }
    u.done ? t(s) : Promise.resolve(s).then(n, o);
  }
  function d(e) {
    return function () {
      var t = this,
        r = arguments;
      return new Promise(function (n, o) {
        var i = e.apply(t, r);
        function a(e) {
          p(i, n, o, a, u, 'next', e);
        }
        function u(e) {
          p(i, n, o, a, u, 'throw', e);
        }
        a(void 0);
      });
    };
  }
  function h(e, t) {
    if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
  }
  function v(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      n.enumerable = n.enumerable || !1, n.configurable = !0, 'value' in n && (n.writable = !0), Object.defineProperty(e, c(n.key), n);
    }
  }
  function y(e, t, r) {
    return t && v(e.prototype, t), r && v(e, r), Object.defineProperty(e, 'prototype', {
      writable: !1
    }), e;
  }
  function m(e, t, r) {
    return (t = c(t)) in e ? Object.defineProperty(e, t, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = r, e;
  }
  function b(e, t) {
    return function (e) {
      if (Array.isArray(e)) return e;
    }(e) || function (e, t) {
      var r = null == e ? null : 'undefined' != typeof Symbol && e[Symbol.iterator] || e['@@iterator'];
      if (null != r) {
        var n,
          o,
          i,
          a,
          u = [],
          s = !0,
          c = !1;
        try {
          if (i = (r = r.call(e)).next, 0 === t) {
            if (Object(r) !== r) return;
            s = !1;
          } else for (; !(s = (n = i.call(r)).done) && (u.push(n.value), u.length !== t); s = !0);
        } catch (e) {
          c = !0, o = e;
        } finally {
          try {
            if (!s && null != r.return && (a = r.return(), Object(a) !== a)) return;
          } finally {
            if (c) throw o;
          }
        }
        return u;
      }
    }(e, t) || w(e, t) || function () {
      throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    }();
  }
  function g(e) {
    return function (e) {
      if (Array.isArray(e)) return E(e);
    }(e) || function (e) {
      if ('undefined' != typeof Symbol && null != e[Symbol.iterator] || null != e['@@iterator']) return Array.from(e);
    }(e) || w(e) || function () {
      throw new TypeError('Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    }();
  }
  function w(e, t) {
    if (e) {
      if ('string' == typeof e) return E(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return 'Object' === r && e.constructor && (r = e.constructor.name), 'Map' === r || 'Set' === r ? Array.from(e) : 'Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? E(e, t) : void 0;
    }
  }
  function E(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
    return n;
  }
  function O(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  e.prototype['function' == typeof Symbol && Symbol.asyncIterator || '@@asyncIterator'] = function () {
    return this;
  }, e.prototype.next = function (e) {
    return this._invoke('next', e);
  }, e.prototype.throw = function (e) {
    return this._invoke('throw', e);
  }, e.prototype.return = function (e) {
    return this._invoke('return', e);
  };
  var S,
    x = Object.prototype.toString,
    R = Object.getPrototypeOf,
    k = Symbol.iterator,
    T = Symbol.toStringTag,
    j = (S = Object.create(null), function (e) {
      var t = x.call(e);
      return S[t] || (S[t] = t.slice(8, -1).toLowerCase());
    }),
    A = function A(e) {
      return e = e.toLowerCase(), function (t) {
        return j(t) === e;
      };
    },
    P = function P(e) {
      return function (t) {
        return f(t) === e;
      };
    },
    L = Array.isArray,
    N = P('undefined');
  function C(e) {
    return null !== e && !N(e) && null !== e.constructor && !N(e.constructor) && F(e.constructor.isBuffer) && e.constructor.isBuffer(e);
  }
  var _ = A('ArrayBuffer');
  var U = P('string'),
    F = P('function'),
    B = P('number'),
    D = function D(e) {
      return null !== e && 'object' === f(e);
    },
    I = function I(e) {
      if ('object' !== j(e)) return !1;
      var t = R(e);
      return !(null !== t && t !== Object.prototype && null !== Object.getPrototypeOf(t) || T in e || k in e);
    },
    q = A('Date'),
    M = A('File'),
    z = A('Blob'),
    H = A('FileList'),
    J = A('URLSearchParams'),
    W = b(['ReadableStream', 'Request', 'Response', 'Headers'].map(A), 4),
    K = W[0],
    V = W[1],
    G = W[2],
    X = W[3];
  function $(e, t) {
    var r,
      n,
      o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      i = o.allOwnKeys,
      a = void 0 !== i && i;
    if (null != e) if ('object' !== f(e) && (e = [e]), L(e)) for (r = 0, n = e.length; r < n; r++) t.call(null, e[r], r, e);else {
      if (C(e)) return;
      var u,
        s = a ? Object.getOwnPropertyNames(e) : Object.keys(e),
        c = s.length;
      for (r = 0; r < c; r++) u = s[r], t.call(null, e[u], u, e);
    }
  }
  function Y(e, t) {
    if (C(e)) return null;
    t = t.toLowerCase();
    for (var r, n = Object.keys(e), o = n.length; o-- > 0;) if (t === (r = n[o]).toLowerCase()) return r;
    return null;
  }
  var Q = 'undefined' != typeof globalThis ? globalThis : 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : global,
    Z = function Z(e) {
      return !N(e) && e !== Q;
    };
  var ee,
    te = (ee = 'undefined' != typeof Uint8Array && R(Uint8Array), function (e) {
      return ee && e instanceof ee;
    }),
    re = A('HTMLFormElement'),
    ne = function (e) {
      var t = Object.prototype.hasOwnProperty;
      return function (e, r) {
        return t.call(e, r);
      };
    }(),
    oe = A('RegExp'),
    ie = function ie(e, t) {
      var r = Object.getOwnPropertyDescriptors(e),
        n = {};
      $(r, function (r, o) {
        var i;
        !1 !== (i = t(r, o, e)) && (n[o] = i || r);
      }), Object.defineProperties(e, n);
    };
  var ae,
    ue,
    se,
    ce,
    fe = A('AsyncFunction'),
    le = (ae = 'function' == typeof setImmediate, ue = F(Q.postMessage), ae ? setImmediate : ue ? (se = 'axios@'.concat(Math.random()), ce = [], Q.addEventListener('message', function (e) {
      var t = e.source,
        r = e.data;
      t === Q && r === se && ce.length && ce.shift()();
    }, !1), function (e) {
      ce.push(e), Q.postMessage(se, '*');
    }) : function (e) {
      return setTimeout(e);
    }),
    pe = 'undefined' != typeof queueMicrotask ? queueMicrotask.bind(Q) : 'undefined' != typeof process && process.nextTick || le,
    de = {
      isArray: L,
      isArrayBuffer: _,
      isBuffer: C,
      isFormData: function isFormData(e) {
        var t;
        return e && ('function' == typeof FormData && e instanceof FormData || F(e.append) && ('formdata' === (t = j(e)) || 'object' === t && F(e.toString) && '[object FormData]' === e.toString()));
      },
      isArrayBufferView: function isArrayBufferView(e) {
        return 'undefined' != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && _(e.buffer);
      },
      isString: U,
      isNumber: B,
      isBoolean: function isBoolean(e) {
        return !0 === e || !1 === e;
      },
      isObject: D,
      isPlainObject: I,
      isEmptyObject: function isEmptyObject(e) {
        if (!D(e) || C(e)) return !1;
        try {
          return 0 === Object.keys(e).length && Object.getPrototypeOf(e) === Object.prototype;
        } catch (e) {
          return !1;
        }
      },
      isReadableStream: K,
      isRequest: V,
      isResponse: G,
      isHeaders: X,
      isUndefined: N,
      isDate: q,
      isFile: M,
      isBlob: z,
      isRegExp: oe,
      isFunction: F,
      isStream: function isStream(e) {
        return D(e) && F(e.pipe);
      },
      isURLSearchParams: J,
      isTypedArray: te,
      isFileList: H,
      forEach: $,
      merge: function e() {
        for (var t = Z(this) && this || {}, r = t.caseless, n = t.skipUndefined, o = {}, i = function i(t, _i) {
            var a = r && Y(o, _i) || _i;
            I(o[a]) && I(t) ? o[a] = e(o[a], t) : I(t) ? o[a] = e({}, t) : L(t) ? o[a] = t.slice() : n && N(t) || (o[a] = t);
          }, a = 0, u = arguments.length; a < u; a++) arguments[a] && $(arguments[a], i);
        return o;
      },
      extend: function extend(e, t, r) {
        var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
          o = n.allOwnKeys;
        return $(t, function (t, n) {
          r && F(t) ? e[n] = O(t, r) : e[n] = t;
        }, {
          allOwnKeys: o
        }), e;
      },
      trim: function trim(e) {
        return e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      },
      stripBOM: function stripBOM(e) {
        return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e;
      },
      inherits: function inherits(e, t, r, n) {
        e.prototype = Object.create(t.prototype, n), e.prototype.constructor = e, Object.defineProperty(e, 'super', {
          value: t.prototype
        }), r && Object.assign(e.prototype, r);
      },
      toFlatObject: function toFlatObject(e, t, r, n) {
        var o,
          i,
          a,
          u = {};
        if (t = t || {}, null == e) return t;
        do {
          for (i = (o = Object.getOwnPropertyNames(e)).length; i-- > 0;) a = o[i], n && !n(a, e, t) || u[a] || (t[a] = e[a], u[a] = !0);
          e = !1 !== r && R(e);
        } while (e && (!r || r(e, t)) && e !== Object.prototype);
        return t;
      },
      kindOf: j,
      kindOfTest: A,
      endsWith: function endsWith(e, t, r) {
        e = String(e), (void 0 === r || r > e.length) && (r = e.length), r -= t.length;
        var n = e.indexOf(t, r);
        return -1 !== n && n === r;
      },
      toArray: function toArray(e) {
        if (!e) return null;
        if (L(e)) return e;
        var t = e.length;
        if (!B(t)) return null;
        for (var r = new Array(t); t-- > 0;) r[t] = e[t];
        return r;
      },
      forEachEntry: function forEachEntry(e, t) {
        for (var r, n = (e && e[k]).call(e); (r = n.next()) && !r.done;) {
          var o = r.value;
          t.call(e, o[0], o[1]);
        }
      },
      matchAll: function matchAll(e, t) {
        for (var r, n = []; null !== (r = e.exec(t));) n.push(r);
        return n;
      },
      isHTMLForm: re,
      hasOwnProperty: ne,
      hasOwnProp: ne,
      reduceDescriptors: ie,
      freezeMethods: function freezeMethods(e) {
        ie(e, function (t, r) {
          if (F(e) && -1 !== ['arguments', 'caller', 'callee'].indexOf(r)) return !1;
          var n = e[r];
          F(n) && (t.enumerable = !1, 'writable' in t ? t.writable = !1 : t.set || (t.set = function () {
            throw Error("Can not rewrite read-only method '" + r + "'");
          }));
        });
      },
      toObjectSet: function toObjectSet(e, t) {
        var r = {},
          n = function n(e) {
            e.forEach(function (e) {
              r[e] = !0;
            });
          };
        return L(e) ? n(e) : n(String(e).split(t)), r;
      },
      toCamelCase: function toCamelCase(e) {
        return e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, r) {
          return t.toUpperCase() + r;
        });
      },
      noop: function noop() {},
      toFiniteNumber: function toFiniteNumber(e, t) {
        return null != e && Number.isFinite(e = +e) ? e : t;
      },
      findKey: Y,
      global: Q,
      isContextDefined: Z,
      isSpecCompliantForm: function isSpecCompliantForm(e) {
        return !!(e && F(e.append) && 'FormData' === e[T] && e[k]);
      },
      toJSONObject: function toJSONObject(e) {
        var t = new Array(10);
        return function e(r, n) {
          if (D(r)) {
            if (t.indexOf(r) >= 0) return;
            if (C(r)) return r;
            if (!('toJSON' in r)) {
              t[n] = r;
              var o = L(r) ? [] : {};
              return $(r, function (t, r) {
                var i = e(t, n + 1);
                !N(i) && (o[r] = i);
              }), t[n] = void 0, o;
            }
          }
          return r;
        }(e, 0);
      },
      isAsyncFn: fe,
      isThenable: function isThenable(e) {
        return e && (D(e) || F(e)) && F(e.then) && F(e.catch);
      },
      setImmediate: le,
      asap: pe,
      isIterable: function isIterable(e) {
        return null != e && F(e[k]);
      }
    };
  function he(e, t, r, n, o) {
    Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = 'AxiosError', t && (this.code = t), r && (this.config = r), n && (this.request = n), o && (this.response = o, this.status = o.status ? o.status : null);
  }
  de.inherits(he, Error, {
    toJSON: function toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: de.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  var ve = he.prototype,
    ye = {};
  ['ERR_BAD_OPTION_VALUE', 'ERR_BAD_OPTION', 'ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK', 'ERR_FR_TOO_MANY_REDIRECTS', 'ERR_DEPRECATED', 'ERR_BAD_RESPONSE', 'ERR_BAD_REQUEST', 'ERR_CANCELED', 'ERR_NOT_SUPPORT', 'ERR_INVALID_URL'].forEach(function (e) {
    ye[e] = {
      value: e
    };
  }), Object.defineProperties(he, ye), Object.defineProperty(ve, 'isAxiosError', {
    value: !0
  }), he.from = function (e, t, r, n, o, i) {
    var a = Object.create(ve);
    de.toFlatObject(e, a, function (e) {
      return e !== Error.prototype;
    }, function (e) {
      return 'isAxiosError' !== e;
    });
    var u = e && e.message ? e.message : 'Error',
      s = null == t && e ? e.code : t;
    return he.call(a, u, s, r, n, o), e && null == a.cause && Object.defineProperty(a, 'cause', {
      value: e,
      configurable: !0
    }), a.name = e && e.name || 'Error', i && Object.assign(a, i), a;
  };
  function me(e) {
    return de.isPlainObject(e) || de.isArray(e);
  }
  function be(e) {
    return de.endsWith(e, '[]') ? e.slice(0, -2) : e;
  }
  function ge(e, t, r) {
    return e ? e.concat(t).map(function (e, t) {
      return e = be(e), !r && t ? '[' + e + ']' : e;
    }).join(r ? '.' : '') : t;
  }
  var we = de.toFlatObject(de, {}, null, function (e) {
    return /^is[A-Z]/.test(e);
  });
  function Ee(e, t, r) {
    if (!de.isObject(e)) throw new TypeError('target must be an object');
    t = t || new FormData();
    var n = (r = de.toFlatObject(r, {
        metaTokens: !0,
        dots: !1,
        indexes: !1
      }, !1, function (e, t) {
        return !de.isUndefined(t[e]);
      })).metaTokens,
      o = r.visitor || c,
      i = r.dots,
      a = r.indexes,
      u = (r.Blob || 'undefined' != typeof Blob && Blob) && de.isSpecCompliantForm(t);
    if (!de.isFunction(o)) throw new TypeError('visitor must be a function');
    function s(e) {
      if (null === e) return '';
      if (de.isDate(e)) return e.toISOString();
      if (de.isBoolean(e)) return e.toString();
      if (!u && de.isBlob(e)) throw new he('Blob is not supported. Use a Buffer instead.');
      return de.isArrayBuffer(e) || de.isTypedArray(e) ? u && 'function' == typeof Blob ? new Blob([e]) : Buffer.from(e) : e;
    }
    function c(e, r, o) {
      var u = e;
      if (e && !o && 'object' === f(e)) if (de.endsWith(r, '{}')) r = n ? r : r.slice(0, -2), e = JSON.stringify(e);else if (de.isArray(e) && function (e) {
        return de.isArray(e) && !e.some(me);
      }(e) || (de.isFileList(e) || de.endsWith(r, '[]')) && (u = de.toArray(e))) return r = be(r), u.forEach(function (e, n) {
        !de.isUndefined(e) && null !== e && t.append(!0 === a ? ge([r], n, i) : null === a ? r : r + '[]', s(e));
      }), !1;
      return !!me(e) || (t.append(ge(o, r, i), s(e)), !1);
    }
    var l = [],
      p = Object.assign(we, {
        defaultVisitor: c,
        convertValue: s,
        isVisitable: me
      });
    if (!de.isObject(e)) throw new TypeError('data must be an object');
    return function e(r, n) {
      if (!de.isUndefined(r)) {
        if (-1 !== l.indexOf(r)) throw Error('Circular reference detected in ' + n.join('.'));
        l.push(r), de.forEach(r, function (r, i) {
          !0 === (!(de.isUndefined(r) || null === r) && o.call(t, r, de.isString(i) ? i.trim() : i, n, p)) && e(r, n ? n.concat(i) : [i]);
        }), l.pop();
      }
    }(e), t;
  }
  function Oe(e) {
    var t = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\0'
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
      return t[e];
    });
  }
  function Se(e, t) {
    this._pairs = [], e && Ee(e, this, t);
  }
  var xe = Se.prototype;
  function Re(e) {
    return encodeURIComponent(e).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
  }
  function ke(e, t, r) {
    if (!t) return e;
    var n = r && r.encode || Re;
    de.isFunction(r) && (r = {
      serialize: r
    });
    var o,
      i = r && r.serialize;
    if (o = i ? i(t, r) : de.isURLSearchParams(t) ? t.toString() : new Se(t, r).toString(n)) {
      var a = e.indexOf('#');
      -1 !== a && (e = e.slice(0, a)), e += (-1 === e.indexOf('?') ? '?' : '&') + o;
    }
    return e;
  }
  xe.append = function (e, t) {
    this._pairs.push([e, t]);
  }, xe.toString = function (e) {
    var t = e ? function (t) {
      return e.call(this, t, Oe);
    } : Oe;
    return this._pairs.map(function (e) {
      return t(e[0]) + '=' + t(e[1]);
    }, '').join('&');
  };
  var Te = function () {
      function e() {
        h(this, e), this.handlers = [];
      }
      return y(e, [{
        key: 'use',
        value: function value(e, t, r) {
          return this.handlers.push({
            fulfilled: e,
            rejected: t,
            synchronous: !!r && r.synchronous,
            runWhen: r ? r.runWhen : null
          }), this.handlers.length - 1;
        }
      }, {
        key: 'eject',
        value: function value(e) {
          this.handlers[e] && (this.handlers[e] = null);
        }
      }, {
        key: 'clear',
        value: function value() {
          this.handlers && (this.handlers = []);
        }
      }, {
        key: 'forEach',
        value: function value(e) {
          de.forEach(this.handlers, function (t) {
            null !== t && e(t);
          });
        }
      }]), e;
    }(),
    je = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1
    },
    Ae = {
      isBrowser: !0,
      classes: {
        URLSearchParams: 'undefined' != typeof URLSearchParams ? URLSearchParams : Se,
        FormData: 'undefined' != typeof FormData ? FormData : null,
        Blob: 'undefined' != typeof Blob ? Blob : null
      },
      protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
    },
    Pe = 'undefined' != typeof window && 'undefined' != typeof document,
    Le = 'object' === ('undefined' == typeof navigator ? 'undefined' : f(navigator)) && navigator || void 0,
    Ne = Pe && (!Le || ['ReactNative', 'NativeScript', 'NS'].indexOf(Le.product) < 0),
    Ce = 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && 'function' == typeof self.importScripts,
    _e = Pe && window.location.href || 'http://localhost',
    Ue = u(u({}, Object.freeze({
      __proto__: null,
      hasBrowserEnv: Pe,
      hasStandardBrowserWebWorkerEnv: Ce,
      hasStandardBrowserEnv: Ne,
      navigator: Le,
      origin: _e
    })), Ae);
  function Fe(e) {
    function t(e, r, n, o) {
      var i = e[o++];
      if ('__proto__' === i) return !0;
      var a = Number.isFinite(+i),
        u = o >= e.length;
      return i = !i && de.isArray(n) ? n.length : i, u ? (de.hasOwnProp(n, i) ? n[i] = [n[i], r] : n[i] = r, !a) : (n[i] && de.isObject(n[i]) || (n[i] = []), t(e, r, n[i], o) && de.isArray(n[i]) && (n[i] = function (e) {
        var t,
          r,
          n = {},
          o = Object.keys(e),
          i = o.length;
        for (t = 0; t < i; t++) n[r = o[t]] = e[r];
        return n;
      }(n[i])), !a);
    }
    if (de.isFormData(e) && de.isFunction(e.entries)) {
      var r = {};
      return de.forEachEntry(e, function (e, n) {
        t(function (e) {
          return de.matchAll(/\w+|\[(\w*)]/g, e).map(function (e) {
            return '[]' === e[0] ? '' : e[1] || e[0];
          });
        }(e), n, r, 0);
      }), r;
    }
    return null;
  }
  var Be = {
    transitional: je,
    adapter: ['xhr', 'http', 'fetch'],
    transformRequest: [function (e, t) {
      var r,
        n = t.getContentType() || '',
        o = n.indexOf('application/json') > -1,
        i = de.isObject(e);
      if (i && de.isHTMLForm(e) && (e = new FormData(e)), de.isFormData(e)) return o ? JSON.stringify(Fe(e)) : e;
      if (de.isArrayBuffer(e) || de.isBuffer(e) || de.isStream(e) || de.isFile(e) || de.isBlob(e) || de.isReadableStream(e)) return e;
      if (de.isArrayBufferView(e)) return e.buffer;
      if (de.isURLSearchParams(e)) return t.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1), e.toString();
      if (i) {
        if (n.indexOf('application/x-www-form-urlencoded') > -1) return function (e, t) {
          return Ee(e, new Ue.classes.URLSearchParams(), u({
            visitor: function visitor(e, t, r, n) {
              return Ue.isNode && de.isBuffer(e) ? (this.append(t, e.toString('base64')), !1) : n.defaultVisitor.apply(this, arguments);
            }
          }, t));
        }(e, this.formSerializer).toString();
        if ((r = de.isFileList(e)) || n.indexOf('multipart/form-data') > -1) {
          var a = this.env && this.env.FormData;
          return Ee(r ? {
            'files[]': e
          } : e, a && new a(), this.formSerializer);
        }
      }
      return i || o ? (t.setContentType('application/json', !1), function (e, t, r) {
        if (de.isString(e)) try {
          return (t || JSON.parse)(e), de.trim(e);
        } catch (e) {
          if ('SyntaxError' !== e.name) throw e;
        }
        return (r || JSON.stringify)(e);
      }(e)) : e;
    }],
    transformResponse: [function (e) {
      var t = this.transitional || Be.transitional,
        r = t && t.forcedJSONParsing,
        n = 'json' === this.responseType;
      if (de.isResponse(e) || de.isReadableStream(e)) return e;
      if (e && de.isString(e) && (r && !this.responseType || n)) {
        var o = !(t && t.silentJSONParsing) && n;
        try {
          return JSON.parse(e, this.parseReviver);
        } catch (e) {
          if (o) {
            if ('SyntaxError' === e.name) throw he.from(e, he.ERR_BAD_RESPONSE, this, null, this.response);
            throw e;
          }
        }
      }
      return e;
    }],
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: Ue.classes.FormData,
      Blob: Ue.classes.Blob
    },
    validateStatus: function validateStatus(e) {
      return e >= 200 && e < 300;
    },
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': void 0
      }
    }
  };
  de.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], function (e) {
    Be.headers[e] = {};
  });
  var De = Be,
    Ie = de.toObjectSet(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']),
    qe = Symbol('internals');
  function Me(e) {
    return e && String(e).trim().toLowerCase();
  }
  function ze(e) {
    return !1 === e || null == e ? e : de.isArray(e) ? e.map(ze) : String(e);
  }
  function He(e, t, r, n, o) {
    return de.isFunction(n) ? n.call(this, t, r) : (o && (t = r), de.isString(t) ? de.isString(n) ? -1 !== t.indexOf(n) : de.isRegExp(n) ? n.test(t) : void 0 : void 0);
  }
  var Je = function (e, t) {
    function r(e) {
      h(this, r), e && this.set(e);
    }
    return y(r, [{
      key: 'set',
      value: function value(e, t, r) {
        var n = this;
        function o(e, t, r) {
          var o = Me(t);
          if (!o) throw new Error('header name must be a non-empty string');
          var i = de.findKey(n, o);
          (!i || void 0 === n[i] || !0 === r || void 0 === r && !1 !== n[i]) && (n[i || t] = ze(e));
        }
        var i = function i(e, t) {
          return de.forEach(e, function (e, r) {
            return o(e, r, t);
          });
        };
        if (de.isPlainObject(e) || e instanceof this.constructor) i(e, t);else if (de.isString(e) && (e = e.trim()) && !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())) i(function (e) {
          var t,
            r,
            n,
            o = {};
          return e && e.split('\n').forEach(function (e) {
            n = e.indexOf(':'), t = e.substring(0, n).trim().toLowerCase(), r = e.substring(n + 1).trim(), !t || o[t] && Ie[t] || ('set-cookie' === t ? o[t] ? o[t].push(r) : o[t] = [r] : o[t] = o[t] ? o[t] + ', ' + r : r);
          }), o;
        }(e), t);else if (de.isObject(e) && de.isIterable(e)) {
          var a,
            u,
            s,
            c = {},
            f = function (e, t) {
              var r = 'undefined' != typeof Symbol && e[Symbol.iterator] || e['@@iterator'];
              if (!r) {
                if (Array.isArray(e) || (r = w(e)) || t && e && 'number' == typeof e.length) {
                  r && (e = r);
                  var _n = 0,
                    o = function o() {};
                  return {
                    s: o,
                    n: function n() {
                      return _n >= e.length ? {
                        done: !0
                      } : {
                        done: !1,
                        value: e[_n++]
                      };
                    },
                    e: function e(_e2) {
                      throw _e2;
                    },
                    f: o
                  };
                }
                throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
              }
              var i,
                a = !0,
                u = !1;
              return {
                s: function s() {
                  r = r.call(e);
                },
                n: function n() {
                  var e = r.next();
                  return a = e.done, e;
                },
                e: function e(_e3) {
                  u = !0, i = _e3;
                },
                f: function f() {
                  try {
                    a || null == r.return || r.return();
                  } finally {
                    if (u) throw i;
                  }
                }
              };
            }(e);
          try {
            for (f.s(); !(s = f.n()).done;) {
              var l = s.value;
              if (!de.isArray(l)) throw TypeError('Object iterator must return a key-value pair');
              c[u = l[0]] = (a = c[u]) ? de.isArray(a) ? [].concat(g(a), [l[1]]) : [a, l[1]] : l[1];
            }
          } catch (e) {
            f.e(e);
          } finally {
            f.f();
          }
          i(c, t);
        } else null != e && o(t, e, r);
        return this;
      }
    }, {
      key: 'get',
      value: function value(e, t) {
        if (e = Me(e)) {
          var r = de.findKey(this, e);
          if (r) {
            var n = this[r];
            if (!t) return n;
            if (!0 === t) return function (e) {
              for (var t, r = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g; t = n.exec(e);) r[t[1]] = t[2];
              return r;
            }(n);
            if (de.isFunction(t)) return t.call(this, n, r);
            if (de.isRegExp(t)) return t.exec(n);
            throw new TypeError('parser must be boolean|regexp|function');
          }
        }
      }
    }, {
      key: 'has',
      value: function value(e, t) {
        if (e = Me(e)) {
          var r = de.findKey(this, e);
          return !(!r || void 0 === this[r] || t && !He(0, this[r], r, t));
        }
        return !1;
      }
    }, {
      key: 'delete',
      value: function value(e, t) {
        var r = this,
          n = !1;
        function o(e) {
          if (e = Me(e)) {
            var o = de.findKey(r, e);
            !o || t && !He(0, r[o], o, t) || (delete r[o], n = !0);
          }
        }
        return de.isArray(e) ? e.forEach(o) : o(e), n;
      }
    }, {
      key: 'clear',
      value: function value(e) {
        for (var t = Object.keys(this), r = t.length, n = !1; r--;) {
          var o = t[r];
          e && !He(0, this[o], o, e, !0) || (delete this[o], n = !0);
        }
        return n;
      }
    }, {
      key: 'normalize',
      value: function value(e) {
        var t = this,
          r = {};
        return de.forEach(this, function (n, o) {
          var i = de.findKey(r, o);
          if (i) return t[i] = ze(n), void delete t[o];
          var a = e ? function (e) {
            return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, function (e, t, r) {
              return t.toUpperCase() + r;
            });
          }(o) : String(o).trim();
          a !== o && delete t[o], t[a] = ze(n), r[a] = !0;
        }), this;
      }
    }, {
      key: 'concat',
      value: function value() {
        for (var e, t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
        return (e = this.constructor).concat.apply(e, [this].concat(r));
      }
    }, {
      key: 'toJSON',
      value: function value(e) {
        var t = Object.create(null);
        return de.forEach(this, function (r, n) {
          null != r && !1 !== r && (t[n] = e && de.isArray(r) ? r.join(', ') : r);
        }), t;
      }
    }, {
      key: Symbol.iterator,
      value: function value() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
    }, {
      key: 'toString',
      value: function value() {
        return Object.entries(this.toJSON()).map(function (e) {
          var t = b(e, 2);
          return t[0] + ': ' + t[1];
        }).join('\n');
      }
    }, {
      key: 'getSetCookie',
      value: function value() {
        return this.get('set-cookie') || [];
      }
    }, {
      key: Symbol.toStringTag,
      get: function get() {
        return 'AxiosHeaders';
      }
    }], [{
      key: 'from',
      value: function value(e) {
        return e instanceof this ? e : new this(e);
      }
    }, {
      key: 'concat',
      value: function value(e) {
        for (var t = new this(e), r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++) n[o - 1] = arguments[o];
        return n.forEach(function (e) {
          return t.set(e);
        }), t;
      }
    }, {
      key: 'accessor',
      value: function value(e) {
        var t = (this[qe] = this[qe] = {
            accessors: {}
          }).accessors,
          r = this.prototype;
        function n(e) {
          var n = Me(e);
          t[n] || (!function (e, t) {
            var r = de.toCamelCase(' ' + t);
            ['get', 'set', 'has'].forEach(function (n) {
              Object.defineProperty(e, n + r, {
                value: function value(e, r, o) {
                  return this[n].call(this, t, e, r, o);
                },
                configurable: !0
              });
            });
          }(r, e), t[n] = !0);
        }
        return de.isArray(e) ? e.forEach(n) : n(e), this;
      }
    }]), r;
  }();
  Je.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']), de.reduceDescriptors(Je.prototype, function (e, t) {
    var r = e.value,
      n = t[0].toUpperCase() + t.slice(1);
    return {
      get: function get() {
        return r;
      },
      set: function set(e) {
        this[n] = e;
      }
    };
  }), de.freezeMethods(Je);
  var We = Je;
  function Ke(e, t) {
    var r = this || De,
      n = t || r,
      o = We.from(n.headers),
      i = n.data;
    return de.forEach(e, function (e) {
      i = e.call(r, i, o.normalize(), t ? t.status : void 0);
    }), o.normalize(), i;
  }
  function Ve(e) {
    return !(!e || !e.__CANCEL__);
  }
  function Ge(e, t, r) {
    he.call(this, null == e ? 'canceled' : e, he.ERR_CANCELED, t, r), this.name = 'CanceledError';
  }
  function Xe(e, t, r) {
    var n = r.config.validateStatus;
    r.status && n && !n(r.status) ? t(new he('Request failed with status code ' + r.status, [he.ERR_BAD_REQUEST, he.ERR_BAD_RESPONSE][Math.floor(r.status / 100) - 4], r.config, r.request, r)) : e(r);
  }
  function $e(e, t) {
    e = e || 10;
    var r,
      n = new Array(e),
      o = new Array(e),
      i = 0,
      a = 0;
    return t = void 0 !== t ? t : 1e3, function (u) {
      var s = Date.now(),
        c = o[a];
      r || (r = s), n[i] = u, o[i] = s;
      for (var f = a, l = 0; f !== i;) l += n[f++], f %= e;
      if ((i = (i + 1) % e) === a && (a = (a + 1) % e), !(s - r < t)) {
        var p = c && s - c;
        return p ? Math.round(1e3 * l / p) : void 0;
      }
    };
  }
  function Ye(e, t) {
    var r,
      n,
      o = 0,
      i = 1e3 / t,
      a = function a(t) {
        var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Date.now();
        o = i, r = null, n && (clearTimeout(n), n = null), e.apply(void 0, g(t));
      };
    return [function () {
      for (var e = Date.now(), t = e - o, u = arguments.length, s = new Array(u), c = 0; c < u; c++) s[c] = arguments[c];
      t >= i ? a(s, e) : (r = s, n || (n = setTimeout(function () {
        n = null, a(r);
      }, i - t)));
    }, function () {
      return r && a(r);
    }];
  }
  de.inherits(Ge, he, {
    __CANCEL__: !0
  });
  var Qe = function Qe(e, t) {
      var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3,
        n = 0,
        o = $e(50, 250);
      return Ye(function (r) {
        var i = r.loaded,
          a = r.lengthComputable ? r.total : void 0,
          u = i - n,
          s = o(u);
        n = i;
        var c = m({
          loaded: i,
          total: a,
          progress: a ? i / a : void 0,
          bytes: u,
          rate: s || void 0,
          estimated: s && a && i <= a ? (a - i) / s : void 0,
          event: r,
          lengthComputable: null != a
        }, t ? 'download' : 'upload', !0);
        e(c);
      }, r);
    },
    Ze = function Ze(e, t) {
      var r = null != e;
      return [function (n) {
        return t[0]({
          lengthComputable: r,
          total: e,
          loaded: n
        });
      }, t[1]];
    },
    et = function et(e) {
      return function () {
        for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
        return de.asap(function () {
          return e.apply(void 0, r);
        });
      };
    },
    tt = Ue.hasStandardBrowserEnv ? function (e, t) {
      return function (r) {
        return r = new URL(r, Ue.origin), e.protocol === r.protocol && e.host === r.host && (t || e.port === r.port);
      };
    }(new URL(Ue.origin), Ue.navigator && /(msie|trident)/i.test(Ue.navigator.userAgent)) : function () {
      return !0;
    },
    rt = Ue.hasStandardBrowserEnv ? {
      write: function write(e, t, r, n, o, i, a) {
        if ('undefined' != typeof document) {
          var u = [''.concat(e, '=').concat(encodeURIComponent(t))];
          de.isNumber(r) && u.push('expires='.concat(new Date(r).toUTCString())), de.isString(n) && u.push('path='.concat(n)), de.isString(o) && u.push('domain='.concat(o)), !0 === i && u.push('secure'), de.isString(a) && u.push('SameSite='.concat(a)), document.cookie = u.join('; ');
        }
      },
      read: function read(e) {
        if ('undefined' == typeof document) return null;
        var t = document.cookie.match(new RegExp('(?:^|; )' + e + '=([^;]*)'));
        return t ? decodeURIComponent(t[1]) : null;
      },
      remove: function remove(e) {
        this.write(e, '', Date.now() - 864e5, '/');
      }
    } : {
      write: function write() {},
      read: function read() {
        return null;
      },
      remove: function remove() {}
    };
  function nt(e, t, r) {
    var n = !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t);
    return e && (n || 0 == r) ? function (e, t) {
      return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e;
    }(e, t) : t;
  }
  var ot = function ot(e) {
    return e instanceof We ? u({}, e) : e;
  };
  function it(e, t) {
    t = t || {};
    var r = {};
    function n(e, t, r, n) {
      return de.isPlainObject(e) && de.isPlainObject(t) ? de.merge.call({
        caseless: n
      }, e, t) : de.isPlainObject(t) ? de.merge({}, t) : de.isArray(t) ? t.slice() : t;
    }
    function o(e, t, r, o) {
      return de.isUndefined(t) ? de.isUndefined(e) ? void 0 : n(void 0, e, 0, o) : n(e, t, 0, o);
    }
    function i(e, t) {
      if (!de.isUndefined(t)) return n(void 0, t);
    }
    function a(e, t) {
      return de.isUndefined(t) ? de.isUndefined(e) ? void 0 : n(void 0, e) : n(void 0, t);
    }
    function s(r, o, i) {
      return i in t ? n(r, o) : i in e ? n(void 0, r) : void 0;
    }
    var c = {
      url: i,
      method: i,
      data: i,
      baseURL: a,
      transformRequest: a,
      transformResponse: a,
      paramsSerializer: a,
      timeout: a,
      timeoutMessage: a,
      withCredentials: a,
      withXSRFToken: a,
      adapter: a,
      responseType: a,
      xsrfCookieName: a,
      xsrfHeaderName: a,
      onUploadProgress: a,
      onDownloadProgress: a,
      decompress: a,
      maxContentLength: a,
      maxBodyLength: a,
      beforeRedirect: a,
      transport: a,
      httpAgent: a,
      httpsAgent: a,
      cancelToken: a,
      socketPath: a,
      responseEncoding: a,
      validateStatus: s,
      headers: function headers(e, t, r) {
        return o(ot(e), ot(t), 0, !0);
      }
    };
    return de.forEach(Object.keys(u(u({}, e), t)), function (n) {
      var i = c[n] || o,
        a = i(e[n], t[n], n);
      de.isUndefined(a) && i !== s || (r[n] = a);
    }), r;
  }
  var at,
    ut = function ut(e) {
      var t = it({}, e),
        r = t.data,
        n = t.withXSRFToken,
        o = t.xsrfHeaderName,
        i = t.xsrfCookieName,
        a = t.headers,
        u = t.auth;
      if (t.headers = a = We.from(a), t.url = ke(nt(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), u && a.set('Authorization', 'Basic ' + btoa((u.username || '') + ':' + (u.password ? unescape(encodeURIComponent(u.password)) : ''))), de.isFormData(r)) if (Ue.hasStandardBrowserEnv || Ue.hasStandardBrowserWebWorkerEnv) a.setContentType(void 0);else if (de.isFunction(r.getHeaders)) {
        var s = r.getHeaders(),
          c = ['content-type', 'content-length'];
        Object.entries(s).forEach(function (e) {
          var t = b(e, 2),
            r = t[0],
            n = t[1];
          c.includes(r.toLowerCase()) && a.set(r, n);
        });
      }
      if (Ue.hasStandardBrowserEnv && (n && de.isFunction(n) && (n = n(t)), n || !1 !== n && tt(t.url))) {
        var f = o && i && rt.read(i);
        f && a.set(o, f);
      }
      return t;
    },
    st = 'undefined' != typeof XMLHttpRequest && function (e) {
      return new Promise(function (t, r) {
        var n,
          o,
          i,
          a,
          u,
          s = ut(e),
          c = s.data,
          f = We.from(s.headers).normalize(),
          l = s.responseType,
          p = s.onUploadProgress,
          d = s.onDownloadProgress;
        function h() {
          a && a(), u && u(), s.cancelToken && s.cancelToken.unsubscribe(n), s.signal && s.signal.removeEventListener('abort', n);
        }
        var v = new XMLHttpRequest();
        function y() {
          if (v) {
            var n = We.from('getAllResponseHeaders' in v && v.getAllResponseHeaders());
            Xe(function (e) {
              t(e), h();
            }, function (e) {
              r(e), h();
            }, {
              data: l && 'text' !== l && 'json' !== l ? v.response : v.responseText,
              status: v.status,
              statusText: v.statusText,
              headers: n,
              config: e,
              request: v
            }), v = null;
          }
        }
        if (v.open(s.method.toUpperCase(), s.url, !0), v.timeout = s.timeout, 'onloadend' in v ? v.onloadend = y : v.onreadystatechange = function () {
          v && 4 === v.readyState && (0 !== v.status || v.responseURL && 0 === v.responseURL.indexOf('file:')) && setTimeout(y);
        }, v.onabort = function () {
          v && (r(new he('Request aborted', he.ECONNABORTED, e, v)), v = null);
        }, v.onerror = function (t) {
          var n = new he(t && t.message ? t.message : 'Network Error', he.ERR_NETWORK, e, v);
          n.event = t || null, r(n), v = null;
        }, v.ontimeout = function () {
          var t = s.timeout ? 'timeout of ' + s.timeout + 'ms exceeded' : 'timeout exceeded',
            n = s.transitional || je;
          s.timeoutErrorMessage && (t = s.timeoutErrorMessage), r(new he(t, n.clarifyTimeoutError ? he.ETIMEDOUT : he.ECONNABORTED, e, v)), v = null;
        }, void 0 === c && f.setContentType(null), 'setRequestHeader' in v && de.forEach(f.toJSON(), function (e, t) {
          v.setRequestHeader(t, e);
        }), de.isUndefined(s.withCredentials) || (v.withCredentials = !!s.withCredentials), l && 'json' !== l && (v.responseType = s.responseType), d) {
          var m = b(Qe(d, !0), 2);
          i = m[0], u = m[1], v.addEventListener('progress', i);
        }
        if (p && v.upload) {
          var g = b(Qe(p), 2);
          o = g[0], a = g[1], v.upload.addEventListener('progress', o), v.upload.addEventListener('loadend', a);
        }
        (s.cancelToken || s.signal) && (n = function n(t) {
          v && (r(!t || t.type ? new Ge(null, e, v) : t), v.abort(), v = null);
        }, s.cancelToken && s.cancelToken.subscribe(n), s.signal && (s.signal.aborted ? n() : s.signal.addEventListener('abort', n)));
        var w,
          E,
          O = (w = s.url, (E = /^([-+\w]{1,25})(:?\/\/|:)/.exec(w)) && E[1] || '');
        O && -1 === Ue.protocols.indexOf(O) ? r(new he('Unsupported protocol ' + O + ':', he.ERR_BAD_REQUEST, e)) : v.send(c || null);
      });
    },
    ct = function ct(e, t) {
      var r = (e = e ? e.filter(Boolean) : []).length;
      if (t || r) {
        var n,
          o = new AbortController(),
          i = function i(e) {
            if (!n) {
              n = !0, u();
              var t = e instanceof Error ? e : this.reason;
              o.abort(t instanceof he ? t : new Ge(t instanceof Error ? t.message : t));
            }
          },
          a = t && setTimeout(function () {
            a = null, i(new he('timeout '.concat(t, ' of ms exceeded'), he.ETIMEDOUT));
          }, t),
          u = function u() {
            e && (a && clearTimeout(a), a = null, e.forEach(function (e) {
              e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener('abort', i);
            }), e = null);
          };
        e.forEach(function (e) {
          return e.addEventListener('abort', i);
        });
        var s = o.signal;
        return s.unsubscribe = function () {
          return de.asap(u);
        }, s;
      }
    },
    ft = s().mark(function e(t, r) {
      var n, o, i;
      return s().wrap(function (e) {
        for (;;) switch (e.prev = e.next) {
          case 0:
            if (n = t.byteLength, r && !(n < r)) {
              e.next = 5;
              break;
            }
            return e.next = 4, t;
          case 4:
            return e.abrupt('return');
          case 5:
            o = 0;
          case 6:
            if (!(o < n)) {
              e.next = 13;
              break;
            }
            return i = o + r, e.next = 10, t.slice(o, i);
          case 10:
            o = i, e.next = 6;
            break;
          case 13:
          case 'end':
            return e.stop();
        }
      }, e);
    }),
    lt = function () {
      var e = l(s().mark(function e(t, o) {
        var a, u, c, f, l, p;
        return s().wrap(function (e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              a = !1, u = !1, e.prev = 2, f = n(pt(t));
            case 4:
              return e.next = 6, i(f.next());
            case 6:
              if (!(a = !(l = e.sent).done)) {
                e.next = 12;
                break;
              }
              return p = l.value, e.delegateYield(r(n(ft(p, o))), 't0', 9);
            case 9:
              a = !1, e.next = 4;
              break;
            case 12:
              e.next = 18;
              break;
            case 14:
              e.prev = 14, e.t1 = e.catch(2), u = !0, c = e.t1;
            case 18:
              if (e.prev = 18, e.prev = 19, !a || null == f.return) {
                e.next = 23;
                break;
              }
              return e.next = 23, i(f.return());
            case 23:
              if (e.prev = 23, !u) {
                e.next = 26;
                break;
              }
              throw c;
            case 26:
              return e.finish(23);
            case 27:
              return e.finish(18);
            case 28:
            case 'end':
              return e.stop();
          }
        }, e, null, [[2, 14, 18, 28], [19,, 23, 27]]);
      }));
      return function (t, r) {
        return e.apply(this, arguments);
      };
    }(),
    pt = function () {
      var e = l(s().mark(function e(t) {
        var o, a, u, c;
        return s().wrap(function (e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              if (!t[Symbol.asyncIterator]) {
                e.next = 3;
                break;
              }
              return e.delegateYield(r(n(t)), 't0', 2);
            case 2:
              return e.abrupt('return');
            case 3:
              o = t.getReader(), e.prev = 4;
            case 5:
              return e.next = 7, i(o.read());
            case 7:
              if (a = e.sent, u = a.done, c = a.value, !u) {
                e.next = 12;
                break;
              }
              return e.abrupt('break', 16);
            case 12:
              return e.next = 14, c;
            case 14:
              e.next = 5;
              break;
            case 16:
              return e.prev = 16, e.next = 19, i(o.cancel());
            case 19:
              return e.finish(16);
            case 20:
            case 'end':
              return e.stop();
          }
        }, e, null, [[4,, 16, 20]]);
      }));
      return function (t) {
        return e.apply(this, arguments);
      };
    }(),
    dt = function dt(e, t, r, n) {
      var o,
        i = lt(e, t),
        a = 0,
        u = function u(e) {
          o || (o = !0, n && n(e));
        };
      return new ReadableStream({
        pull: function pull(e) {
          return d(s().mark(function t() {
            var n, o, c, f, l;
            return s().wrap(function (t) {
              for (;;) switch (t.prev = t.next) {
                case 0:
                  return t.prev = 0, t.next = 3, i.next();
                case 3:
                  if (n = t.sent, o = n.done, c = n.value, !o) {
                    t.next = 10;
                    break;
                  }
                  return u(), e.close(), t.abrupt('return');
                case 10:
                  f = c.byteLength, r && (l = a += f, r(l)), e.enqueue(new Uint8Array(c)), t.next = 19;
                  break;
                case 15:
                  throw t.prev = 15, t.t0 = t.catch(0), u(t.t0), t.t0;
                case 19:
                case 'end':
                  return t.stop();
              }
            }, t, null, [[0, 15]]);
          }))();
        },
        cancel: function cancel(e) {
          return u(e), i.return();
        }
      }, {
        highWaterMark: 2
      });
    },
    ht = de.isFunction,
    vt = {
      Request: (at = de.global).Request,
      Response: at.Response
    },
    yt = de.global,
    mt = yt.ReadableStream,
    bt = yt.TextEncoder,
    gt = function gt(e) {
      try {
        for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
        return !!e.apply(void 0, r);
      } catch (e) {
        return !1;
      }
    },
    wt = function wt(e) {
      var t = e = de.merge.call({
          skipUndefined: !0
        }, vt, e),
        r = t.fetch,
        n = t.Request,
        o = t.Response,
        i = r ? ht(r) : 'function' == typeof fetch,
        a = ht(n),
        c = ht(o);
      if (!i) return !1;
      var f,
        l = i && ht(mt),
        p = i && ('function' == typeof bt ? (f = new bt(), function (e) {
          return f.encode(e);
        }) : function () {
          var e = d(s().mark(function e(t) {
            return s().wrap(function (e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  return e.t0 = Uint8Array, e.next = 3, new n(t).arrayBuffer();
                case 3:
                  return e.t1 = e.sent, e.abrupt('return', new e.t0(e.t1));
                case 5:
                case 'end':
                  return e.stop();
              }
            }, e);
          }));
          return function (t) {
            return e.apply(this, arguments);
          };
        }()),
        h = a && l && gt(function () {
          var e = !1,
            t = new n(Ue.origin, {
              body: new mt(),
              method: 'POST',
              get duplex() {
                return e = !0, 'half';
              }
            }).headers.has('Content-Type');
          return e && !t;
        }),
        v = c && l && gt(function () {
          return de.isReadableStream(new o('').body);
        }),
        y = {
          stream: v && function (e) {
            return e.body;
          }
        };
      i && ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(function (e) {
        !y[e] && (y[e] = function (t, r) {
          var n = t && t[e];
          if (n) return n.call(t);
          throw new he("Response type '".concat(e, "' is not supported"), he.ERR_NOT_SUPPORT, r);
        });
      });
      var m = function () {
          var e = d(s().mark(function e(t) {
            var r;
            return s().wrap(function (e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  if (null != t) {
                    e.next = 2;
                    break;
                  }
                  return e.abrupt('return', 0);
                case 2:
                  if (!de.isBlob(t)) {
                    e.next = 4;
                    break;
                  }
                  return e.abrupt('return', t.size);
                case 4:
                  if (!de.isSpecCompliantForm(t)) {
                    e.next = 9;
                    break;
                  }
                  return r = new n(Ue.origin, {
                    method: 'POST',
                    body: t
                  }), e.next = 8, r.arrayBuffer();
                case 8:
                case 15:
                  return e.abrupt('return', e.sent.byteLength);
                case 9:
                  if (!de.isArrayBufferView(t) && !de.isArrayBuffer(t)) {
                    e.next = 11;
                    break;
                  }
                  return e.abrupt('return', t.byteLength);
                case 11:
                  if (de.isURLSearchParams(t) && (t += ''), !de.isString(t)) {
                    e.next = 16;
                    break;
                  }
                  return e.next = 15, p(t);
                case 16:
                case 'end':
                  return e.stop();
              }
            }, e);
          }));
          return function (t) {
            return e.apply(this, arguments);
          };
        }(),
        g = function () {
          var e = d(s().mark(function e(t, r) {
            var n;
            return s().wrap(function (e) {
              for (;;) switch (e.prev = e.next) {
                case 0:
                  return n = de.toFiniteNumber(t.getContentLength()), e.abrupt('return', null == n ? m(r) : n);
                case 2:
                case 'end':
                  return e.stop();
              }
            }, e);
          }));
          return function (t, r) {
            return e.apply(this, arguments);
          };
        }();
      return function () {
        var e = d(s().mark(function e(t) {
          var i, c, f, l, p, d, m, w, E, O, S, x, R, k, T, j, A, P, L, N, C, _, U, F, B, D, I, q, M, z, H, J, W, K, V, G;
          return s().wrap(function (e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                if (i = ut(t), c = i.url, f = i.method, l = i.data, p = i.signal, d = i.cancelToken, m = i.timeout, w = i.onDownloadProgress, E = i.onUploadProgress, O = i.responseType, S = i.headers, x = i.withCredentials, R = void 0 === x ? 'same-origin' : x, k = i.fetchOptions, T = r || fetch, O = O ? (O + '').toLowerCase() : 'text', j = ct([p, d && d.toAbortSignal()], m), A = null, P = j && j.unsubscribe && function () {
                  j.unsubscribe();
                }, e.prev = 6, e.t0 = E && h && 'get' !== f && 'head' !== f, !e.t0) {
                  e.next = 13;
                  break;
                }
                return e.next = 11, g(S, l);
              case 11:
                e.t1 = L = e.sent, e.t0 = 0 !== e.t1;
              case 13:
                if (!e.t0) {
                  e.next = 17;
                  break;
                }
                N = new n(c, {
                  method: 'POST',
                  body: l,
                  duplex: 'half'
                }), de.isFormData(l) && (C = N.headers.get('content-type')) && S.setContentType(C), N.body && (_ = Ze(L, Qe(et(E))), U = b(_, 2), F = U[0], B = U[1], l = dt(N.body, 65536, F, B));
              case 17:
                return de.isString(R) || (R = R ? 'include' : 'omit'), D = a && 'credentials' in n.prototype, I = u(u({}, k), {}, {
                  signal: j,
                  method: f.toUpperCase(),
                  headers: S.normalize().toJSON(),
                  body: l,
                  duplex: 'half',
                  credentials: D ? R : void 0
                }), A = a && new n(c, I), e.next = 23, a ? T(A, k) : T(c, I);
              case 23:
                return q = e.sent, M = v && ('stream' === O || 'response' === O), v && (w || M && P) && (z = {}, ['status', 'statusText', 'headers'].forEach(function (e) {
                  z[e] = q[e];
                }), H = de.toFiniteNumber(q.headers.get('content-length')), J = w && Ze(H, Qe(et(w), !0)) || [], W = b(J, 2), K = W[0], V = W[1], q = new o(dt(q.body, 65536, K, function () {
                  V && V(), P && P();
                }), z)), O = O || 'text', e.next = 29, y[de.findKey(y, O) || 'text'](q, t);
              case 29:
                return G = e.sent, !M && P && P(), e.next = 33, new Promise(function (e, r) {
                  Xe(e, r, {
                    data: G,
                    headers: We.from(q.headers),
                    status: q.status,
                    statusText: q.statusText,
                    config: t,
                    request: A
                  });
                });
              case 33:
                return e.abrupt('return', e.sent);
              case 36:
                if (e.prev = 36, e.t2 = e.catch(6), P && P(), !e.t2 || 'TypeError' !== e.t2.name || !/Load failed|fetch/i.test(e.t2.message)) {
                  e.next = 41;
                  break;
                }
                throw Object.assign(new he('Network Error', he.ERR_NETWORK, t, A), {
                  cause: e.t2.cause || e.t2
                });
              case 41:
                throw he.from(e.t2, e.t2 && e.t2.code, t, A);
              case 42:
              case 'end':
                return e.stop();
            }
          }, e, null, [[6, 36]]);
        }));
        return function (t) {
          return e.apply(this, arguments);
        };
      }();
    },
    Et = new Map(),
    Ot = function Ot(e) {
      for (var t, r, n = e && e.env || {}, o = n.fetch, i = [n.Request, n.Response, o], a = i.length, u = Et; a--;) t = i[a], void 0 === (r = u.get(t)) && u.set(t, r = a ? new Map() : wt(n)), u = r;
      return r;
    };
  Ot();
  var St = {
    http: null,
    xhr: st,
    fetch: {
      get: Ot
    }
  };
  de.forEach(St, function (e, t) {
    if (e) {
      try {
        Object.defineProperty(e, 'name', {
          value: t
        });
      } catch (e) {}
      Object.defineProperty(e, 'adapterName', {
        value: t
      });
    }
  });
  var xt = function xt(e) {
      return '- '.concat(e);
    },
    Rt = function Rt(e) {
      return de.isFunction(e) || null === e || !1 === e;
    };
  var kt = {
    getAdapter: function getAdapter(e, t) {
      for (var r, n, o = (e = de.isArray(e) ? e : [e]).length, i = {}, a = 0; a < o; a++) {
        var u = void 0;
        if (n = r = e[a], !Rt(r) && void 0 === (n = St[(u = String(r)).toLowerCase()])) throw new he("Unknown adapter '".concat(u, "'"));
        if (n && (de.isFunction(n) || (n = n.get(t)))) break;
        i[u || '#' + a] = n;
      }
      if (!n) {
        var s = Object.entries(i).map(function (e) {
          var t = b(e, 2),
            r = t[0],
            n = t[1];
          return 'adapter '.concat(r, ' ') + (!1 === n ? 'is not supported by the environment' : 'is not available in the build');
        });
        throw new he('There is no suitable adapter to dispatch the request ' + (o ? s.length > 1 ? 'since :\n' + s.map(xt).join('\n') : ' ' + xt(s[0]) : 'as no adapter specified'), 'ERR_NOT_SUPPORT');
      }
      return n;
    },
    adapters: St
  };
  function Tt(e) {
    if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new Ge(null, e);
  }
  function jt(e) {
    return Tt(e), e.headers = We.from(e.headers), e.data = Ke.call(e, e.transformRequest), -1 !== ['post', 'put', 'patch'].indexOf(e.method) && e.headers.setContentType('application/x-www-form-urlencoded', !1), kt.getAdapter(e.adapter || De.adapter, e)(e).then(function (t) {
      return Tt(e), t.data = Ke.call(e, e.transformResponse, t), t.headers = We.from(t.headers), t;
    }, function (t) {
      return Ve(t) || (Tt(e), t && t.response && (t.response.data = Ke.call(e, e.transformResponse, t.response), t.response.headers = We.from(t.response.headers))), Promise.reject(t);
    });
  }
  var At = '1.13.2',
    Pt = {};
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function (e, t) {
    Pt[e] = function (r) {
      return f(r) === e || 'a' + (t < 1 ? 'n ' : ' ') + e;
    };
  });
  var Lt = {};
  Pt.transitional = function (e, t, r) {
    function n(e, t) {
      return "[Axios v1.13.2] Transitional option '" + e + "'" + t + (r ? '. ' + r : '');
    }
    return function (r, o, i) {
      if (!1 === e) throw new he(n(o, ' has been removed' + (t ? ' in ' + t : '')), he.ERR_DEPRECATED);
      return t && !Lt[o] && (Lt[o] = !0, console.warn(n(o, ' has been deprecated since v' + t + ' and will be removed in the near future'))), !e || e(r, o, i);
    };
  }, Pt.spelling = function (e) {
    return function (t, r) {
      return console.warn(''.concat(r, ' is likely a misspelling of ').concat(e)), !0;
    };
  };
  var Nt = {
      assertOptions: function assertOptions(e, t, r) {
        if ('object' !== f(e)) throw new he('options must be an object', he.ERR_BAD_OPTION_VALUE);
        for (var n = Object.keys(e), o = n.length; o-- > 0;) {
          var i = n[o],
            a = t[i];
          if (a) {
            var u = e[i],
              s = void 0 === u || a(u, i, e);
            if (!0 !== s) throw new he('option ' + i + ' must be ' + s, he.ERR_BAD_OPTION_VALUE);
          } else if (!0 !== r) throw new he('Unknown option ' + i, he.ERR_BAD_OPTION);
        }
      },
      validators: Pt
    },
    Ct = Nt.validators,
    _t = function () {
      function e(t) {
        h(this, e), this.defaults = t || {}, this.interceptors = {
          request: new Te(),
          response: new Te()
        };
      }
      var t;
      return y(e, [{
        key: 'request',
        value: (t = d(s().mark(function e(t, r) {
          var n, o;
          return s().wrap(function (e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                return e.prev = 0, e.next = 3, this._request(t, r);
              case 3:
                return e.abrupt('return', e.sent);
              case 6:
                if (e.prev = 6, e.t0 = e.catch(0), e.t0 instanceof Error) {
                  n = {}, Error.captureStackTrace ? Error.captureStackTrace(n) : n = new Error(), o = n.stack ? n.stack.replace(/^.+\n/, '') : '';
                  try {
                    e.t0.stack ? o && !String(e.t0.stack).endsWith(o.replace(/^.+\n.+\n/, '')) && (e.t0.stack += '\n' + o) : e.t0.stack = o;
                  } catch (e) {}
                }
                throw e.t0;
              case 10:
              case 'end':
                return e.stop();
            }
          }, e, this, [[0, 6]]);
        })), function (e, r) {
          return t.apply(this, arguments);
        })
      }, {
        key: '_request',
        value: function value(e, t) {
          'string' == typeof e ? (t = t || {}).url = e : t = e || {};
          var r = t = it(this.defaults, t),
            n = r.transitional,
            o = r.paramsSerializer,
            i = r.headers;
          void 0 !== n && Nt.assertOptions(n, {
            silentJSONParsing: Ct.transitional(Ct.boolean),
            forcedJSONParsing: Ct.transitional(Ct.boolean),
            clarifyTimeoutError: Ct.transitional(Ct.boolean)
          }, !1), null != o && (de.isFunction(o) ? t.paramsSerializer = {
            serialize: o
          } : Nt.assertOptions(o, {
            encode: Ct.function,
            serialize: Ct.function
          }, !0)), void 0 !== t.allowAbsoluteUrls || (void 0 !== this.defaults.allowAbsoluteUrls ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), Nt.assertOptions(t, {
            baseUrl: Ct.spelling('baseURL'),
            withXsrfToken: Ct.spelling('withXSRFToken')
          }, !0), t.method = (t.method || this.defaults.method || 'get').toLowerCase();
          var a = i && de.merge(i.common, i[t.method]);
          i && de.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function (e) {
            delete i[e];
          }), t.headers = We.concat(a, i);
          var u = [],
            s = !0;
          this.interceptors.request.forEach(function (e) {
            'function' == typeof e.runWhen && !1 === e.runWhen(t) || (s = s && e.synchronous, u.unshift(e.fulfilled, e.rejected));
          });
          var c,
            f = [];
          this.interceptors.response.forEach(function (e) {
            f.push(e.fulfilled, e.rejected);
          });
          var l,
            p = 0;
          if (!s) {
            var d = [jt.bind(this), void 0];
            for (d.unshift.apply(d, u), d.push.apply(d, f), l = d.length, c = Promise.resolve(t); p < l;) c = c.then(d[p++], d[p++]);
            return c;
          }
          l = u.length;
          for (var h = t; p < l;) {
            var v = u[p++],
              y = u[p++];
            try {
              h = v(h);
            } catch (e) {
              y.call(this, e);
              break;
            }
          }
          try {
            c = jt.call(this, h);
          } catch (e) {
            return Promise.reject(e);
          }
          for (p = 0, l = f.length; p < l;) c = c.then(f[p++], f[p++]);
          return c;
        }
      }, {
        key: 'getUri',
        value: function value(e) {
          return ke(nt((e = it(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls), e.params, e.paramsSerializer);
        }
      }]), e;
    }();
  de.forEach(['delete', 'get', 'head', 'options'], function (e) {
    _t.prototype[e] = function (t, r) {
      return this.request(it(r || {}, {
        method: e,
        url: t,
        data: (r || {}).data
      }));
    };
  }), de.forEach(['post', 'put', 'patch'], function (e) {
    function t(t) {
      return function (r, n, o) {
        return this.request(it(o || {}, {
          method: e,
          headers: t ? {
            'Content-Type': 'multipart/form-data'
          } : {},
          url: r,
          data: n
        }));
      };
    }
    _t.prototype[e] = t(), _t.prototype[e + 'Form'] = t(!0);
  });
  var Ut = _t,
    Ft = function () {
      function e(t) {
        if (h(this, e), 'function' != typeof t) throw new TypeError('executor must be a function.');
        var r;
        this.promise = new Promise(function (e) {
          r = e;
        });
        var n = this;
        this.promise.then(function (e) {
          if (n._listeners) {
            for (var t = n._listeners.length; t-- > 0;) n._listeners[t](e);
            n._listeners = null;
          }
        }), this.promise.then = function (e) {
          var t,
            r = new Promise(function (e) {
              n.subscribe(e), t = e;
            }).then(e);
          return r.cancel = function () {
            n.unsubscribe(t);
          }, r;
        }, t(function (e, t, o) {
          n.reason || (n.reason = new Ge(e, t, o), r(n.reason));
        });
      }
      return y(e, [{
        key: 'throwIfRequested',
        value: function value() {
          if (this.reason) throw this.reason;
        }
      }, {
        key: 'subscribe',
        value: function value(e) {
          this.reason ? e(this.reason) : this._listeners ? this._listeners.push(e) : this._listeners = [e];
        }
      }, {
        key: 'unsubscribe',
        value: function value(e) {
          if (this._listeners) {
            var t = this._listeners.indexOf(e);
            -1 !== t && this._listeners.splice(t, 1);
          }
        }
      }, {
        key: 'toAbortSignal',
        value: function value() {
          var e = this,
            t = new AbortController(),
            r = function r(e) {
              t.abort(e);
            };
          return this.subscribe(r), t.signal.unsubscribe = function () {
            return e.unsubscribe(r);
          }, t.signal;
        }
      }], [{
        key: 'source',
        value: function value() {
          var t;
          return {
            token: new e(function (e) {
              t = e;
            }),
            cancel: t
          };
        }
      }]), e;
    }(),
    Bt = Ft;
  var Dt = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526
  };
  Object.entries(Dt).forEach(function (e) {
    var t = b(e, 2),
      r = t[0],
      n = t[1];
    Dt[n] = r;
  });
  var It = Dt;
  var qt = function e(t) {
    var r = new Ut(t),
      n = O(Ut.prototype.request, r);
    return de.extend(n, Ut.prototype, r, {
      allOwnKeys: !0
    }), de.extend(n, r, null, {
      allOwnKeys: !0
    }), n.create = function (r) {
      return e(it(t, r));
    }, n;
  }(De);
  return qt.Axios = Ut, qt.CanceledError = Ge, qt.CancelToken = Bt, qt.isCancel = Ve, qt.VERSION = At, qt.toFormData = Ee, qt.AxiosError = he, qt.Cancel = qt.CanceledError, qt.all = function (e) {
    return Promise.all(e);
  }, qt.spread = function (e) {
    return function (t) {
      return e.apply(null, t);
    };
  }, qt.isAxiosError = function (e) {
    return de.isObject(e) && !0 === e.isAxiosError;
  }, qt.mergeConfig = it, qt.AxiosHeaders = We, qt.formToJSON = function (e) {
    return Fe(de.isHTMLForm(e) ? new FormData(e) : e);
  }, qt.getAdapter = kt.getAdapter, qt.HttpStatusCode = It, qt.default = qt, qt;
});
var _default = exports.default = axios;
},{"process":"../../node_modules/process/browser.js","buffer":"../../node_modules/buffer/index.js"}],"login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;
var _axiosMin = _interopRequireDefault(require("./axios.min.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// import axios from 'axios';

var login = exports.login = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(email, password) {
    var res, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return (0, _axiosMin.default)({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          });
        case 1:
          res = _context.v;
          if (res.data.status === 'success') {
            alert('Logged in successfully');
            window.setTimeout(function () {
              location.assign('/overview');
            }, 500);
          }
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          alert(_t.response.data.message);
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function login(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
},{"./axios.min.js":"axios.min.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _login = require("./login.js");
var loginForm = document.querySelector('.form');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    (0, _login.login)(email, password);
  });
}
},{"./login.js":"login.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58349" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map