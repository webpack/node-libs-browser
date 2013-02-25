var path = require("path");
var fs = require("fs");

function pathToModule(p) {
	return path.basename(p).replace(/\.js$/, "");
}

function readdirAbsoultePaths(dir) {
	return fs.readdirSync(dir).filter(function(item) {
		return /\.js$/.test(item);
	}).map(function(item) {
		return path.join(dir, item);
	});
}

exports.best = {};
exports.full = {};
exports.part = {};
exports.minimal = {};
exports.test = {};
exports.modules = {};

function addLibFolder(name) {
	readdirAbsoultePaths(path.join(__dirname, "lib", name)).forEach(function(p) {
		exports[name][pathToModule(p)] = p;
	});
};

["full", "part", "minimal"].forEach(addLibFolder);

exports.full._console = require.resolve("console-browserify");
exports.part.vm =       require.resolve("vm-browserify");
exports.part.crypto =   require.resolve("crypto-browserify");
exports.part.http =     require.resolve("http-browserify");
exports.part.buffer =   require.resolve("buffer-browserify");
exports.part.zlib =     require.resolve("zlib-browserify");

["full", "part", "minimal", "test"].forEach(function(type) {
	for(var module in exports[type]) {
		var p = exports[type][module];
		if(!exports.modules[module]) exports.modules[module] = {};
		if(!exports.best[module]) exports.best[module] = p;
		exports.modules[module][type] = p;
	}
});