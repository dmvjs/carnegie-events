/*global $, require, module */
var story = require('./story')
	, toLocal = require('./getLocalizedString')
	, localStrings = require('./localizedStrings')
	, loading = require('./loading')
	, localProfile = require('../localProfile')
	, video = require('./video');

var youtubeIsActive = false;
var menuIsActive = false;

$(document)
	.on('touchend', 'header .show-menu', function (e) {
		if (youtubeIsActive) {
			youtubeIsActive = false;
			$('.show-tv').removeClass('active');
		}
		menuIsActive = !menuIsActive;
		if (menuIsActive) {
			localProfile.setup();
			showMenu();
		} else {
			localProfile.set();
			showStoryList();
		}
	})
	.on('touchstart', '.show-tv', function () {
		$('.show-tv').addClass('active');
	})
	.on('touchend', '.show-tv', function () {
		if (menuIsActive) {
			menuIsActive = false;
			$('.show-menu').removeClass('active');
		}
		youtubeIsActive = !youtubeIsActive;
		if (youtubeIsActive) {
			showTV();
		} else {
			showStoryList();
			setTimeout(function () {
				$('.show-tv').removeClass('active');
			}, 100);
		}
	})
	.on('touchstart', 'header .story .back', function (e) {
		$(e.currentTarget).addClass('active');
	})
	.on('touchend', 'header .story .back', function (e) {
		var ui = $(e.currentTarget);
		setTimeout(function () {
			showStoryList();
			ui.removeClass('active');
		});
	});

$('header a.spanner').on('touchstart', function (e) {
	e.preventDefault();
	if (youtubeIsActive === true) {
		youtubeIsActive = false;
	}
});


addListeners();

function addListeners() {
  addListener('previous');
  addListener('next');
}

function removeListeners() {
  removeListener('previous');
  removeListener('next');
}

function removeListener(className) {
  if (className === 'previous' || className === 'next') {
    $(document)
			.off('touchstart', 'header .story .btn-group .' + className)
			.off('touchend', 'header .story .btn-group .' + className);
  }
}

function addListener(className) {
  if (className === 'previous' || className === 'next') {
    $(document)
			.on('touchstart', 'header .story .btn-group .' + className, function (e) {
				$(e.currentTarget).addClass('active');
				setTimeout(function () {
					story[className]();
				}, 0);
			})
			.on('touchend', 'header .story .btn-group .' + className, function (e) {
				var ui = $(e.currentTarget);
				removeListeners();
				setTimeout(function () {
					addListeners();
					ui.removeClass('active');
				}, 350)
			})
  }
}

function show(sel) {
	var sels = ['.menu', '.story', '.story-list', '.tv']
		, $h = $('header')
		, $sel = $h.find(sel).stop(true);

	sels.splice(sels.indexOf(sel), 1);

	sels.forEach(function (el) {
		var $el = $h.find(el);

		$el.removeClass('active');
	});

  $sel.addClass('active');
}

function showStoryList() {
	$('section').removeClass('active');
	$('section.story-list').addClass('active');
	$('footer.story-footer').removeClass('active');
	show('.story-list');
	story.hide();
}

function showMenu() {
	$('section.tv').removeClass('active');
	$('section.menu').addClass('active');
	show('.menu');
}

function showStory() {
	$('header').removeClass('stay');
	$('section').removeClass('active');
	$('footer.story-footer').addClass('active');
	$('section.story').addClass('active');
	show('.story');
}

function showTV() {
	video.get();
	$('section.menu').removeClass('active');
	$('section.tv').addClass('active');
	show('.tv');
}

function updateLanguageUI () {
	$('header .story .back .label').text(toLocal(localStrings.back));
	$('#loading-int').text(toLocal(localStrings.loading));
}

module.exports = {
	showStoryList: showStoryList
	, showMenu: showMenu
	, showStory: showStory
	, updateLanguageUI: updateLanguageUI
};