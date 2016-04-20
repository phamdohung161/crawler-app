'use strict';

const logger      = require('../../core/logger'),
      config      = require('../../core/config'),
      CrawlerBase = require('../../core/crawler/base/crawler-base');

class RSSCrawler extends CrawlerBase {
    constructor() {
        super();
    }

    start() {
        logger.info('Starting crawl ...');
        return Promise.resolve('Done!');
    }
}

module.exports = RSSCrawler;