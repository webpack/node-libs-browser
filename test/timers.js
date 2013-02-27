var assert = require('assert');
var timers = require('../lib/timers');

suite('timers');

test('200 ms timeout', function(done) {
	timers.setTimeout(function() {
		done();
	}, 200);
});
