var assert = require('assert');
var after = require('after');
var events = require('../lib/events');

suite('events');

test('on', function(done) {
    done = after(2, done);
    var ee = new events.EventEmitter();
    ee.on('foo', done);
    ee.emit('foo');
    ee.emit('foo');
});

test('once', function(done) {
    var ee = new events.EventEmitter();
    ee.once('foo', done);
    ee.emit('foo');
    ee.emit('foo');
});
