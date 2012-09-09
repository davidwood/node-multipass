var assert = require('assert'),
    Multipass = require('../lib/multipass.js');

var OBJ = { email: 'test@example.com', name: 'test', expires: '2011-07-06 23:28:40Z' },
    TOKEN = 'qzGhLSWMGb2Y6c5EOXQ0zjTF96jrZo_40a9YTyrSSTmDLAAJ8fAtCp71Pq1UCx4J10fjf0bC-NTErJNbtF9pJxvc2CalmvIhVODzmPMZmRQUWM3ghbGDf3Ds7LNp1PQp';

describe('multipass', function() {
  
  describe('Constructor', function() {
    
    it('should throw an error if API key is not defined', function() {
      try {
        var multipass = new Multipass();
      } catch (e) {
        assert.ok(e instanceof Error);
        assert.equal(e.message, 'Invalid API key');
      }
    });

    it('should throw an error if API key is an empty string', function() {
      try {
        var multipass = new Multipass('');
      } catch (e) {
        assert.ok(e instanceof Error);
        assert.equal(e.message, 'Invalid API key');
      }
    });

    it('should throw an error if site key is not defined', function() {
      try {
        var multipass = new Multipass('API-KEY');
      } catch (e) {
        assert.ok(e instanceof Error);
        assert.equal(e.message, 'Invalid site key');
      }
    });

    it('should throw an error if site key is an empty string', function() {
      try {
        var multipass = new Multipass('API-KEY', '');
      } catch (e) {
        assert.ok(e instanceof Error);
        assert.equal(e.message, 'Invalid site key');
      }
    });

  });

  describe('API', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should expose an `encode` function', function() {
      assert.equal(typeof multipass.encode, 'function');
    });

    it('should expose a `decode` function', function() {
      assert.equal(typeof multipass.decode, 'function');
    });

  });

  describe('#encode()', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should return undefined if object not passed', function() {
      var token = multipass.encode();
      assert.equal(token, void 0);
    });

    it('should return a valid Multipass token', function() {
      var token = multipass.encode(OBJ);
      assert.equal(token, TOKEN);
    });

  });

  describe('#decode()', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should return undefined if token not passed', function() {
      var obj = multipass.decode();
      assert.equal(obj, void 0);
    });

    it('should return a valid Multipass token', function() {
      var obj = multipass.decode(TOKEN);
      assert.deepEqual(obj, OBJ);
    });

  });

});
