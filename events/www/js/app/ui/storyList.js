/*global require, module, $*/
var config = require('../config')
    , access = require('../access')
    , connection = require('../../util/connection')
    , header = require('./header')
    , notify = require('../../util/notify')
    , date = require('../../util/date')
    , story = require('./story')
    , refresh = require('./refresh')
    , loading = require('./loading')
    , toLocal = require('./getLocalizedString')
    , localStrings = require('./localizedStrings')
    , android = device.platform.toLowerCase() === 'android'
    , version = device.version.split('.')
    // allow iOS devices and Android devices 4.4 and up to have pull to refresh
    , allowRefresh = !android || (parseInt(version[0], 10) > 4) || ((parseInt(version[0], 10) === 4) && (parseInt(version[1], 10) >= 4));

function show(feedObj, forceActive) {
    if (feedObj.rss && feedObj.rss.channel) {
        feedObj = feedObj.rss.channel;
    }
    return new Promise(function (resolve, reject) {
        var obj = feedObj.story || feedObj.item
            , rtl = /[\u0600-\u06FF\u0750-\u077F]/.test(feedObj.title) || feedObj.title.toLowerCase().indexOf('arabic') > -1
            , fs = config.fs.toURL()
            , path = fs + (fs.substr(-1) === '/' ? '' : '/')
            , feedConfig = access.getFeedsFromConfig()[access.getCurrentId()]
            , pullTop = $('<div/>', {
            id: 'pullrefresh-icon'
        })
            , message = $('<div/>', {
            addClass: 'message'
            , text: ''
        }).append(pullTop)
            , pull = $('<div/>', {
            id: 'pullrefresh'
        }).append(message)
            , topBar = $('<div/>', {
            addClass: 'top-bar'
            ,
            text: toLocal(localStrings.updatedColon, feedConfig.language) + date.getFriendlyDate(feedObj, feedConfig.language)
        })
            , ul = $('<ul/>', {})
            , container = $('<div/>', {
            id: 'story-list-container'
        }).append(topBar).append(pull).append(ul)
            , section = $('<section/>', {
            addClass: 'story-list' + (!!forceActive ? ' active' : '')
            , dir: rtl ? 'rtl' : 'ltr'
        }).append(container).toggleClass('rtl', rtl)
            , sent = false;

        obj.forEach(function (element) {
            var image = element.image ? path + element.image.split('/').pop() : config.missingImage
                , storyTitle = $('<div/>', {
                addClass: 'story-title'
                , text: element.title
            })  , storyLocation = $('<div/>', {
                addClass: 'story-location'
                , text: element.location
            })  , storyDate = $('<div/>', {
                addClass: 'story-date'
                , text: date.getStoryDate(element, feedConfig.language)
            })  , storyText = $('<div/>', {
                addClass: 'story-text'
            }).append(storyLocation).append(storyTitle).append(storyDate)
                , storyImage = $('<img>', {
                src: image
                , addClass: 'story-image'
            })  , hairline = $('<div/>', {
                addClass: 'hairline'
            })  , checkButton = $('<div/>', {
                addClass: 'check-button'
            })  , ticketButton = $('<div/>', {
                addClass: 'ticket-button'
            })  , videoButton = $('<div/>', {
                addClass: 'video-button'
            })  , twitterButton = $('<div/>', {
                addClass: 'twitter-button'
            })  , contactButton = $('<div/>', {
                addClass: 'contact-button'
            })  , fileButton = $('<div/>', {
                addClass: 'file-button'
            })  , choiceBar = $('<div/>', {
                addClass: 'choice-bar'
            }).append(checkButton).append(ticketButton).append(videoButton)
                .append(twitterButton).append(contactButton).append(fileButton)
                , storyItem = $('<div/>', {
                addClass: 'story-item'
            }).append(hairline).append(storyImage).append(storyText).append(choiceBar)
                , li = $('<li/>', {}).append(storyItem);

            ul.append(li);
        });

        $('.container section.story-list').replaceWith(section);

        $('.story-item').on('click', function (e) {
            if (e.clientY > (parseInt($('header').height()) + 5)) {
                var li = $(this).closest('li')
                    , index = $('section.story-list ul li').index(li)
                    , feed = sent ? void 0 : feedObj;

                $('.story-item.active').removeClass('active');
                $(this).addClass('active');
                story.show(index, feed).then(header.showStory);
                sent = true;
            }
        });

        $('.choice-bar').on('click', function (e) {
            if (e && e.preventDefault !== undefined) {
                e.preventDefault()
            }
            if (e && e.stopImmediatePropagation !== undefined) {
                e.stopImmediatePropagation()
            }
        });

        $('.story-image').on('error', function (e) {
            $(this).prop('src', config.missingImage);
        });
        setTimeout(function () {
            if (allowRefresh) {
                refresh.init();
            }
            resolve(200);
        }, 0);

        if (config.track && analytics) {
            analytics.trackEvent('Feed', 'Load', feedObj.title, 10);
        }

        setTimeout(function () {
            loading.hide();
        }, 100)

        $('.container section.story-list').fadeIn()

    })
}

$(document).on('access.refresh', function (e, obj) {
    show(obj, true);
});

module.exports = {
    show: show
};