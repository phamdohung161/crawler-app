'use strict';

const path    = require('path'),
      Promise = require('bluebird'),
      _       = require('lodash'),
      fs      = require('fs'),
      assert  = require('assert-plus'),
      logger  = require('../logger');

let rootPath = path.resolve(__dirname, '../../../'),
    srcPath  = path.resolve(__dirname, '../../'),
    defaultConfigPath;

defaultConfigPath = path.join(rootPath, 'config');

class ConfigManager {
    constructor(config) {

        this._config = {};

        if (config && _.isObject(config)) {
            this.set(config);
        }
    }

    init() {
        return this.load();
    }

    load(configFilePath) {
        this._config.paths.config = configFilePath || defaultConfigPath;

        let configPath = this._config.paths.configPath,
            commonConfig;

        return this.readConfig(path.join(configPath, 'config.json')).then(config => {
            return config;
        }).then(config => {
            assert.string(config.namespace, 'config.namespace');
            commonConfig = config;

            return this.readConfig(path.join(configPath, config.namespace, 'config.json'));
        }).then(extConfig => {
            this.set(_.merge({}, commonConfig, extConfig));
            return Promise.resolve();
        });
    }

    get() {
        return this._config;
    }

    set(config) {
        this._config.paths = this._config.paths || {};

        //merge with new config
        _.merge(this._config, config, {
            paths: {
                configPath: path.join(rootPath, 'config'),
                rootPath: rootPath,
                corePath: path.join(srcPath, 'core'),
                crawlerPath: path.join(srcPath, 'modules'),
                logPath: path.join(rootPath, 'logs'),
                databasePath: path.join(rootPath, 'database')
            }
        });

        //merge global
        _.merge(this, this._config);
    }

    readConfig(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                try {
                    resolve(JSON.parse(data));
                } catch (ex) {
                    reject(ex);
                }
            });
        })
    }
}

module.exports = new ConfigManager({});
