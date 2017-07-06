/*global $, require, module */
var story = require('./story')
	, toLocal = require('./getLocalizedString')
	, localStrings = require('./localizedStrings')
	, loading = require('./loading')
	, localProfile = require('../localProfile');

var youtubeIsActive = false;
var menuIsActive = false;

$(document)
	.on('touchend', 'header .show-menu', function (e) {
		menuIsActive = !menuIsActive;
		if (youtubeIsActive) {
			youtubeIsActive = false;
			removePlayer();
		}
		$('header').addClass('stay');
		if (menuIsActive) {
			localProfile.setup();
			showMenu();
		} else {
			localProfile.set();
			showStoryList();
		}
	})
	.on('touchstart', '.show-tv', function (e) {
		$(e.currentTarget).addClass('active');
	})
	.on('touchend', '.show-tv', function (e) {
		youtubeIsActive = !youtubeIsActive;
		setTimeout(function () {
			if (youtubeIsActive) {
				createPlayer()
			} else {
				$(e.currentTarget).remove('active');
				removePlayer()
			}
		});
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
		removePlayer()
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
	var sels = ['.menu', '.story', '.story-list', '.show-tv']
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
	$('section.story').removeClass('active');
	$('section.story-list').addClass('active');
	$('section.menu').removeClass('active');
	$('footer.story-footer').removeClass('active');
	show('.story-list');
	story.hide();
}

function showTV() {
	$('section.show-tv').addClass('active');
	show('.show-tv');
}

function showMenu() {
	$('section.menu').addClass('active');
	show('.menu');
}

function showStory() {
	$('header').removeClass('stay');
	$('section.menu').removeClass('active');
	$('footer.story-footer').addClass('active');
	$('section.story').addClass('active');
	show('.story');
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