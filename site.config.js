const makeId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const DATA = {
    "base": {
        "static": "static/",
        "revid": makeId(8),
        "title": "GULP TEMPLATEING | gojek site",
        "metaDescript": ""
    }
};

module.exports = {
    data: DATA
};