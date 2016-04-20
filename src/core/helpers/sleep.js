'use strict';

const logger = require('../logger');

module.exports = function (sleepDuration) {
    logger.info('Sleep: ' + sleepDuration);
    let now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
    }
};