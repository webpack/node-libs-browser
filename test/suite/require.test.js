var should = require("should");

describe("require all libs", function() {
	it("should be able to require assert",         function() { should.exist(require("assert")); });
	it("should be able to require events",         function() { should.exist(require("events")); });
	it("should be able to require path",           function() { should.exist(require("path")); });
	it("should be able to require punycode",       function() { should.exist(require("punycode")); });
	it("should be able to require querystring",    function() { should.exist(require("querystring")); });
	it("should be able to require stream",         function() { should.exist(require("stream")); });
	it("should be able to require string_decoder", function() { should.exist(require("string_decoder")); });
	it("should be able to require sys",            function() { should.exist(require("sys")); });
	it("should be able to require timers",         function() { should.exist(require("timers")); });
	it("should be able to require url",            function() { should.exist(require("url")); });
	it("should be able to require util",           function() { should.exist(require("util")); });
	it("should be able to require https",          function() { should.exist(require("https")); });
	it("should be able to require vm",             function() { should.exist(require("vm")); });
	it("should be able to require crypto",         function() { should.exist(require("crypto")); });
	it("should be able to require http",           function() { should.exist(require("http")); });
	it("should be able to require buffer",         function() { should.exist(require("buffer")); });
	it("should be able to require zlib",           function() { should.exist(require("zlib")); });
	it("should be able to require child_process",  function() { should.exist(require("child_process")); });
	it("should be able to require fs",             function() { should.exist(require("fs")); });
	it("should be able to require net",            function() { should.exist(require("net")); });
	it("should be able to require tls",            function() { should.exist(require("tls")); });
	it("should be able to require tty",            function() { should.exist(require("tty")); });

});