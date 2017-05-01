/*global require, module, $*/
var notify = require('./notify')
	, config = require('../app/config');

function get() {
	return navigator.connection.type;
}

function onlineCallback(e) {
	debugger;
	if (navigator.connection.type === Connection.NONE) {
		$('body').addClass('offline');
		$('header .menu .offline').fadeIn();
	} else {
		$('body').removeClass('offline');
		$('header .menu .offline').fadeOut();
	}
}

function offlineCallback(e) {
	debugger;
	if (navigator.connection.type === Connection.NONE) {
		$('body').addClass('offline');
		$('header .menu .offline').fadeIn();
	} else {
		$('body').removeClass('offline');
		$('header .menu .offline').fadeOut();
	}
}

$('header .menu .offline').on('click', function () {
	//notify.alert(config.connectionMessage);
});

module.exports = {
	onlineCallback: onlineCallback
	, offlineCallback: offlineCallback
	, get: get
};