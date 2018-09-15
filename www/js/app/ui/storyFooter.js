var resource = require('./resource');
var story = require('./story');
var resourceContainer = $('#resource-container');
var closeButton = $('.close-iframe').on('click', function () {
    closeTwitterAndSurveyAndResource();
}).hide();
var tweetHeader = $('.tweet-header').on('click', openInTwitter).hide();
var storyCover = $('#story-cover')
    .on('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    })
    .on('touchmove', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    })
    .on('touchend', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }).hide();

function openInTwitter () {
    var data = story.getCurrentPageData();
    if (data !== undefined && data.twitterHashtag !== undefined) {
        var href = 'https://twitter.com/search?f=tweets&lang=en&q=%23' + data.twitterHashtag;
        window.open(href, '_system', '');
    }
}

$('footer.story-footer .twitter').on('click', function () {
    $('#survey-container').removeClass('active');
    resource.hideResource();
    $('#twitter-container').empty();
    var data = story.getCurrentPageData();
    if (data !== undefined && data.twitterHashtag !== undefined) {
        window.open(encodeURI('https://twitter.com/search?f=tweets&lang=en&q=%23' + data.twitterHashtag), '_system', '');
    }
});

$('footer.story-footer .resource').on('click', function () {
    $('#survey-container').removeClass('active');
    $('#twitter-container').removeClass('active');
    var data = story.getCurrentPageData();
    if (data && (data.resourceList || data.category)) {
        resourceContainer.empty();
        var resourceListHTML = $('<div/>', {
            addClass: "resource-content",
            html: '' + (data.resourceList || '') + (data.category || '')
        });
        resourceContainer.append(resourceListHTML);
    }

    resource.showResource();
    closeButton.show();
    storyCover.show();
});

$('footer.story-footer .survey').on('click', function () {
    $('#twitter-container').removeClass('active');
    resource.hideResource();
    var sc = $('#survey-container');
    sc.empty();
    var data = story.getCurrentPageData();
    if (!!data.survey) {
        var iframe = document.createElement('iframe');
        var $body = $(window.document.body);
        $body.hasClass('tablet');
        iframe.width = '100%';
        iframe.height = '' + $('#survey-container').height() + 'px';
        iframe.src = data.survey;
        iframe.sandbox="allow-same-origin allow-scripts allow-forms";
        sc.eq(0).append(iframe);
        $('section.survey').toggleClass('active');
        closeButton.show();
        storyCover.show();
    }
});

function closeTwitterAndSurveyAndResource () {
    $('section.survey').removeClass('active');
    $('section.twitter').removeClass('active');
    resource.hideResource();
    resourceContainer.empty();
    closeButton.hide();
    tweetHeader.hide();
    storyCover.hide();
}

module.exports = {close: closeTwitterAndSurveyAndResource};