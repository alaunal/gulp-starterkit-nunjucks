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
        "title": "GULP Boilerplate Nunjucks | akcode",
        "metaDesc": "A HTML templates using gulp and Nunjucks - support dynamic import with rollup JS"
    }
};

module.exports = {
    data: DATA
};
