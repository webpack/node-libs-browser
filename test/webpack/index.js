var context = require.context("../suite", false, /^\.\/.*\.test\.js$/);
Object.keys = require("../../util/objectKeys");
context.keys().forEach(function(test) {
	context(test);
});