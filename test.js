(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _pem = require('./lib/pem');

var _util = require('./lib/util');

var Util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

},{"./lib/pem":2,"./lib/util":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = undefined;

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Encodes (serializes) the given PEM object.
 *
 * @param msg the PEM message object to encode.
 * @param options the options to use:
 *          maxline the maximum characters per line for the body, (default: 64).
 *
 * @return the PEM-formatted string.
 */
var encode = function encode(msg, options) {
  options = options || {};
  var rval = '-----BEGIN ' + msg.type + '-----\r\n';

  // encode special headers
  var header;
  if (msg.procType) {
    header = {
      name: 'Proc-Type',
      values: [String(msg.procType.version), msg.procType.type]
    };
    rval += foldHeader(header);
  }
  if (msg.contentDomain) {
    header = { name: 'Content-Domain', values: [msg.contentDomain] };
    rval += foldHeader(header);
  }
  if (msg.dekInfo) {
    header = { name: 'DEK-Info', values: [msg.dekInfo.algorithm] };
    if (msg.dekInfo.parameters) {
      header.values.push(msg.dekInfo.parameters);
    }
    rval += foldHeader(header);
  }

  if (msg.headers) {
    // encode all other headers
    for (var i = 0; i < msg.headers.length; ++i) {
      rval += foldHeader(msg.headers[i]);
    }
  }

  // terminate header
  if (msg.procType) {
    rval += '\r\n';
  }

  // add body
  rval += Util.base64Encode(msg.body, options.maxline || 64) + '\r\n';

  rval += '-----END ' + msg.type + '-----\r\n';
  return rval;
};

exports.default = { encode: encode };
exports.encode = encode;

},{"./util":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Base64-encodes a Uint8Array.
 *
 * @param input the Uint8Array to encode.
 * @param maxline the maximum number of encoded characters per line to use,
 *          defaults to none.
 *
 * @return the base64-encoded output string.
 */
var base64Encode = function base64Encode(input) {
  var maxline = arguments.length <= 1 || arguments[1] === undefined ? 64 : arguments[1];

  if (!(typeof input === 'string' || input instanceof Uint8Array)) {
    throw new TypeError('input should be a string or instance of Uint8Array');
  }

  if (typeof input === 'string') {
    var uintArray = new Uint8Array(input.length);
    for (var j = 0; j < input.length; j++) {
      uintArray[j] = input.charCodeAt(j);
    }
    input = uintArray;
  }
  var line = '';
  var output = '';
  var chr1 = undefined,
      chr2 = undefined,
      chr3 = undefined;
  var i = 0;
  while (i < input.byteLength) {
    chr1 = input[i++];
    chr2 = input[i++];
    chr3 = input[i++];

    // encode 4 character group
    line += _base64.charAt(chr1 >> 2);
    line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
    if (isNaN(chr2)) {
      line += '==';
    } else {
      line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
      line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
    }

    if (maxline && line.length > maxline) {
      output += line.substr(0, maxline) + '\r\n';
      line = line.substr(maxline);
    }
  }
  output += line;
  return output;
};

exports.base64Encode = base64Encode;

},{}]},{},[1]);
