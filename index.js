var path = require("path");
var fs = require("fs");

fs.readdirSync(path.join(__dirname, "lib")).filter(function(item) {
	return /\.js$/.test(item);
}).forEach(function(item) {
	exports[item.replace(/\.js$/, "")] = path.join(__dirname, "lib", item);
});

exports._console = require.resolve("console-browserify");
exports.vm =       require.resolve("vm-browserify");
exports.crypto =   require.resolve("crypto-browserify");
exports.http =     require.resolve("http-browserify");
exports.buffer =   require.resolve("buffer-browserify");
exports.zlib =     require.resolve("zlib-browserify");
