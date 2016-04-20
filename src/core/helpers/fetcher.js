'use strict';

const request = require('request'),
      Promise = require('bluebird'),
      logger  = require('../logger'),
      config  = require('../config'),
      retry   = require('../helpers/retry');

module.exports = {
    _get: function (url) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                headers: {
                    method: 'GET',
                    'User-Agent': config.request.userAgent
                }
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(response.statusCode);
                    }
                }
            });
        });
    },

    get: function (url) {
        return new Promise((resolve, reject) => {
            logger.info('Fetching: ' + url);
            retry(3, () => {
                return this._get(url);
            }).then(data => {
                logger.info('Fetch OK: ' + url);
                resolve(data);
            }).catch(err => {
                logger.info('Fetch Failed: ' + url);
                reject(err);
            })
        })
    }
};