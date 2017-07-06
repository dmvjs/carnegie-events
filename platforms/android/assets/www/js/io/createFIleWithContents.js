/*global module, require*/
var getFileSystem = require('./getFileSystem')
	, getFile = require('./getFile')
	, getFileEntry = require('./getFileEntry')
	, writeFile = require('./writeFile');

module.exports = function (filename, contents) {
	return new Promise(function (resolve, reject) {

		// full set of Crockford's problem characters https://github.com/douglascrockford/JSON-js/blob/master/json2.js
		var reg = /[\u0000\u000a\u000d\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; // known problem characters, line terminators
		contents = contents.replace(reg, '');

		/*var r2 = /[^0-9A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/g;
		contents = contents.replace(r2, ' ');*/

		try {
			JSON.parse(contents);
		} catch (e) {
			if (void 0 !== window.analytics) {
				analytics.trackEvent('Feed', 'Error', 'JSON Parse Error: ' + filename, 10);
			}
			reject()
		}

		getFileSystem().then(function (filesystem) {
			getFile(filesystem, filename, true).then(function (fileentry) {  
				getFileEntry(fileentry).then(function (filewriter) {
					writeFile(filewriter, contents).then(resolve, reject);
				}, reject);
			}, reject);
		}, reject);
	})
};