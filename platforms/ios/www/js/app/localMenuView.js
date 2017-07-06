module.exports = {
    isMySchedule: isMySchedule
    , set: set
};

// there are two states, all and my

var storeKey = "LocalMenuViewSetting";

// string id adds event to calendar
function isMySchedule () {
    var o = get();
    if (o !== undefined && o!== null && o.isMySchedule !== undefined) {
        return o.isMySchedule;
    }
    return false;
}

function set (isMySchedule) {
    var isMine = !!isMySchedule;
    var o = {
        isMySchedule: isMine
    };
    if (window !== undefined && window.localStorage !== undefined) {
        window.localStorage.setItem(storeKey, JSON.stringify(o));
    }
}

// get local stored hash of status object
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