var story = require('./story');

$('footer.story-footer .twitter').on('click', function () {
    $('#survey-container').removeClass('active');
    $('#twitter-container').empty();
    var data = story.getCurrentPageData();
    if (data !== undefined && data.twitterID !== undefined) {
        window.twttr.widgets.createTimeline(
            {
                sourceType: 'widget',
                widgetId: data.twitterID
            },
            document.getElementById('twitter-container')
        );
        $('section.twitter').toggleClass('active');
        var closeButton = $('<div/>', {
            addClass: 'close-iframe',
            text: '✕'
        }).on('click', function () {
            closeTwitterAndSurvey();
        });
        $('#twitter-container').prepend(closeButton);
    }
});

$('footer.story-footer .survey').on('click', function () {
    $('#twitter-container').removeClass('active');
    var sc = $('#survey-container');
    sc.empty();
    var data = story.getCurrentPageData();
    if (!!data.survey) {
        var iframe = document.createElement('iframe');
        iframe.scrolling = 'no';
        iframe.width = '100%';
        iframe.height = '' + $(document).height() - (88 + 44 + 20 + 44) + 'px';
        iframe.src = data.survey;
        sc.eq(0).append(iframe);
        $('section.survey').toggleClass('active');
        var closeButton = $('<div/>', {
            addClass: 'close-iframe',
            text: '✕'
        }).on('click', function () {
            closeTwitterAndSurvey();
        }).hide();
        setTimeout(function () {
            $('#survey-container').prepend(closeButton);
            closeButton.fadeIn();
        }, 200);
    }
});

function closeTwitterAndSurvey () {
    $('section.survey').removeClass('active');
    $('section.twitter').removeClass('active');
}

$('footer.story-footer .close-iframe').on('click', function () {

});
