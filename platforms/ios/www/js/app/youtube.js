"use strict";

// 2. This code loads the IFrame Player API code asynchronously.
var player;
var playerReference;
var tag;

if (tag !== undefined) {
    document.head.removeChild(tag);
}
tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function createPlayer () {
    player = document.createElement('div');
    player.id = "player";
    $(document.body).append(player);
    onYouTubeIframeAPIReady();
    setTimeout( function (){
        var p = $('#player');
        p.addClass('active');
    }, 100)
}

function removePlayer () {
    $('#player').removeClass('active');
    setTimeout(function () {
        playerReference.destroy();
        $('.show-tv').removeClass('active');
        $('#player').remove();
    }, 500);
}

function onYouTubeIframeAPIReady() {
    var doc = $(document);
    player = new YT.Player('player', {
        height: $(document.body).hasClass('tablet') ? doc.height() - 130 : doc.height() - 84,
        width: doc.width() - 20,
        playerVars: {
            listType: 'playlist',
            list: 'PL6YCxo9_b_mqFjpENxcKPpwv4x6o1-EOV'
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    playerReference = event.target;
}
