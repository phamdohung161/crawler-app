'use strict';

const assert    = require('assert-plus'),
      fs        = require('fs'),
      path      = require('path'),
      Sequelize = require('sequelize'),
      config    = require('../config'),
      logger    = require('../logger');

class SQLite {
    constructor(options) {
        this._options   = options || {};
        this._sequelize = this.init({
            name: options.name,
            username: options.username,
            password: options.password,
            path: path.join(config.paths.rootPath, options.path),
            log: options.log
        });
        this._models    = this.loadModels(path.join(config.paths.crawlerPath, config.namespace, 'models'));
    }

    getModels() {
        return this._models;
    }

    getModel(modelName) {
        return this._models[modelName];
    }

    init(opts) {
        let options = opts || this._options;
        return new Sequelize(
            options.name,
            options.username,
            options.password, {
                dialect: 'sqlite',
                storage: options.path,
                logging: options.log
            });
    }

    getConnection() {
        return this._sequelize;
    }

    loadModels(modelPath) {
        logger.info('Load Models ...');

        let models     = {},
            connection = this.getConnection();

        fs.readdirSync(modelPath).filter((file) => {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        }).forEach(function (file) {
            let model = connection.import(path.join(modelPath, file));

            models[model.name] = model;
        });
        return models;
    }
}

module.exports = SQLite;