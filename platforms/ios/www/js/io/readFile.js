/*global module, require*/
var removeFile = require('./removeFile');

module.exports = function (fileentry) {
	var reader = new FileReader()
		, errorHandler = window.onerror
		, restoreHandler = function () {
			window.onerror = errorHandler;
		};

	return new Promise(function (resolve, reject) {
		var platform = device.platform.toLowerCase();
		var rejection = function (err) {
			restoreHandler();
			reject(err);
		};
		window.onerror = function (err) {
			removeFile(fileentry).then(rejection, rejection)
		};
		fileentry.file(function (f) {
			reader.onloadend = function (s) {
                if (platform.indexOf('ios') > -1) {
					var req = new XMLHttpRequest();
					req.open('GET', s.target._result, false);
					req.overrideMimeType('application\/json; charset=utf-8');
					req.send(null);
					s.target._result = req.responseText;
				}
			    restoreHandler();
                resolve(s);
			};
			reader.onerror = rejection;

			if (platform.indexOf('ios') > -1) {
				reader.readAsDataURL(f)
			} else {
				reader.readAsText(f)
			}
		})
	});
};
