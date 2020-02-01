import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import Defaults from './Defaults/Defaults';
import ServiceConfig from './Models/ServiceConfig';
import Config from './Models/Config';
import Helper from './Helper/Helper';


class WebpackLoader {
  constructor() {
    this.defaults = Defaults;
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {},
    };

    this._init();
  }

  makeNewConfig(id, configs, mode, isForced = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      return console.error(`Wrong type of ID ${id}: ${typeof id}`);
    }

    if (!isForced && this._isUsed(id)) {
      return console.error(`ID is already in use: ${id}`);
    }

    this.configs.simpleConfigs[id] = new Config({ mode, configs });
    return this.configs.simpleConfigs[id];
  }

  addToConfig(id, configs, isService = false, isForced = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      return console.error(`Wrong type of ID ${id}: ${typeof id}`);
    }

    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      return console.error(`Wrong type of configs: ${typeof configs}`);
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !isForced) {
        return console.error(`There is no config with such ID: ${id}`);
      }

      this.makeNewConfig(id);
    }

    configs = Helper.toArr(configs);

    const configsTree = this._selectConfsTree(isService);
    configsTree[id].addToConfig(configs);
  }

  run({ configs, serviceConfigs, options }) {
    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs && serviceConfigs.length) {
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string' && this.configs.serviceConfigs[config]) {
          this.configs.serviceConfigs[config].start(options);
        } else if (typeof config === 'object') {
          config.start(options);
        }
      });
    } else {
      webpackConfigured.run(Helper.getNativeHandler.bind(options.callback));
    }
  }

  stop(options) {
    Object.keys(this.serviceConfigs).forEach((config) => {
      if (config.handler) config.stop(options);
    });
  }

  getConfig(id, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      return console.error(`Wrong type of identificator ${id}: ${typeof id}`);
    }

    if (!this._isUsed(id)) {
      return console.error(`There is no config with such ID: ${id}`);
    }

    const configsTree = this._selectConfsTree(isService);
    return configsTree(isService)[id];
  }

  getConfigs() {
    return this.configs;
  }

  resetConfig(id, mode, isService = false) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      return console.error(`Wrong type of identificator ${id}: ${typeof id}`);
    }

    const configsTree = this._selectConfsTree(isService);
    configsTree[id].resetToDefaults();
  }

  removeConfig(id) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      return console.error(`Wrong type of identificator ${id}: ${typeof id}`);
    }

    if (!this._isUsed(id)) {
      return console.error(`There is no config with such ID: ${id}`);
    }

    delete this.configs.simpleConfigs[id];
  }

  _init() {
    this.configs.serviceConfigs[this.defaults.watchConfigName] = new ServiceConfig({
      defaults: () => ({}),
      start: (conf, { port, configured, callback }) => {
        function devServerHandler(err) {
          if (!err) {
            console.log(`\n\nServer opened on http://localhost:${port}\n\n`);
          } else {
            console.error(err);
            console.log('\n\nDevServer has errors!\n\n');
          }
          if (typeof callback === 'function') callback(err);
        }
        conf.handler = new WebpackDevServer(configured, conf.config);
        conf.handler.listen(port, '127.0.0.1', devServerHandler);
      },
      stop: (conf, { callback }) => {
        if (typeof callback !== 'function') callback = () => {};
        conf.handler.stop(callback);
        conf.handler = null;
      },
    });
    this.configs.serviceConfigs[this.defaults.devServerConfigName] = new ServiceConfig({
      defaults: () => ({}),
      start: (conf, { configured, callback }) => {
        conf.handler = configured.watch(conf.config, Helper.getNativeHandler.bind(callback));
      },
      stop: (conf, { callback }) => {
        if (typeof callback !== 'function') callback = () => {};
        conf.handler.close(callback);
        conf.handler = null;
      },
    });
  }

  _buildConfigs(configs) {
    if (configs) configs = Helper.toArr(configs);
    let results = [];

    if (!configs) {
      results = Object.values(this.configs.simpleConfigs).map((config) => config.config);
    } else {
      configs.forEach((config) => {
        if (typeof config === 'string' && this.configs.simpleConfigs[config]) {
          results.push(this.configs.simpleConfigs[config].config);
        } else if (config instanceof Config) {
          results.push(config.config);
        } else if (typeof config === 'object') {
          results.push(config);
        }
      });
    }
    return results.length > 1 ? results : results[0];
  }

  _isUsed(id, isService = false) {
    return !!this._selectConfsTree(isService)[id];
  }

  _selectConfsTree(isService) {
    return !isService ? this.configs.simpleConfigs : this.configs.serviceConfigs;
  }
}

export default WebpackLoader;
