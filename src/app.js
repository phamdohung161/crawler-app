'use strict';

const fs      = require('fs'),
      path    = require('path'),
      _       = require('lodash'),
      Promise = require('bluebird'),
      logger  = require('./core/logger'),
      config  = require('./core/config');

class App {
    constructor() {

    }

    start() {
        Promise.resolve().then(() => {
            return this._createFolder();
        }).then(() => {
            return config.init();
        }).then(() => {
            return logger.init();
        }).then(() => {
            let namespace = config.namespace,
                Crawler   = require(path.join(config.paths.crawlerPath, namespace)),
                crawler;

            crawler = new Crawler();

            return crawler.start();
        }).then(message => {
            logger.info(message);
        }).catch(err => {
            logger.error(err);
            logger.info('Can not start the Application!');
        });
    }

    _createFolder() {
        return new Promise((resolve, reject) => {
            let folders = [
                path.join(config.paths.rootPath, 'logs'),
                path.join(config.paths.rootPath, 'database')
            ], error    = false;

            _.each(folders, function (folderPath) {
                try {
                    fs.mkdirSync(folderPath);
                } catch (ex) {
                    if (ex.code != 'EEXIST') {
                        error = ex;
                        logger.error(ex);
                        return false;
                    }
                }
            });

            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    }
}

module.exports = App;