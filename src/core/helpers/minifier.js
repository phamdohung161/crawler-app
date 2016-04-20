'use strict';

const minify = require('html-minifier').minify,
      _      = require('lodash');

module.exports = {
    js: function (str, options) {

    },
    html: function (str, options) {
        options = options || {};
        return minify(str, _.merge({
            collapseWhitespace: true
        }, options));
    }
};