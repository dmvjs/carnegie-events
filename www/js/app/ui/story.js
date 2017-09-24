/*global module, require, $*/

var config = require('../config')
    , localSchedule = require('../localSchedule')
    , localRegister = require('../localRegister')
	, access = require('../access')
	, notify = require('../../util/notify')
    , date = require("../../util/date")
	, share = ['ios', 'android', 'win32nt'].indexOf(device.platform.toLowerCase()) > -1
	, browser = ['ios', 'android', 'blackberry 10', 'win32nt'].indexOf(device.platform.toLowerCase()) > -1
	, $story = $('section.story')
	, feedObj
	, index;

if (share && plugins && plugins.socialsharing) {
  $(document)
		.on('touchstart', 'footer.story-footer .share', function (e) {
			$(e.currentTarget).addClass('active');
		})
		.on('touchend', 'footer.story-footer .share', function (e) {
			var ui = $(e.currentTarget);
			if ($(e.currentTarget).hasClass('disabled') === false) {
				setTimeout(function () {
					hideTextResize();
					if (typeof index !== 'undefined' && feedObj && navigator.connection.type !== 'none') {
						window.plugins.socialsharing.share(
								'I\'m currently reading ' + (feedObj.story ? feedObj.story[index].title : feedObj.item[index].title),
							(feedObj.story ? feedObj.story[index].title : feedObj.item[index].title),
								(feedObj.story ? (feedObj.story[index].image) : (feedObj.item[index].image)) || config.missingImage,
							encodeURI(feedObj.story ? feedObj.story[index].link : feedObj.item[index].link)
						);
						if (config.track && analytics) {
							analytics.trackEvent('Story', 'Share', 'Share Clicked', 10);
						}
					} else {
						if (navigator.connection.type === 'none') {
							notify.alert(config.connectionMessage);
						} else {
							notify.alert('Sorry, a problem occurred while trying to share this post')
						}
					}
					ui.removeClass('active');
				}, 0)
			} else {
				ui.removeClass('active');
			}
		})
} else {
  //remove footer & make story window taller, sharing not supported
  $('footer.story-footer button.share').addClass('disabled');
}

if (browser) {
  $(document).on('click', 'section.story .current a', function (e) {
      var href = $(e.currentTarget).attr('href');

    if (href && href.substr(0, 1) === '#') {
      if (href === "#"){
          e.preventDefault();
          return false;
      } else if ($('.current').find(href)) {
        if (config.track && analytics) {
          analytics.trackEvent('Story', 'Link', 'Page Anchor Clicked', 10);
        }
	      e.preventDefault()
	      $('.current').scrollTop($(href).position().top);
      } else {
        e.preventDefault();
        return false;
      }
    } else if (navigator.connection.type !== 'none') {
      e.preventDefault();
      if (href && href.substr(0, 6) === 'mailto') {
        window.open(encodeURI(href), '_system', '');
        if (config.track && analytics) {
          analytics.trackEvent('Story', 'Link', 'Email Link Clicked', 10);
        }
      } else {
        window.open(encodeURI(href), '_blank', 'location=no,toolbar=yes,enableViewportScale=yes');
        if (config.track && analytics) {
          analytics.trackEvent('Story', 'Link', 'External Link Clicked', 10);
        }
      }
    } else {
      e.preventDefault();
      notify.alert(config.connectionMessage);
    }
  })
} else {
  // handle systems with no inapp browser, or don't...
}

$(document)
	.on('touchstart', 'footer.story-footer .text', function (e) {
		$(e.currentTarget).addClass('active');
	})
	.on('touchend', 'footer.story-footer .text', function (e) {
		var ui = $(e.currentTarget);
		setTimeout(function () {
			$('.text-resize').toggleClass('active');
			if (config.track && analytics) {
				analytics.trackEvent('Story', 'UI', 'Text Resize Opened', 10);
			}
			ui.removeClass('active');
		}, 10)
	});

function hideTextResize() {
  $('.text-resize').removeClass('active');
    $('footer.story-footer').removeClass('active');
}

function show(i, feed) {
  return new Promise(function (resolve, reject) {
    var obj = feedObj = feed || feedObj
      , storyObj = obj.story ? obj.story[i] : obj.item[i]
      , rtl = /[\u0600-\u06FF\u0750-\u077F]/.test(feedObj.title) || feedObj.title.toLowerCase().indexOf('arabic') > -1
      , current = $('<div/>', {
        addClass: 'current'
      });

    index = i;
    $('section.story').toggleClass('rtl', !!rtl).prop('dir', rtl ? 'rtl' : 'ltr');

    if (config.track && analytics) {
      track(obj.story ? obj.story[i].title : obj.item[i].title);
    }

    createPage(storyObj).then(function (page) {
      current.append(page);
      $('section.story .current').replaceWith(current);

      createPreviousAndNext();

      setTimeout(function () {
          resolve(200)
      }, 0)
    }, reject);
  })
}

function createPrevious() {
  var previous = $('<div/>', {
      addClass: 'previous'
    })
    , $previous = $('section.story .previous');

  if (notFirst()) {
    createPage(feedObj.story ? feedObj.story[index - 1] : feedObj.item[index - 1]).then(function (pageP) {
      previous.append(pageP);
      if ($previous.length) {
        $previous.replaceWith(previous);
      } else {
        $('section.story').append(previous);
      }
    })
  } else {
    $previous.empty()
  }
}

function createNext() {
  var next = $('<div/>', {
      addClass: 'next'
    })
    , $next = $('section.story .next');

  if (notLast()) {
    createPage(feedObj.story ? feedObj.story[index + 1] : feedObj.item[index + 1]).then(function (pageN) {
      next.append(pageN);
      if ($next.length) {
        $next.replaceWith(next);
      } else {
        $('section.story').append(next);
      }
    })
  } else {
    $next.empty()
  }
}

function createPreviousAndNext() {
  createPrevious();
  createNext();
}

function createPage(storyObj) {
    //console.log(storyObj);
  return new Promise(function (resolve, reject) {
    var fs = config.fs.toURL()
      , path = fs + (fs.substr(-1) === '/' ? '' : '/')
      , image = storyObj.image ? path + storyObj.image.split('/').pop() : config.missingImage
      , specialImage = storyObj["specialNameImage"] && path + storyObj["specialNameImage"].split('/').pop()
      , feedConfig = access.getFeedsFromConfig()[access.getCurrentId()]
      , topBar = $('<div/>', {
        addClass: 'top-bar',
            text: storyObj.location + ' – ' + storyObj.pubDate
      })
      , storyTitle = $('<div/>', {
        addClass: 'story-title', text: storyObj.title || ''
      })
      , storyImage = $('<img>', {
        src: image, addClass: 'story-image'
      })
      , storySpecialImage = specialImage ? $('<img>', {
        src: specialImage, addClass: 'story-special-image'
      }) : null
      , storySpecialImageContainer = specialImage ? $('<div/>', {
        addClass: 'story-special-image-container'
      }).append(storySpecialImage) : null
      , storyAuthor = $('<div/>', {
        addClass: 'story-author', text: storyObj.author || ''
      })
      , storyDate = $('<div/>', {
        addClass: 'story-date', text: date.getStoryDate(storyObj, feedConfig.language)
      })
      , storyMeta = $('<div/>', {
        addClass: 'story-meta'
      }).append(storyTitle).append(storyAuthor).append(storyDate)
      , storyTop = $('<div/>', {
        addClass: 'story-top'
      }).append(storyImage).append(storySpecialImageContainer).append(storyMeta)
       , storySummary = $('<div/>', {
        addClass: 'story-summary',
        text: storyObj.summary
      })
        , storySpeakers = $('<div/>', {
        addClass: 'story-speakers',
        html: !!storyObj.speakerList ? ('<div class="story-speaker-list-featuring">Featuring</div>' + storyObj.speakerList) : null
    })
      , storySummaryContainer = $('<div/>', {
        addClass: 'story-summary-container'
      }).append([storySummary, storySpeakers])
      , storyText = $('<div/>', {
        addClass: 'story-text', html: storyObj.description
      })
      , page = $('<div/>', {
        addClass: 'page',
        "data-object": JSON.stringify(storyObj)
      });

      /*if (!specialImage) {
          page.append(topBar)
      }*/

      page.append([topBar, storyTop, storySummaryContainer, storyText]);

    storyImage.on('error', function (e) {
      $(this).prop('src', config.missingImage);
    });

      if ((storyObj.regLink !== undefined) && (storyObj.regLink !== "") && (storyObj.regLink !== null)) {
          var isRegistered = storyObj.eventID && localRegister.has('' + storyObj.eventID);
          var registrationLink = $('<a/>', {
              addClass: "has-ticket",
              text: isRegistered ? "Registered" : "Register Now"
          });

          var cancelLink = $('<a/>', {
              addClass: "cancel-registration",
              text: "Cancel Registration",
              href: '#'
          });

          var isAddedToCalendar = storyObj.eventID && localSchedule.has('' + storyObj.eventID);

          var calendarLink = $('<a/>', {
              addClass: "add-to-calendar",
              text: isAddedToCalendar ? 'Open in Calendar' : "Add to Calendar",
              href: '#'
          });

          var registrationContainer = $('<div/>', {
              addClass: 'registration-container'
          });

          registrationContainer.append(registrationLink, calendarLink, cancelLink);

          if (!isRegistered) {
              registrationLink.on('click', submitForm);
              cancelLink.hide();
          }
          calendarLink.on('click', isAddedToCalendar ? justOpenCalendar : openCalendarLink);
          cancelLink.on('click', function () {
              $.ajax({
                  url: storyObj.cancelRegLink,
                  success: function (e) {
                      cancelRegistration();
                  },
                  error: function (e) {
                      notify.alert('An error occurred while registering from this event.')
                  }
              });
          });

          page.append(registrationContainer);
      }

    setTimeout(function () {
      resolve(page)
    }, 0)
  })
}

function switchCalendarLink () {
    $('.add-to-calendar').text('Open in Calendar').off('click', openCalendarLink).on('click', justOpenCalendar);
}

function switchRegisterLink () {
    $('.has-ticket').text('Registered').off('click', submitForm);
    $('.cancel-registration').show();
}

function cancelRegistration () {
    $('.has-ticket').text('Register Now').on('click', submitForm);
    $('.cancel-registration').hide();
}

function getCurrentPageData () {
    var currentPage = $('.current .page');
    var data = currentPage && currentPage.data !== undefined && typeof currentPage.data === 'function' && currentPage.data();

    if (!!data) {
        return data.object;
    }
    return void 0;
}

function getCalendarData () {
    var data = getCurrentPageData();
    if (data !== undefined) {
        return data.calendarLink;
    }
    return void 0;
}

function justOpenCalendar () {
    var calendarData = getCalendarData();
    if (calendarData !== undefined) {
        var startDate = calendarData.startDate !== undefined && new Date(calendarData.startDate);
        var endDate = calendarData.endDate !== undefined && new Date(calendarData.endDate);
        if (startDate !== undefined && endDate !== undefined) {
            window.plugins.calendar.openCalendar(startDate);
        }
    }
    return false;
}

function openCalendarLink () {
    var data = getCurrentPageData();
    var calendarData = getCalendarData();
    if (calendarData !== undefined) {
        var startDate = calendarData.startDate !== undefined && new Date(calendarData.startDate);
        var endDate = calendarData.endDate !== undefined && new Date(calendarData.endDate);
        if (startDate !== undefined && endDate !== undefined) {
            window.plugins.calendar.createEventWithOptions(
                data.title,
                data.location || '',
                "no",
                startDate,
                endDate,
                {},
                function (e){
                    localSchedule.add(data.eventID);
                    //update add to calendar state to show registered, disable listener
                    //on story load, check registered status and update button onload

                    console.log(e);
                    switchCalendarLink();
                    justOpenCalendar();
                },
                function (e){
                    console.log(e)
                }
            );
        }
    }
    //title, location, notes, startDate, endDate, options, successCallback, errorCallback
}

function notLast(id) {
  var length = feedObj.story ? feedObj.story.length : feedObj.item.length;
  return id || index < length - 1;
}

function notFirst(id) {
  return id || index > 0;
}

function next() {
  if (notLast()) {
    index += 1;
    var c = $('section.story .current')
      , n = $('section.story .next');

    $('section.story .previous').remove();
    c.removeClass('current').addClass('previous');
    n.removeClass('next').addClass('current');
    update();
    createNext();
    track(feedObj.story ? feedObj.story[index].title : feedObj.item[index].title);
  }
}

function track(title) {
  if (config.track && analytics) {
    analytics.trackEvent('Story', 'Load', title, 10);
  }
}

function previous() {
  if (notFirst()) {
    index -= 1;
    var c = $('section.story .current')
      , p = $('section.story .previous');

    $('section.story .next').remove();
    c.removeClass('current').addClass('next');
    p.removeClass('previous').addClass('current');
    update();
    createPrevious();
    track(feedObj.story ? feedObj.story[index].title : feedObj.item[index].title);
  }
}

function update() {
  hideTextResize();
  $('section.story-list ul li .story-item.active').removeClass('active');
  $('section.story-list ul li .story-item').eq(index).addClass('active');

  setTimeout(function () {
    $('section.story .next').scrollTop(0);
    $('section.story .previous').scrollTop(0);
      if (index === 0) {
          $('.story-list').scrollTop(0)
      } else {
          $('.story-list').scrollTop(
              parseInt($('.story-list ul li').eq(0).height(), 10) +
              ((index - 1) * parseInt($('.story-list ul li').eq(1).height(), 10))
          )
      }
  }, 350)
}

function showAndUpdate(index) {
  show(index, null, true).then(function () {
    update();
  });
}

function prevalidateForm () {
    var isRejected = false;
    if (window.localStorage !== undefined && window.localStorage.LocalProfileSetting !== undefined) {
        var json = JSON.parse(localStorage.LocalProfileSetting);
        ['firstName', 'lastName', 'email', 'organization'].map(function (e) {
            if (json !== undefined && json[e] !== undefined) {
                if (json[e] === "") {
                    if (!isRejected) {
                        rejectFormSubmission("" + e + " was missing");
                        isRejected = true;
                    }
                }
            }
        });
    }
    return isRejected;
}

function submitForm (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var form = document.getElementById('registration-form');
    if (window.localStorage !== undefined && window.localStorage.LocalProfileSetting !== undefined) {
        var isRejected = prevalidateForm();
        var json = JSON.parse(localStorage.LocalProfileSetting);

        if (!isEmailValid(json['email'])) {
            isRejected = true;
            console.log('email rejected')
        }
        //TODO: not just whitespace in fields
        //
        if (isRejected === false) {
            $("#firstnameEventReg").val(json.firstName);
            $("#lastnameEventReg").val(json.lastName);
            $("#institutionEventReg").val(json.organization);
            $("#contactemailEventReg").val(json.email);
            $("#isPressMember").prop('checked', json.press);
            $.ajax({
                url:'http://carnegieendowment.org/events/forms/index.cfm?fa=register',
                type:'post',
                data: $('#eventRegistration').serialize(),
                success: function (e) {
                    var response;
                    try {
                        response = e && JSON.parse(e);
                    } catch (e) {
                        console.log('post fail', e);
                    }
                    if (response !== undefined) {
                        console.log('post success', response);
                        var id = $(event.currentTarget).closest('.page').data().object.eventID;
                        console.log('ID: ' + id);

                        if (id) {
                            localRegister.add('' + id);
                            switchRegisterLink();
                        }

                    }
                },
                error: function (e) {
                    console.log('post error', e);
                }
            });
        }
    } else {
        rejectFormSubmission("no local data available");
    }
}

function isEmailValid (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function rejectFormSubmission (message) {
    console.log(message);
    notify.alert('Tap the gear icon to provide your information.')
}

module.exports = {
    show: show,
    next: next,
    previous: previous,
    hide: hideTextResize
};