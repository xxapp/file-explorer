var fs = require('fs');

exports.getBasePath = function () {
	var config = null;
	try {
		var fileContent = fs.readFileSync('fe.config.json', 'utf-8');
		config = JSON.parse(fileContent);
	} catch (err) {}
	return config ? config.basePath : '';
}