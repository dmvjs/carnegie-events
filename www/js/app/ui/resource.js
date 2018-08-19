function showResource () {
    $('section.resource').animate({
        top: ($('body').hasClass('tablet') ? '88' : '44') + 'px'
    });
}

function hideResource () {
    $('section.resource').animate({
        top: '100%'
    });
}

module.exports = {hideResource: hideResource, showResource: showResource};