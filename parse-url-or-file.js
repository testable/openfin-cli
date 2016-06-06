var URL_PATTERN = /^\s*(https?|file):\/\//i,
    path = require('path');
 
module.exports = function(flag) {
    switch (true) {
        case URL_PATTERN.test(flag):
            return flag;
        case flag && path.isAbsolute(flag):
            return 'file://' + flag;
        default:
            return 'file://' + process.cwd() + '/' + flag;
    }
};
