module.exports = function (filesystem, dirname) {
	return new Promise(function (resolve, reject) {
		var fileentry = filesystem.root;
		fileentry.getDirectory(dirname || config.folder, {create: false, exclusive: false}, resolve, reject);
	});
}