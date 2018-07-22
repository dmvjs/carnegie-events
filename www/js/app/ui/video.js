var youtube = window.YoutubeVideoPlayer;

function getVideoItems () {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL6YCxo9_b_mqFjpENxcKPpwv4x6o1-EOV&key=AIzaSyB7NdoiNVNmdji2qgGLdiyu36keDBRgMyI&maxResults=25',
        success:function(e){
            updateVideoList(e);
        },
        error: function (e) {
            console.log(e);
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
    var dateArray = new Date(i.publishedAt).toString().split(' ');
    var title = $('<div/>', {
        text: i.title
    }), frame = $('<div/>', {
        addClass: 'video-list-item-image-frame',
        css: {
            backgroundImage: 'url("' + getBestImage(i.thumbnails) + '")',
            width: $(document).width() - 70 + 'px',
            height: ((($(document).width() - 70) / 16) * 9) + 'px',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
        }
    }), imageZone = $('<div/>', {
        addClass: 'video-list-item-image'
    }).append(frame), textZone = $('<div/>', {
        addClass: 'video-list-item-text'
    }).append([title]), dateZone = $('<div/>', {
        addClass: 'video-list-item-date',
        text: 'Posted: ' + [dateArray[0], dateArray[1], dateArray[2], dateArray[3]].join(' ')
    });

    return $('<div/>', {
        addClass: 'video-list-item'
    }).append([imageZone, textZone, dateZone]).on('click', function (e) {
        e.preventDefault();
        youtube.openVideo(i.resourceId.videoId, function (){});
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