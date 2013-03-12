var assert = require('../lib/assert');
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

test('on multiple', function(done) {
    done = after(2, done);
    var done1 = after(2, done);
    var done2 = after(2, done);
    var ee = new events.EventEmitter();
    ee.on('foo', done1);
    ee.on('foo', done2);
    ee.on('foo2', function() {
		assert.fail('should not be called');
	});
    ee.emit('foo');
    ee.emit('foo');
});

test('once', function(done) {
    var ee = new events.EventEmitter();
    ee.once('foo', done);
    ee.emit('foo');
    ee.emit('foo');
});

test('sanity check', function() {
	var ee = new events.EventEmitter();
	assert.equal(ee.addListener, ee.on);
});

test('parameters', function(done) {
	var ee = new events.EventEmitter();
	ee.on('bar', function(a, b, c) {
		assert.equal('a', a);
		assert.equal('b', b);
		assert.equal(undefined, c);
		done();
	});
	ee.emit('bar', 'a', 'b');
});

test('max listeners infinite allowed', function() {
	var ee = new events.EventEmitter();
	ee.setMaxListeners(0);
});

test('new listeners', function(done) {
	var newListeners = [];
	var oneDone = after(3, function() {
		assert.deepEqual([
			'foo', listener1,
			'bar', listener2,
			'foo', listener3
		], newListeners);
		done();
	});
	var ee = new events.EventEmitter();
	ee.on('newListener', function(event, listener) {
		newListeners.push(event, listener);
		oneDone();
	});
	function listener1() {}
	function listener2() {}
	function listener3() {}
	ee.on('foo', listener1);
	ee.on('bar', listener2);
	ee.on('foo', listener3);
});

test('listener leak default', function() {
	var e = new events.EventEmitter();

	for (var i = 0; i < 10; i++) {
	  e.on('default', function() {});
	}
	assert.ok(!e._events['default'].hasOwnProperty('warned'));
	e.on('default', function() {});
	assert.ok(e._events['default'].warned);
});

test('listener leak specific', function() {
	var e = new events.EventEmitter();

	e.setMaxListeners(5);
	for (var i = 0; i < 5; i++) {
	  e.on('specific', function() {});
	}
	assert.ok(!e._events['specific'].hasOwnProperty('warned'));
	e.on('specific', function() {});
	assert.ok(e._events['specific'].warned);
});

test('listener leak only one', function() {
	var e = new events.EventEmitter();

	e.setMaxListeners(1);
	e.on('only one', function() {});
	assert.ok(!e._events['only one'].hasOwnProperty('warned'));
	e.on('only one', function() {});
	assert.ok(e._events['only one'].hasOwnProperty('warned'));
});

test('listener leak unlimited', function() {
	var e = new events.EventEmitter();

	e.setMaxListeners(0);
	for (var i = 0; i < 1000; i++) {
	  e.on('unlimited', function() {});
	}
	assert.ok(!e._events['unlimited'].hasOwnProperty('warned'));
});

test('maxListeners event', function(done) {
	var e = new events.EventEmitter();

	e.on('maxListeners', done);

	// Should not corrupt the 'maxListeners' queue.
	e.setMaxListeners(42);

	e.emit('maxListeners');
});

test('modify in emit', function() {
	var callbacks_called = [];

	var e = new events.EventEmitter();

	function callback1() {
		callbacks_called.push('callback1');
		e.on('foo', callback2);
		e.on('foo', callback3);
		e.removeListener('foo', callback1);
	}

	function callback2() {
		callbacks_called.push('callback2');
		e.removeListener('foo', callback2);
	}

	function callback3() {
		callbacks_called.push('callback3');
		e.removeListener('foo', callback3);
	}

	e.on('foo', callback1);
	assert.equal(1, e.listeners('foo').length);

	e.emit('foo');
	assert.equal(2, e.listeners('foo').length);
	assert.deepEqual(['callback1'], callbacks_called);

	e.emit('foo');
	assert.equal(0, e.listeners('foo').length);
	assert.deepEqual(['callback1', 'callback2', 'callback3'], callbacks_called);

	e.emit('foo');
	assert.equal(0, e.listeners('foo').length);
	assert.deepEqual(['callback1', 'callback2', 'callback3'], callbacks_called);

	e.on('foo', callback1);
	e.on('foo', callback2);
	assert.equal(2, e.listeners('foo').length);
	e.removeAllListeners('foo');
	assert.equal(0, e.listeners('foo').length);

	// Verify that removing callbacks while in emit allows emits to propagate to
	// all listeners
	callbacks_called = [];

	e.on('foo', callback2);
	e.on('foo', callback3);
	assert.equal(2, e.listeners('foo').length);
	e.emit('foo');
	assert.deepEqual(['callback2', 'callback3'], callbacks_called);
	assert.equal(0, e.listeners('foo').length);
});

test('mum of args', function(done) {
	var oneDone = after(6, function() {
		assert.deepEqual([0, 1, 2, 3, 4, 5], num_args_emited);
		done();
	});


	var e = new events.EventEmitter(),
		num_args_emited = [];

	e.on('numArgs', function() {
		var numArgs = arguments.length;
		num_args_emited.push(numArgs);
		oneDone();
	});

	e.emit('numArgs');
	e.emit('numArgs', null);
	e.emit('numArgs', null, null);
	e.emit('numArgs', null, null, null);
	e.emit('numArgs', null, null, null, null);
	e.emit('numArgs', null, null, null, null, null);
});

test('remove a once listener', function(done) {
	var e = new events.EventEmitter();

	function listener() {
		assert.fail('should not be called');
	}

	e.once('foo', listener);
	e.removeListener('foo', listener);
	e.emit('foo');
	e.once('bar', done);
	e.emit('bar');
	e.emit('bar');
});

test('remove all listeners', function() {
	function listener() {}

	var e1 = new events.EventEmitter();
	e1.on('foo', listener);
	e1.on('bar', listener);
	e1.on('baz', listener);
	e1.on('baz', listener);
	var fooListeners = e1.listeners('foo');
	var barListeners = e1.listeners('bar');
	var bazListeners = e1.listeners('baz');
	e1.removeAllListeners('bar');
	e1.removeAllListeners('baz');
	assert.deepEqual(e1.listeners('foo'), [listener]);
	assert.deepEqual(e1.listeners('bar'), []);
	assert.deepEqual(e1.listeners('baz'), []);
	// after calling removeAllListeners,
	// the old listeners array should stay unchanged
	assert.deepEqual(fooListeners, [listener]);
	assert.deepEqual(barListeners, [listener]);
	assert.deepEqual(bazListeners, [listener, listener]);
	// after calling removeAllListeners,
	// new listeners arrays are different from the old
	assert.notEqual(e1.listeners('bar'), barListeners);
	assert.notEqual(e1.listeners('baz'), bazListeners);

	var e2 = new events.EventEmitter();
	e2.on('foo', listener);
	e2.on('bar', listener);
	e2.removeAllListeners();
	assert.deepEqual([], e2.listeners('foo'));
	assert.deepEqual([], e2.listeners('bar'));
});

test('remove listener', function(done) {
	var count = 0;

	function listener1() {
	  count++;
	}

	function listener2() {
	  count++;
	}

	function listener3() {
	  count++;
	}

	var e1 = new events.EventEmitter();
	e1.on('hello', listener1);
	e1.removeListener('hello', listener1);
	assert.deepEqual([], e1.listeners('hello'));

	var e2 = new events.EventEmitter();
	e2.on('hello', listener1);
	e2.removeListener('hello', listener2);
	assert.deepEqual([listener1], e2.listeners('hello'));

	var e3 = new events.EventEmitter();
	e3.on('hello', listener1);
	e3.on('hello', listener2);
	e3.removeListener('hello', listener1);
	assert.deepEqual([listener2], e3.listeners('hello'));

	done = after(2, done);
	function remove1() {
		assert(0);
	}
	function remove2() {
		assert(0);
	}
	var e4 = new events.EventEmitter();
	e4.on('removeListener', function(name, cb) {
		if (cb !== remove1) return done();
		this.removeListener('quux', remove2);
	    this.emit('quux');
		done();
	});
	e4.on('quux', remove1);
	e4.on('quux', remove2);
	e4.removeListener('quux', remove1);
});

test('subclass', function(done) {
	var util = require('../lib/util');

	util.inherits(MyEE, events.EventEmitter);

	function MyEE(cb) {
		this.on('foo', cb);
		events.EventEmitter.call(this);
	}

	var myee = new MyEE(done);
	myee.emit('foo');
});
