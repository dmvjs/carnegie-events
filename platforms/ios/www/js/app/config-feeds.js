var toLocal = require('./ui/getLocalizedString')
    , localStrings = require('./ui/localizedStrings');

var menus = [{
    title: 'Featured'
    , feeds: [{
        url: 'http://carnegieendowment.org/rss/solr/?fa=AppEventsGlobalJson'
        , name: toLocal(localStrings.events)
        , filename: 'global-events-en.json'
        , type: 'json'
        , required: true
        , language: 'en'
    }]
}];

module.exports = menus;