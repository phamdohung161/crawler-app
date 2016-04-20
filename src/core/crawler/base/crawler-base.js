'use strict';

const config  = require('../../config'),
      Promise = require('bluebird');

class CrawlerBase {
    constructor() {
        if(config.database.enable){
            this._database = this.initDatabase();
        }
    }

    init() {
        return Promise.reject('You must override "init" method!');
    }

    getDatabase() {
        return this._database;
    }

    initDatabase() {
        let Database,
            dbConfig = config.database;

        Database = this.getDBClass(dbConfig);

        if (Database) {
            return new Database(dbConfig);
        } else {
            return null;
        }
    }

    getDBClass(dbConfig) {
        let Database;
        switch (dbConfig.type) {
            case 'sqlite':
                Database = require('../../database/sqlite');
                break;
            default:
                break;
        }

        return Database;
    }
}

module.exports = CrawlerBase;