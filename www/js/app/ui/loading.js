function hide (){
    setTimeout(function () {
        $('.loading-ui').fadeOut();
    }, 100);
}

function show (){
    setTimeout(function () {
        $('.loading-ui').fadeIn();
    }, 1);

    setTimeout(function () {
        $('.loading-ui').fadeOut(1000);
    }, 15000);
}

module.exports = {
    hide: hide,
    show: show
};