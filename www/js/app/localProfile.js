module.exports = {
    set: set,
    setup: setup,
    get: get
};

var storeKey = "LocalProfileSetting";

function set () {
    var string = JSON.stringify({
        firstName: $('#profile-first-name').val(),
        lastName: $('#profile-last-name').val(),
        organization: $('#profile-organization-name').val(),
        email:  $('#profile-contact-email').val(),
        press: $('#profile-press-checkbox').is(":checked")
    });
    console.log(string)
    if (window !== undefined && window.localStorage !== undefined) {
        window.localStorage.setItem(storeKey, string);
    }
}

function setup () {
    var o = get() || {};
    $('#profile-first-name').val(o.firstName || "");
    $('#profile-last-name').val(o.lastName || "");
    $('#profile-organization-name').val(o.organization || "");
    $('#profile-contact-email').val(o.email || "");
    $('#profile-press-checkbox').val(!!o.press);
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