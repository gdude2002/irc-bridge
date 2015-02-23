var assert  = require('assert');
var events  = require('events');
var net     = require('net');
var sinon   = require('sinon');

var Client = require('../lib/client.js');

describe('Client', function(){
  it('should be an event emitter', function() {
    var socket = new net.Socket();
    var client = new Client(socket);
    assert(client instanceof events.EventEmitter);
  });

  it('should emit PASS command even if not authenticated', function(done) {
    var socket = new net.Socket();
    var client = new Client(socket);

    client.on('PASS', function(channels) {
      done();
    });

    client.parse('PASS 123token456');
  });


  it('should emit after parsing an IRC message', function(done) {
    var socket = new net.Socket();
    var client = new Client(socket);
    client.authed = true;

    client.on('JOIN', function(channels) {
      done();
    });

    client.parse('JOIN #test');
  });

  it('should emit PING when ping', function(done) {
    var socket = new net.Socket();
    var client = new Client(socket);

    client.on('PING', function(params) {
      done();
    });

    client.ping();
  });

  it('should send valid messages', function(done) {
    var socket = new net.Socket();
    var stub = sinon.stub(socket, 'write', function(msg) {
      assert(msg === "PING hostname host\r\n")
      done();
    });

    var client = new Client(socket);
    client.send('PING', 'hostname', 'host');
  });

  it('should shutdown properly', function(done) {
    var socket = new net.Socket();
    var stub = sinon.stub(socket, 'end');
    var client = new Client(socket);

    client.on('disconnected', done);
    client.teardown();
  });
});