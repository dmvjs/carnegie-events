var story = require('./story');
var closeButton = $('.close-iframe').on('click', function () {
    closeTwitterAndSurvey();
}).hide();
var tweetHeader = $('.tweet-header').on('click', function () {
    openInTwitter();
}).hide();
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
    if (data !== undefined && data.twitterID !== undefined) {
        var href = 'https://twitter.com/search?f=tweets&lang=en&q=%23' + 'carnegie';
        window.open(href, '_system', '');
    }
}

$('footer.story-footer .twitter').on('click', function () {
    $('#survey-container').removeClass('active');
    $('#twitter-container').empty();
    var data = story.getCurrentPageData();
    var $body = $(window.document.body);
    if (data !== undefined && data.twitterID !== undefined && window.twttr !== undefined) {
        var isTablet = $body.hasClass('tablet');
        var isAndroid = $body.hasClass('android');
        window.twttr.widgets.createTimeline(
            {
                sourceType: 'widget',
                widgetId: data.twitterID

            },
            document.getElementById('twitter-container'),
            {
                height: $('#twitter-container').height(),
                chrome: 'noheader nofooter'
            }
        );
        $('section.twitter').toggleClass('active');
        closeButton.show();
        tweetHeader.show();
        storyCover.show();
    }
});

$('footer.story-footer .survey').on('click', function () {
    $('#twitter-container').removeClass('active');
    var sc = $('#survey-container');
    sc.empty();
    var data = story.getCurrentPageData();
    if (!!data.survey) {
        var iframe = document.createElement('iframe');
        var $body = $(window.document.body);
        var isTablet = $body.hasClass('tablet');
        var isAndroid = $body.hasClass('android');
        $body.hasClass('tablet');
        iframe.scrolling = 'no';
        iframe.width = '100%';
        iframe.height = '' + $('#survey-container').height() + 'px';
        iframe.src = data.survey;
        sc.eq(0).append(iframe);
        $('section.survey').toggleClass('active');
        closeButton.show();
        storyCover.show();
    }
});

function closeTwitterAndSurvey () {
    $('section.survey').removeClass('active');
    $('section.twitter').removeClass('active');
    closeButton.hide();
    tweetHeader.hide();
    storyCover.hide();
}