var assert = require('../lib/assert');
var qs = require('../lib/querystring');

suite('querystring');

// folding block, commented to pass gjslint
// {{{
// [ wonkyQS, canonicalQS, obj ]
var qsTestCases = [
  ['foo=918854443121279438895193',
   'foo=918854443121279438895193',
   {'foo': '918854443121279438895193'}],
  ['foo=bar', 'foo=bar', {'foo': 'bar'}],
  ['foo=bar&foo=quux', 'foo=bar&foo=quux', {'foo': ['bar', 'quux']}],
  ['foo=1&bar=2', 'foo=1&bar=2', {'foo': '1', 'bar': '2'}],
  ['my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F',
   'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F',
   {'my weird field': 'q1!2"\'w$5&7/z8)?' }],
  ['foo%3Dbaz=bar', 'foo%3Dbaz=bar', {'foo=baz': 'bar'}],
  ['foo=baz=bar', 'foo=baz%3Dbar', {'foo': 'baz=bar'}],
  ['str=foo&arr=1&arr=2&arr=3&somenull=&undef=',
   'str=foo&arr=1&arr=2&arr=3&somenull=&undef=',
   { 'str': 'foo',
     'arr': ['1', '2', '3'],
     'somenull': '',
     'undef': ''}],
  [' foo = bar ', '%20foo%20=%20bar%20', {' foo ': ' bar '}],
  ['foo=%zx', 'foo=%25zx', {'foo': '%zx'}],
  ['foo=%EF%BF%BD', 'foo=%EF%BF%BD', {'foo': '\ufffd' }],
  // See: https://github.com/joyent/node/issues/1707
  ['hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz',
    'hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz',
    { hasOwnProperty: 'x',
      toString: 'foo',
      valueOf: 'bar',
      __defineGetter__: 'baz' }],
  // See: https://github.com/joyent/node/issues/3058
  ['foo&bar=baz', 'foo=&bar=baz', { foo: '', bar: 'baz' }]
];

// [ wonkyQS, canonicalQS, obj ]
var qsColonTestCases = [
  ['foo:bar', 'foo:bar', {'foo': 'bar'}],
  ['foo:bar;foo:quux', 'foo:bar;foo:quux', {'foo': ['bar', 'quux']}],
  ['foo:1&bar:2;baz:quux',
   'foo:1%26bar%3A2;baz:quux',
   {'foo': '1&bar:2', 'baz': 'quux'}],
  ['foo%3Abaz:bar', 'foo%3Abaz:bar', {'foo:baz': 'bar'}],
  ['foo:baz:bar', 'foo:baz%3Abar', {'foo': 'baz:bar'}]
];

// [wonkyObj, qs, canonicalObj]
var extendedFunction = function() {};
extendedFunction.prototype = {a: 'b'};
var qsWeirdObjects = [
  [{regexp: /./g}, 'regexp=', {'regexp': ''}],
  [{regexp: new RegExp('.', 'g')}, 'regexp=', {'regexp': ''}],
  [{fn: function() {}}, 'fn=', {'fn': ''}],
  [{fn: new Function('')}, 'fn=', {'fn': ''}],
  [{math: Math}, 'math=', {'math': ''}],
  [{e: extendedFunction}, 'e=', {'e': ''}],
  [{d: new Date()}, 'd=', {'d': ''}],
  [{d: Date}, 'd=', {'d': ''}],
  [{f: new Boolean(false), t: new Boolean(true)}, 'f=&t=', {'f': '', 't': ''}],
  [{f: false, t: true}, 'f=false&t=true', {'f': 'false', 't': 'true'}],
  [{n: null}, 'n=', {'n': ''}],
  [{nan: NaN}, 'nan=', {'nan': ''}],
  [{inf: Infinity}, 'inf=', {'inf': ''}]
];
// }}}

var qsNoMungeTestCases = [
  ['', {}],
  ['foo=bar&foo=baz', {'foo': ['bar', 'baz']}],
  ['blah=burp', {'blah': 'burp'}],
  ['gragh=1&gragh=3&goo=2', {'gragh': ['1', '3'], 'goo': '2'}],
  ['frappucino=muffin&goat%5B%5D=scone&pond=moose',
   {'frappucino': 'muffin', 'goat[]': 'scone', 'pond': 'moose'}],
  ['trololol=yes&lololo=no', {'trololol': 'yes', 'lololo': 'no'}]
];


test('simple', function() {
	assert.strictEqual('918854443121279438895193',
	   qs.parse('id=918854443121279438895193').id);
});

for(var i = 0; i < qsTestCases.length; i++) {
	(function(tc) {
		test('parse canonical ' + tc[0], function() {
			assert.deepEqual(tc[2], qs.parse(tc[0]));
		});
	}(qsTestCases[i]));
}

for(var i = 0; i < qsColonTestCases.length; i++) {
	(function(tc) {
		test('parse colon ' + tc[0], function() {
			assert.deepEqual(tc[2], qs.parse(tc[0], ';', ':'));
		});
	}(qsColonTestCases[i]));
}

for(var i = 0; i < qsWeirdObjects.length; i++) {
	(function(tc) {
		test('parse weird ' + tc[1], function() {
			assert.deepEqual(tc[2], qs.parse(tc[1]));
		});
	}(qsWeirdObjects[i]));
}

for(var i = 0; i < qsNoMungeTestCases.length; i++) {
	(function(tc) {
		test('stringify nomunge ' + tc[0], function() {
			assert.deepEqual(tc[0], qs.stringify(tc[1], '&', '=', false));
		});
	}(qsNoMungeTestCases[i]));
}

test('nested qs-in-qs', function() {
	var f = qs.parse('a=b&q=x%3Dy%26y%3Dz');
	f.q = qs.parse(f.q);
	assert.deepEqual(f, { a: 'b', q: { x: 'y', y: 'z' } });
});

test('nested in colon', function() {
	var f = qs.parse('a:b;q:x%3Ay%3By%3Az', ';', ':');
	f.q = qs.parse(f.q, ';', ':');
	assert.deepEqual(f, { a: 'b', q: { x: 'y', y: 'z' } });
});

for(var i = 0; i < qsTestCases.length; i++) {
	(function(tc) {
		test('stringify canonical ' + tc[0], function() {
			assert.deepEqual(tc[1], qs.stringify(tc[2]));
		});
	}(qsTestCases[i]));
}

for(var i = 0; i < qsColonTestCases.length; i++) {
	(function(tc) {
		test('stringify colon ' + tc[0], function() {
			assert.deepEqual(tc[1], qs.stringify(tc[2], ';', ':'));
		});
	}(qsColonTestCases[i]));
}

for(var i = 0; i < qsWeirdObjects.length; i++) {
	(function(tc) {
		test('stringify weird ' + tc[1], function() {
			assert.deepEqual(tc[1], qs.stringify(tc[0], ';', ':'));
		});
	}(qsWeirdObjects[i]));
}

test('stringify nested', function() {
	var f = qs.stringify({
		a: 'b',
		q: qs.stringify({
			x: 'y',
			y: 'z'
		})
	});
	assert.equal(f, 'a=b&q=x%3Dy%26y%3Dz');
});

test('parse undefined', function() {
	assert.doesNotThrow(function() {
		qs.parse(undefined);
	});
});

test('parse empty', function() {
	assert.deepEqual({}, qs.parse());
});

test('stringify nested in colon', function() {
	var f = qs.stringify({
		a: 'b',
		q: qs.stringify({
			x: 'y',
			y: 'z'
		}, ';', ':')
	}, ';', ':');
	assert.equal(f, 'a:b;q:x%3Ay%3By%3Az');
});

test('limiting', function() {
	assert.equal(
		Object.keys(qs.parse('a=1&b=1&c=1', null, null, { maxKeys: 1 })).length,
		1);
});

test('removing limit', function() {
	var query = {},
		url;

	for (var i = 0; i < 2000; i++) query[i] = i;

	url = qs.stringify(query);

	assert.equal(
		Object.keys(qs.parse(url, null, null, { maxKeys: 0 })).length,
		2000);
});

test('unescape buffer', function() {
	var b = qs.unescapeBuffer('%d3%f2Ug%1f6v%24%5e%98%cb' +
							  '%0d%ac%a2%2f%9d%eb%d8%a2%e6');
	// <Buffer d3 f2 55 67 1f 36 76 24 5e 98 cb 0d ac a2 2f 9d eb d8 a2 e6>
	assert.equal(0xd3, b[0]);
	assert.equal(0xf2, b[1]);
	assert.equal(0x55, b[2]);
	assert.equal(0x67, b[3]);
	assert.equal(0x1f, b[4]);
	assert.equal(0x36, b[5]);
	assert.equal(0x76, b[6]);
	assert.equal(0x24, b[7]);
	assert.equal(0x5e, b[8]);
	assert.equal(0x98, b[9]);
	assert.equal(0xcb, b[10]);
	assert.equal(0x0d, b[11]);
	assert.equal(0xac, b[12]);
	assert.equal(0xa2, b[13]);
	assert.equal(0x2f, b[14]);
	assert.equal(0x9d, b[15]);
	assert.equal(0xeb, b[16]);
	assert.equal(0xd8, b[17]);
	assert.equal(0xa2, b[18]);
	assert.equal(0xe6, b[19]);
});
