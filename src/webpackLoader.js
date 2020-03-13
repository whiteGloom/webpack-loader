import webpack from 'webpack';

import defaults from './defaults/defaults';
import models from './models/models';
import helper from './helper/helper';


class WebpackLoader {
  constructor() {
    this.defaults = defaults;
    this.models = models;
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };

    this.makeNewConfig(this.defaults.ids.watchConfigId, {}, ['isService']);
    this.makeNewConfig(this.defaults.ids.devServerConfigId, {}, ['isService']);
  }

  makeNewConfig(id, options, serviceOptions) {
    const { isForced = false, isSilent = false, isService } = helper.flagsToObj(serviceOptions);
    options = helper.isObj(options) ? options : {};

    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`makeNewConfig: Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (this._isUsed(id) && (isService || !isForced)) {
      if (!isSilent) console.error(`makeNewConfig: ID is already in use: ${id}`);
      return;
    }

    const Class = this.models.getModel(isService);
    const tree = this._selectConfigsTree(isService);
    tree[id] = new Class({ ...defaults.getPreset(id, isService), ...options });
    return tree[id];
  }

  addToConfig(id, configs, serviceOptions) {
    const { isService = false, isForced = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`addToConfig: Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!helper.isArr(configs) && !helper.isObj(configs)) {
      if (!isSilent) console.error(`addToConfig: Wrong type of configs: ${typeof configs}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (isService || !isForced) {
        if (!isSilent) console.error(`addToConfig: There is no config with such ID: ${id}`);
        return;
      }

      this.makeNewConfig(id, { configs }, serviceOptions);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].addToConfig(configs);
  }

  getConfig(id, serviceOptions) {
    const { isService = false, isSilent = false } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`getConfig: Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`getConfig: There is no config with such ID: ${id}`);
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
      if (!isSilent) console.error(`resetConfig: Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].resetToDefaults();
  }

  removeConfig(id, serviceOptions) {
    const { isSilent = false, isService } = helper.flagsToObj(serviceOptions);
    if (!helper.isNumber(id) && !helper.isString(id)) {
      if (!isSilent) console.error(`removeConfig: Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`removeConfig: There is no config with such ID: ${id}`);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    delete tree[id];
  }

  removeAllConfigs() {
    const simpleTree = this._selectConfigsTree();
    Object.keys(simpleTree).forEach((id) => {
      delete simpleTree[id];
    });
  }

  start(configs, serviceConfigs, options) {
    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs && serviceConfigs.length) {
      const serviceTree = this._selectConfigsTree(true);
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string' && serviceTree[config]) {
          serviceTree[config].start(webpackConfigured, options);
        } else if (config instanceof this.models.getModel(true)) {
          config.start(webpackConfigured, options);
        }
      });
    } else {
      webpackConfigured.run(this.defaults.handlers.getNativeHandler(options));
    }
  }

  stop(options) {
    const serviceTree = this._selectConfigsTree(true);
    Object.values(serviceTree).forEach((config) => {
      if (config.handler) config.stop(options);
    });
  }

  getDefaults() {
    return this.defaults;
  }

  getModels() {
    return this.models;
  }

  _buildConfigs(configs) {
    const simpleTree = this._selectConfigsTree();
    let results = [];

    if (!configs) {
      results = Object.values(simpleTree).map((config) => config.config);
    } else {
      configs = helper.toArr(configs);
      configs.forEach((config) => {
        if (typeof config === 'string' && simpleTree[config]) {
          results.push(simpleTree[config].config);
        } else if (config instanceof this.models.getModel(false)) {
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
