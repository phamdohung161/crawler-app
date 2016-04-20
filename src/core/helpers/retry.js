'use strict';

const Promise = require('bluebird');

let retry = function (maxTimes, fn) {
    return fn().catch(err => {
        if (maxTimes <= 1) {
            return Promise.reject(err);
        }
        return retry(maxTimes - 1, fn);
    })
};

module.exports = retry;