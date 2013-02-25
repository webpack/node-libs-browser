var events = require("events");

exports = module.exports = new events.EventEmitter();

var processPart = require("../part/_process.js");

for(var name in processPart) exports[name] = processPart[name];