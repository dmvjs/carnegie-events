var youtube = YoutubeVideoPlayer;

function getVideoItems () {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL6YCxo9_b_mqFjpENxcKPpwv4x6o1-EOV&key=AIzaSyB7NdoiNVNmdji2qgGLdiyu36keDBRgMyI&maxResults=25',
        success:function(e){
            console.log(e);
            updateVideoList(e);
        },
        error: function (e) {
            debugger;
            //TODO: show alert?
        }
    });
}

function getBestImage (thumbnails)  {
    if (thumbnails.standard) {
        return thumbnails.standard.url;
    } else if (thumbnails.high) {
        return thumbnails.high.url;
    } else {
        return thumbnails.default.url;
    }
}

function createItemDOM (element) {
    var i = element.snippet;
    var title = $('<div/>', {
        text: i.title
    }), thumb = $('<img/>', {
        src: getBestImage(i.thumbnails)
    }), imageZone = $('<div/>', {
        addClass: 'video-list-item-image'
    }).append(thumb), textZone = $('<div/>', {
        addClass: 'video-list-item-text'
    }).append([title]);

    return $('<div/>', {
        addClass: 'video-list-item'
    }).append([imageZone, textZone]).on('click', function (e) {
        e.preventDefault();
        youtube.openVideo(i.resourceId.videoId);
    });
}

function removeAllClickListeners () {
    $('.video-list-item').off('click');
}

function createVideoDOM (items) {
    return $('<div/>', {
        addClass: 'video-list'
    }).append(items.map(createItemDOM));
}

function updateVideoList (response) {
    var video = $('.tv-container');
    video.empty().append(createVideoDOM(response.items))
}

module.exports = {
    get: getVideoItems,
    removeListeners: removeAllClickListeners
};