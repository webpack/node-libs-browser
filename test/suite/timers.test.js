var should = require("should");

describe("timers", function() {
	
	it("should set a timeout after 200 ms", function(done) {
		var timeout1 = false;
		setTimeout(function() { timeout1 = true; }, 150);
		require("timers").setTimeout(function() {
			timeout1.should.be.eql(true);
			done();
		}, 200);
	});
	
	it("should clear a timeout");
	it("should set a interval");
	it("should clear a interval");
	
});