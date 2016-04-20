'use strict';

const _       = require('lodash'),
      winston = require('winston'),
      moment  = require('moment');

class IMSLogger {
    constructor() {
        this.logger = null;
    }

    init(logConfig) {
        let transports = [],
            config     = require('../config');

        if (!logConfig) {
            logConfig = config.log;
        }

        if (!_.isEmpty(logConfig)) {
            if (logConfig.console && logConfig.console.enable) {
                transports.push(
                    new winston.transports.Console({
                        name: 'console',
                        level: logConfig.console.level || 'info',
                        colorize: true,
                        timestamp: function () {
                            return moment().format('YYYY/MM/DD hh:mm:ss');
                        }
                    })
                );
            }

            if (logConfig.file && logConfig.file.enable) {
                let fileName = config.namespace + '-' + moment().format('YYYY-MM-DD');

                transports.push(
                    new winston.transports.File({
                        name: 'file',
                        level: logConfig.file.level || 'error',
                        colorize: true,
                        timestamp: function () {
                            return moment().format('YYYY/mm/DD hh:mm:ss');
                        },
                        filename: logConfig.file.fileName || 'logs/' + fileName + '.log'
                    })
                );
            }

            this.logger = new (winston.Logger)({
                transports: transports,
                exitOnError: false
            });
        }

        return Promise.resolve();
    }

    error() {
        let errors = [];

        _.each(arguments, function (error) {
            if (_.isObject(error) && error.stack) {
                errors.push(error.stack);
            } else {
                errors.push(error);
            }
        });

        if (this.logger) {
            this.logger.error.apply(this.logger, errors);
        } else {
            console.error.apply(null, errors);
        }
    }

    warn() {
        if (this.logger) {
            this.logger.warn.apply(this.logger, arguments);
        } else {
            console.warn.apply(null, arguments);
        }
    }

    info() {
        if (this.logger) {
            this.logger.info.apply(this.logger, arguments);
        } else {
            console.info.apply(null, arguments);
        }
    }

    verbose() {
        if (this.logger) {
            this.logger.verbose.apply(this.logger, arguments);
        } else {
            console.log.apply(null, arguments);
        }
    }

    debug() {
        if (this.logger) {
            this.logger.debug.apply(this.logger, arguments);
        } else {
            console.info.apply(null, arguments);
        }
    }

    silly() {
        if (this.logger) {
            this.logger.silly.apply(this.logger, arguments);
        } else {
            console.log.apply(null, arguments);
        }
    }

    trace() {
        if (this.logger) {
            this.logger.silly.apply(this.logger, arguments);
        } else {
            console.trace.apply(null, arguments);
        }
    }

    log() {
        if (this.logger) {
            this.logger.log.apply(this.logger, arguments);
        } else {
            console.log.apply(null, arguments);
        }
    }
}

module.exports = new IMSLogger();
