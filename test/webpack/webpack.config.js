var path = require("path");
module.exports = {
	context: path.join(__dirname, ".."),
	entry: "mocha-loader!./webpack/index",
	output: {
		pathinfo: true
	},
	module: {
		loaders: [
			{ test: /\.json$/, loader: "json-loader" }
		]
	},
	resolve: {
		alias: {},//require("../../index").best,
	}
};
module.exports.resolve.alias.should = path.join(__dirname, "should.js");
