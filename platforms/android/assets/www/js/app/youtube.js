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
    $(document.body).prepend(player);
    onYouTubeIframeAPIReady();
}

function removePlayer () {
    playerReference.destroy()
    $('.show-tv').removeClass('active');
    $('#player').remove()
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: $(document).height() - 64,
        width: $(document).width(),
        playerVars: {
            listType: 'playlist',
            list: 'UUwR2e46YHLbPw1k_O3y_qug'
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
