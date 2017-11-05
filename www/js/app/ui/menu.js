/*global module, require, $*/

var config = require('../config')
	, menu = require('../config-menu')
	, notify = require('../../util/notify')
	, access = require('../access')
	, header = require('./header')
	, loading = require('./loading')
	, date = require('../../util/date')
	, storyList = require('./storyList')
	, doesFileExist = require('../../io/doesFileExist')
	, getFileContents = require('../../io/getFileContents')
	, toLocal = require('./getLocalizedString')
	, localStrings = require('./localizedStrings')
	, primary = false;

function updateHeaderCenterImage (id) {
	var classToAdd = access.getFilenameFromId(id).split(".").shift();
	var classes = access.getFeedsFromConfig();
	var header = $("header");

	if (!header.hasClass(classToAdd)) {
		for (var name in classes) {
			if (classes.hasOwnProperty(name)) {
				header.removeClass(classes[name].filename.split(".").shift());
			}
		}
		if (classToAdd !== "mobile-global") {
			header.addClass(classToAdd);
		}
	}
}

function update(filename, date) {
	var items = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]');
	items.text(date);
	items.closest('li').find('.check').removeClass('loading').addClass('checked');
}

function get(id, loadOnly, $el) {
	var filename = access.getFilenameFromId(id);
	$el.closest('li').find('.check').addClass('loading');

	access.get(id, loadOnly).then(function (contents) {
		var obj = (JSON.parse(contents.target._result));

		update(filename, toLocal(localStrings.updatedColon) + date.getFriendlyDate(obj));
		if (!loadOnly) {
			storyList.show(obj).then(function () {
        header.showStoryList();
			});
		}
	}, function (error) {
		var filename = access.getFilenameFromId(id)
			, item = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li');

		analytics.trackEvent('Menu', 'Error', 'Feed Load Error: ' + access.getFilenameFromId(id), 10);
		remove(id);
		notify.alert(getFeedError(toLocal(access.getFeedNameFromId(id)) || access.getFeedNameFromId(id), window.__languageForCarnegie || "en"));
	});
}

function getFeedError (name, language) {
	var error = {
		"ar": name + "ثمة مشكلة في إظهار المحتوى "
		, "ru": "Ошибка загрузки " + name
		, "zh": "加载" + name + "项目出错"
		, "en": 'There was an error processing the ' + name + ' feed'
	};
	return error[language] || error["en"];
}

function cleanup(id) {
	var filename = access.getFilenameFromId(id)
		, item = $('section.menu .menu-item-box .sub[data-url="' + filename + '"]').closest('li');

	item.find('.check').removeClass('checked loading');
	item.find('.sub').text(config.menuMessage);
	if (item.hasClass('active')) {
		item.removeClass('active');
		primary.addClass('active');
		getFileContents(access.getFilenameFromId(0)).then(function (contents) {
			var obj = (JSON.parse(contents.target._result));
			storyList.show(obj);
		})
	}
}

function remove(id) {

	access.removeFeed(id).then(function () {
		cleanup(id)
	}, function () {
		cleanup(id)
	})
}

$(document).on('access.refresh', function (e, obj, filename) {
  update(filename, toLocal(localStrings.updatedColon) + date.getFriendlyDate(obj));
});

module.exports = {
	update: update
};

$('#profile-submit-button').on('click', function (e) {
	e.preventDefault();
	$('.story-list a.show-menu').trigger('touchstart').trigger('touchend');
	// check items for validation
	// submit only if ok
});