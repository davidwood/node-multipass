var crypto = require('crypto');

// Block size
var BLOCK_SIZE = 16;

// Create an return a Multipass API
var api = module.exports = function(apiKey, siteKey) {
  if (!(this instanceof api)) return new api(apiKey, siteKey);
  if (!(typeof apiKey == 'string' && apiKey.length > 0)) throw new Error('Invalid API key');
  if (!(typeof siteKey == 'string' && siteKey.length > 0)) throw new Error('Invalid site key');
  this._key = crypto.createHash('sha1').update(apiKey + siteKey).digest('binary').substring(0, BLOCK_SIZE);
  this._iv = new Buffer('OpenSSL for Ruby', 'ascii');
  return this;
};

// Encode a Multipass token
api.prototype.encode = function(obj) {
  if (!obj) return;
  // Create a buffer
  var data = new Buffer(typeof obj == 'string' ? obj : JSON.stringify(obj), 'utf8');
  // XOR the IV into the first block
  for (var i = 0; i < BLOCK_SIZE; ++i) {
    data[i] = data[i] ^ this._iv[i];
  }
  // Pad the data
  var pad = BLOCK_SIZE - (data.length % BLOCK_SIZE),
      paddedData = new Buffer(data.length + pad);
  data.copy(paddedData);
  for (var i = data.length, len = paddedData.length; i < len; ++i) {
    paddedData[i] = pad;
  }
  // Encrypt with AES
  var cipher = crypto.createCipheriv('aes-128-cbc', this._key, this._iv.toString('binary')),
      token = cipher.update(paddedData, 'binary', 'base64') + cipher.final('base64');
  token = token.replace(/\n/g, '') // Remove newlines
               .replace(/\=$/g, '') // Remove trailing =
               .replace(/\+/g, '-') // Replace + with -
               .replace(/\//g, '_'); // Replace / with _
  return token;
};

// Decode a Multipass token
api.prototype.decode = function(token) {
  if (typeof token != 'string') return;
  token = token.replace(/_/g, '/') // Replace _ with /
               .replace(/\-/g, '+'); // Replace - with +
  // Decrypt with AES
  var cipher = crypto.createDecipheriv('aes-128-cbc', this._key, this._iv.toString('binary')),
      data = cipher.update(token, 'base64', 'binary') + cipher.final('binary');
  // Create a buffer
  data = new Buffer(data);
  // XOR the IV into the first block
  for (var i = 0; i < BLOCK_SIZE; ++i) {
    data[i] = data[i] ^ this._iv[i];
  }
  // Unpad the data
  var pad = data[data.length - 1],
      unpaddedData;
  if (typeof pad == 'number') {
    var isPadded = true;
    for (var len = data.length, i = len - pad; i < len; ++i) {
      if (data[i] != pad) {
        isPadded = false;
        break;
      }
    }
    if (isPadded) unpaddedData = data.slice(0, data.length - pad);
  }
  if (!unpaddedData) unpaddedData = data;
  try {
    return JSON.parse(unpaddedData.toString('utf8'));
  } catch (e) {};
};
