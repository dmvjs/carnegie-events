var story = require('./story');

$('footer.story-footer .twitter').on('click', function () {
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
        $('section.twitter').toggleClass('active')
    }
});

function showTwitterInFooter () {
    $(data.twitterID).show()
}

function showTwitterInFooterWithLogic () {
    var data = story.getCurrentPageData();
    $(data.twitterID).toggle((data !== undefined && data.twitterID !== undefined))
}

function hideTwitterInFooter () {
    $(data.twitterID).hide();
}

module.exports = {
    showTwitterInFooter: showTwitterInFooter,
    hideTwitterInFooter: hideTwitterInFooter,
    showTwitterInFooterWithLogic: showTwitterInFooterWithLogic
};