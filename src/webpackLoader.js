import webpack from 'webpack';

import defaults from './defaults/defaults';
import ServiceConfig from './Models/ServiceConfig';
import Config from './Models/Config';
import helper from './helper/helper';


class WebpackLoader {
  constructor() {
    this.defaults = defaults;
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };

    this._init();
  }

  makeNewConfig(id, configs, serviceOptions) {
    const { isForced = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!isForced && this._isUsed(id)) {
      if (!isSilent) console.error(`ID is already in use: ${id}`);
      return;
    }

    const simpleTree = this._selectConfigsTree();

    simpleTree[id] = new Config({
      getDefaults: this.defaults.getSimpleConfigDefaults(),
      configs
    });
    return simpleTree[id];
  }

  addToConfig(id, configs, serviceOptions) {
    const { isService = false, isForced = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!helper.isArr(configs) && !helper.isObj(configs)) {
      if (!isSilent) console.error(`Wrong type of configs: ${typeof configs}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !isForced) {
        if (!isSilent) console.error(`There is no config with such ID: ${id}`);
        return;
      }

      this.makeNewConfig(id);
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].addToConfig(configs);
  }

  run(configs, serviceConfigs, options) {
    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs && serviceConfigs.length) {
      const serviceTree = this._selectConfigsTree(true);
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string' && serviceTree[config]) {
          serviceTree[config].start(webpackConfigured, options);
        } else if (typeof config === 'object') {
          config.start(webpackConfigured, options);
        }
      });
    } else {
      webpackConfigured.run(this.defaults.getNativeHandler(options));
    }
  }

  stop(options) {
    const serviceTree = this._selectConfigsTree(true);
    Object.values(serviceTree).forEach((config) => {
      if (config.handler) config.stop(options);
    });
  }

  getConfig(id, serviceOptions) {
    const { isService = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`There is no config with such ID: ${id}`);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    return tree[id];
  }

  getConfigs() {
    return this.configs;
  }

  resetConfig(id, serviceOptions) {
    const { isService = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].resetToDefaults();
  }

  removeConfig(id, serviceOptions) {
    const { isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id)) {
      if (!isSilent) console.error(`There is no config with such ID: ${id}`);
      return;
    }

    const simpleTree = this._selectConfigsTree();

    delete simpleTree[id];
  }

  removeAllConfigs() {
    const simpleTree = this._selectConfigsTree();
    Object.keys(simpleTree).forEach((id) => {
      delete simpleTree[id];
    });
  }

  _init() {
    const serviceTree = this._selectConfigsTree(true);
    const makeServiceConf = (id, preset) => {
      serviceTree[id] = new ServiceConfig(preset);
    };
    makeServiceConf(this.defaults.watchConfigId, this.defaults.getWatchServicePreset());
    makeServiceConf(this.defaults.devServerConfigId, this.defaults.getDevServerServicePreset());
  }

  _buildConfigs(configs) {
    const simpleTree = this._selectConfigsTree();
    if (configs) configs = helper.toArr(configs);
    let results = [];

    if (!configs) {
      results = Object.values(simpleTree).map((config) => config.config);
    } else {
      configs.forEach((config) => {
        if (typeof config === 'string' && simpleTree[config]) {
          results.push(simpleTree[config].config);
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
    return !!this._selectConfigsTree(isService)[id];
  }

  _selectConfigsTree(isService = false) {
    return !isService ? this.configs.simpleConfigs : this.configs.serviceConfigs;
  }
}

export default WebpackLoader;
