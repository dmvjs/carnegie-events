module.exports = {
    add: add
    , has: has
    , remove: remove
};

var storeKey = "LocalRegister";

// string id adds event to register
function add (id) {
    var o = get() || {};
    o[id] = 1;
    if (window !== undefined && window.localStorage !== undefined) {
        window.localStorage.setItem(storeKey, JSON.stringify(o));
    }
}

// string id returns true if exists
function has (id) {
    var o = get() || {};
    return o[id] === 1;
}


// string id removes event from register
function remove (id) {
    var o = get() || {};
    if (has(id)) {
        delete o[id];
    }
    if (window !== undefined && window.localStorage !== undefined) {
        window.localStorage.setItem(storeKey, JSON.stringify(o));
    }
}

// get local stored hash of events
function get () {
    if (window !== undefined && window.localStorage !== undefined) {
        var dict = window.localStorage.getItem(storeKey);
        var parsed = false;
        if (dict != null) {
            try {
                dict = JSON.parse(dict);
                parsed = true;
            } catch (e) {
                dict = null;
                window.localStorage.removeItem(storeKey);
            }
        }
        if (parsed == true) {
            return dict;
        }
        return null;
    }
}