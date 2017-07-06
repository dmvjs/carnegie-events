var toLocal = require('./ui/getLocalizedString')
    , localStrings = require('./ui/localizedStrings')
    , getKey = require('./ui/getKeyForLanguageOrLocalCenter');

var links = {
    "ar": [{
        url: 'http://carnegie-mec.org/diwan/?lang=en'
        , name: toLocal(localStrings.diwan)
    }, {
        url: 'http://carnegieendowment.org/sada/?lang=ar'
        , name: 'صدى'
    }]
    , "en": [{
        url: 'http://carnegie-mec.org/diwan/?lang=en'
        , name: 'Diwan'
    }, {
        url: 'http://carnegieendowment.org/sada/'
        , name: 'Sada'
    }, {
        url: 'http://carnegieeurope.eu/strategiceurope/'
        , name: 'Strategic Europe'
    }]
    , "ru": [{
        url: 'http://carnegie.ru/commentary/'
        , name: 'Редакторы'
    }]
    , "moscow": [{
        url: 'http://carnegie.ru/commentary/?lang=en'
        , name: 'Commentary'
    }]
    , "beijing": [{
        url: 'http://carnegietsinghua.org/publications/?fa=podcasts'
        , name: 'Podcasts'
    }]
    , "beirut": [{
        url: 'http://carnegie-mec.org/diwan/?lang=en'
        , name: 'Diwan'
    }, {
        url: 'http://carnegieendowment.org/sada/'
        , name: 'Sada'
    }]
    , "brussels": [{
        url: 'http://carnegieeurope.eu/strategiceurope/'
        , name: 'Strategic Europe'
    }]
};

var base = [{
    title: toLocal(localStrings.blogs)
    , links: void 0
}];

function getBlogs (key) {
    if (links[key] !== undefined) {
        var blogs = base;
        blogs[0].links = links[key];
        return blogs;
    }
    return void 0
}

module.exports = getBlogs(getKey());