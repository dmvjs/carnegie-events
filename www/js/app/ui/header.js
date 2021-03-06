/*global $, require, module */
var story = require('./story')
	, localSchedule = require('../localSchedule')
	, toLocal = require('./getLocalizedString')
	, localStrings = require('./localizedStrings')
	, localProfile = require('../localProfile')
	, video = require('./video')
	, footer = require('./storyFooter');

var youtubeIsActive = false;
var menuIsActive = false;

$(document)
	.on('touchstart', 'header .show-menu', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
        footer.close();
		hideTV();
		$('.show-menu').addClass('active');
	})
	.on('touchend', 'header .show-menu', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		menuIsActive = !menuIsActive;
		if (menuIsActive) {
			localProfile.setup();
			showMenu();
		} else {
			localProfile.set();
			hideMenu();
		}
	})
	.on('touchstart', 'header .show-tv', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
        footer.close();
		hideMenu();
		//video.removeListeners();
		$('.show-tv').addClass('active');
	})
	.on('touchend', 'header .show-tv', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		youtubeIsActive = !youtubeIsActive;
		if (youtubeIsActive) {
			showTV();
		} else {
			hideTV();
			setTimeout(function () {
				$('.show-tv').removeClass('active');
			}, 100);
		}
	})
	.on('touchstart', 'header .story .back', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
        footer.close();
		$(e.currentTarget).addClass('active');
	})
	.on('touchend', 'header .story .back', function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		$('section.twitter').removeClass('active');
		$('section.survey').removeClass('active');
		$('.close-iframe').hide();
		$('.tweet-header').hide();
		$('#story-cover').hide();
		showStoryList();
		$(e.currentTarget).removeClass('active');
		return false;
	});

$('header a.spanner').on('touchstart', function (e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	hideMenu();
    footer.close();
	hideTV();
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
    footer.close();
	var sels = ['.story', '.story-list']
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
	story.hide();
	computeScheduledStories();
	$('section.story').removeClass('active');
	$('section.story-list').addClass('active');
	show('.story-list');
}

function computeScheduledStories () {
	$('.story-list .story-item').each(function (e, i, a) {
		var $i = $(i);
		var id = parseInt($i.find('.story-list-item-event-id').text(), 10);
		if (localSchedule.has(id)) {
			$i.find('.check-button').addClass('active')
		} else {
			$i.find('.check-button').removeClass('active')
		}
	});
	if ($('.my-schedule-button').hasClass('active')) {
		$('.story-item').show().not($('.choice-bar .check-button.active').closest('.story-item')).hide()
	}
}

function showMenu() {
	hideTV();
	menuIsActive = true;
	$('section.menu').addClass('active');
}

function hideMenu () {
	menuIsActive = false;
	$('.show-menu').removeClass('active');
	$('section.menu').removeClass('active');
}

function showStory() {
	$('header').removeClass('stay');
	$('section.story').addClass('active');
	$('section.story-list').removeClass('active');
	$('footer.story-footer').addClass('active');
	show('.story');
}

function showTV() {
	hideMenu();
	video.get();
	$('section.tv').addClass('active');
}

function hideTV () {
	video.removeListeners();
	youtubeIsActive = false;
	$('section.tv').removeClass('active');
	$('.show-tv').removeClass('active');
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