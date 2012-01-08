var should = require('should'),
    Multipass = require('../lib/multipass.js');

var OBJ = { email: 'test@example.com', name: 'test', expires: '2011-07-06 23:28:40Z' },
    TOKEN = 'qzGhLSWMGb2Y6c5EOXQ0zjTF96jrZo_40a9YTyrSSTmDLAAJ8fAtCp71Pq1UCx4J10fjf0bC-NTErJNbtF9pJxvc2CalmvIhVODzmPMZmRQUWM3ghbGDf3Ds7LNp1PQp';

describe('multipass', function() {
  
  describe('Constructor', function() {
    
    it('should throw an error if API key is not defined', function() {
      try {
        var multipass = new Multipass();
      } catch (e) {
        should.exist(e);
        e.message.should.eql('Invalid API key');
      }
    });

    it('should throw an error if API key is an empty string', function() {
      try {
        var multipass = new Multipass('');
      } catch (e) {
        should.exist(e);
        e.message.should.eql('Invalid API key');
      }
    });

    it('should throw an error if site key is not defined', function() {
      try {
        var multipass = new Multipass('API-KEY');
      } catch (e) {
        should.exist(e);
        e.message.should.eql('Invalid site key');
      }
    });

    it('should throw an error if site key is an empty string', function() {
      try {
        var multipass = new Multipass('API-KEY', '');
      } catch (e) {
        should.exist(e);
        e.message.should.eql('Invalid site key');
      }
    });

  });

  describe('API', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should expose an `encode` function', function() {
      should.exist(multipass.encode);
      (typeof multipass.encode).should.eql('function');
    });

    it('should expose a `decode` function', function() {
      should.exist(multipass.decode);
      (typeof multipass.decode).should.eql('function');
    });

  });

  describe('#encode()', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should return undefined if object not passed', function() {
      var token = multipass.encode();
      should.not.exist(token);
    });

    it('should return a valid Multipass token', function() {
      var token = multipass.encode(OBJ);
      token.should.eql(TOKEN);
    });

  });

  describe('#decode()', function() {
    var multipass = new Multipass('API-KEY', 'SITE-KEY');
  
    it('should return undefined if token not passed', function() {
      var obj = multipass.decode();
      should.not.exist(obj);
    });

    it('should return a valid Multipass token', function() {
      var obj = multipass.decode(TOKEN);
      obj.should.eql(OBJ);
    });

  });

});
