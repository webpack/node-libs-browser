var should = require("should");

var libs = require("../index");

describe("node require", function() {

	Object.keys(libs.modules).forEach(function(lib) {

		Object.keys(libs.modules[lib]).forEach(function(version) {

			it("should be able to require " + lib + " as " + version + " version in node", function() {
				var path = libs.modules[lib][version];
				require(path)
			});
		
		});
		
	});

});