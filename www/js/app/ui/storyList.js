/*global require, module, $*/
var config = require('../config')
    , localSchedule = require('../localSchedule')
    , localMenuView = require('../localMenuView')
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
            addClass: 'top-bar',
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
            var isScheduled = localSchedule.has(element.eventID);
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
            })
                , storyText = $('<div/>', {
                addClass: 'story-text'
            }).append([storyLocation, storyTitle, storyDate])
                , storyImage = $('<img>', {
                src: image
                , addClass: 'story-image'
            })  , storyEventID = $('<div/>', {
                addClass: 'story-list-item-event-id',
                text: element.eventID
            }).hide()
                , hairline = $('<div/>', {
                addClass: 'hairline'
            })  , checkButton = $('<div/>', {
                addClass: 'check-button'
            }).toggleClass("active", isScheduled)
                , ticketButton = $('<div/>', {
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
            })
            .append(checkButton)
            .append(!!element.regLink ? ticketButton : null)
            .append(!!element.livestream && element.liveStream !== "False" ? videoButton : null)
            .append(element.twitterID !== undefined ? twitterButton : null)
            .append(!!element.survey ? contactButton : null)
            .append(!!element.resourceList ? fileButton : null)
                , storyItem = $('<div/>', {
                addClass: 'story-item'
            }).append([storyEventID, hairline, storyImage, storyText, choiceBar])
                , li = $('<li/>', {}).append(storyItem);

            ul.append(li);

            $(checkButton).on('click', function (e) {
                var isScheduledOnClick = localSchedule.has(element.eventID);
                if (isScheduledOnClick) {
                    localSchedule.remove(element.eventID);
                } else {
                    localSchedule.add(element.eventID);
                }
                $(this).toggleClass("active", !isScheduledOnClick);
                if ($('.my-schedule-button').hasClass('active')) {
                    $('.my-schedule-button').click()
                }
            });
        });
        
        var myScheduleButton = $('<div/>', {
            addClass: 'my-schedule-button',
            text: 'My Schedule'
        }).on('click', footerButtonClicked)
            , allEventsButton = $('<div/>', {
            addClass: 'all-events-button active',
            text: 'All Events'
        }).on('click', footerButtonClicked)
            , myButtonContainer = $('<div/>', {
            addClass: 'footer-button-container'
        }).append(myScheduleButton).append(allEventsButton);
        var footerBox = $('<div/>', {
            addClass: 'footer-box'
        }).append(myButtonContainer);

        var footerContainer = $('.container');
        var footerBoxes = footerContainer.find('.footer-box');
        var hasFooters = footerBoxes.length > 0;
        if (hasFooters) {
            footerContainer.find('.footer-box').eq(0).replaceWith(footerBox);
        } else {
            footerContainer.append(footerBox);
        }

        function footerButtonClicked () {
            var scheduleButton = $('.my-schedule-button');
            var eventsButton = $('.all-events-button');
            if ($(this).is(scheduleButton)) {
                localMenuView.set(true);
                eventsButton.removeClass('active');
                $('.story-item').not($('.choice-bar .check-button.active').closest('.story-item')).slideUp()

            } else if ($(this).is(eventsButton)){
                localMenuView.set(false);
                scheduleButton.removeClass('active');
                $('.story-item').slideDown();
            }
            $(this).addClass('active')
        }

        $('.container section.story-list').replaceWith(section);

        $('.story-item').on('click', function (e) {
            if (e.clientY > (parseInt($('header').height()) + 5)) {
                var li = $(this).closest('li')
                    , index = $('section.story-list ul li').index(li)
                    , feed = sent ? void 0 : feedObj;
                $(this).addClass('active');
                story.show(index, feed).then(header.showStory);
                sent = true;
                setTimeout(function () {
                    $('.story-item.active').removeClass('active');
                }, 350)
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
            /*if (localMenuView.isMySchedule()) {
                myScheduleButton.click()
            }*/
        }, 100);

        $('.container section.story-list').fadeIn()

    })
}

$(document).on('access.refresh', function (e, obj) {
    show(obj, true);
});

module.exports = {
    show: show
};