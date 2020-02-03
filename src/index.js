import webpack from 'webpack';

import Defaults from './Defaults/Defaults';
import ServiceConfig from './Models/ServiceConfig';
import Config from './Models/Config';
import helper from './helper/helper';


class WebpackLoader {
  constructor() {
    this.defaults = Defaults;
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {},
    };

    this._init();
  }

  makeNewConfig(id, configs, options, serviceOptions) {
    const { isForced = false } = serviceOptions;
    if (!helper.isNumber(id) && !helper.isString(id)) {
      return console.error(`Wrong type of ID ${id}: ${typeof id}`);
    }

    if (!isForced && this._isUsed(id)) {
      return console.error(`ID is already in use: ${id}`);
    }

    this.configs.simpleConfigs[id] = new Config(null, configs, options);
    return this.configs.simpleConfigs[id];
  }

  addToConfig(id, configs, serviceOptions) {
    const { isService = false, isForced = false } = serviceOptions;
    if (!helper.isNumber(id) && !helper.isString(id)) {
      return console.error(`Wrong type of ID ${id}: ${typeof id}`);
    }

    if (!helper.isArr(configs) && !helper.isObj(configs)) {
      return console.error(`Wrong type of configs: ${typeof configs}`);
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !isForced) {
        return console.error(`There is no config with such ID: ${id}`);
      }

      this.makeNewConfig(id);
    }

    const configsTree = this._selectConfsTree(isService);
    configsTree[id].addToConfig(configs);
  }

  run(configs, serviceConfigs, options) {
    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs && serviceConfigs.length) {
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string' && this.configs.serviceConfigs[config]) {
          this.configs.serviceConfigs[config].start(webpackConfigured, options);
        } else if (typeof config === 'object') {
          config.start(webpackConfigured, options);
        }
      });
    } else {
      webpackConfigured.run(helper.getNativeHandler(options));
    }
  }

  stop(options) {
    Object.values(this.serviceConfigs).forEach((config) => {
      if (config.handler) config.stop(options);
    });
  }

  getConfig(id, serviceOptions) {
    const { isService = false } = serviceOptions;
    if (!helper.isNumber(id) && !helper.isString(id)) {
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

  resetConfig(id, options, serviceOptions) {
    const { isService = false } = serviceOptions;
    if (!helper.isNumber(id) && !helper.isString(id)) {
      return console.error(`Wrong type of identificator ${id}: ${typeof id}`);
    }

    const configsTree = this._selectConfsTree(isService);
    configsTree[id].resetToDefaults(options);
  }

  removeConfig(id) {
    if (!helper.isNumber(id) && !helper.isString(id)) {
      return console.error(`Wrong type of identificator ${id}: ${typeof id}`);
    }

    if (!this._isUsed(id)) {
      return console.error(`There is no config with such ID: ${id}`);
    }

    delete this.configs.simpleConfigs[id];
  }

  _init() {
    const makeServConf = (name, config) => {
      this.configs.serviceConfigs[name] = new ServiceConfig(config);
    };
    makeServConf(this.defaults.watchConfigName, this.defaults.getWatchServicePreset());
    makeServConf(this.defaults.devServerConfigName, this.defaults.getDevServerServicePreset());
  }

  _buildConfigs(configs) {
    if (configs) configs = helper.toArr(configs);
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

  _selectConfsTree(isService = false) {
    return !isService ? this.configs.simpleConfigs : this.configs.serviceConfigs;
  }
}

export default WebpackLoader;
