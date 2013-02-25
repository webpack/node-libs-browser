module.exports = Object.keys || function objectKeys(object) {
	if (object !== Object(object)) throw new TypeError('Invalid object');
	var result = [];
	for (var name in object) {
		if (Object.prototype.hasOwnProperty.call(object, name)) {
			result.push(name);
		}
	}
	return result;
};
