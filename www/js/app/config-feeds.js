var toLocal = require('./ui/getLocalizedString')
    , localStrings = require('./ui/localizedStrings');

var menus = [{
    title: 'Featured'
    , feeds: [{
        url: 'http://carnegieendowment.org/rss/solr/?fa=AppEventsGlobalJson'
        //url: 'http://dmvjs.com/carnegie-events/fake.json'
        //url: 'http://dmvjs.com/carnegie-events/fake-empty.json'
        , name: toLocal(localStrings.events)
        , filename: 'global-events-en.json'
        , type: 'json'
        , required: true
        , language: 'en'
    }]
}];

module.exports = menus;