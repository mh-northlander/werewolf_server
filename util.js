// util funcs

// randomString: generate random string of [a-z0-9] with given length
module.exports.randomString = function(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};
