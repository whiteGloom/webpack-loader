import webpack from 'webpack';

import Models from '../service/Models';
import Defaults from '../service/Defaults';
import Helper from '../helpers/Helper';

class WebpackLoader {
  constructor() {
    this.defaults = new Defaults();
    this.models = new Models();
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
  }

  init() {
    this._initDefaultConfigs();
  }

  makeNewConfig(options = {}, serviceOptions) {
    const { isForced = false, isSilent = false, isService = false } = Helper.flagsToObj(serviceOptions);
    const { id, configs: userConfigs, preset: userPreset } = options;

    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      if (!isSilent) console.error(`makeNewConfig: Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (this._isUsed(id, isService) && !isForced) {
      if (!isSilent) console.error(`makeNewConfig: ID is already in use: ${id}`);
      return;
    }

    const ConfigClass = this.models.getModel(isService);
    const tree = this._selectConfigsTree(isService);
    const preset = userPreset || this.defaults.getPreset(id, isService);

    tree[id] = new ConfigClass({ ...preset, ...userConfigs });
    return tree[id];
  }

  addToConfig(options = {}, serviceOptions) {
    const { isService = false, isForced = false, isSilent = false } = Helper.flagsToObj(serviceOptions);
    const { id, configs: userConfigs } = options;

    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      if (!isSilent) console.error(`addToConfig: Wrong type of ID ${id}: ${typeof id}`);
      return;
    }

    if (!userConfigs) {
      if (!isSilent) console.error('addToConfig: No configs passed');
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isForced) {
        if (!isSilent) console.error(`addToConfig: There is no config with such ID: ${id}`);
        return;
      }

      this.makeNewConfig(options, serviceOptions);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].addToConfig(userConfigs);
  }

  getConfig(id, serviceOptions) {
    const { isService = false, isSilent = false } = Helper.flagsToObj(serviceOptions);

    if (!Helper.isNumber(id) && !Helper.isString(id)) {
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

  getConfigs(isService = false) {
    if (isService) {
      return this.configs.serviceConfigs;
    }

    return this.configs.simpleConfigs;
  }

  resetConfig(id, serviceOptions) {
    const { isService = false, isSilent = false } = Helper.flagsToObj(serviceOptions);

    if (!Helper.isNumber(id) && !Helper.isString(id)) {
      if (!isSilent) console.error(`resetConfig: Wrong type of identifier ${id}: ${typeof id}`);
      return;
    }

    const tree = this._selectConfigsTree(isService);
    tree[id].resetToDefaults();
  }

  removeConfig(id, serviceOptions) {
    const { isSilent = false, isService = false } = Helper.flagsToObj(serviceOptions);

    if (!Helper.isNumber(id) && !Helper.isString(id)) {
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
      serviceConfigs.forEach((config) => {
        const savedConfig = this.getConfig(config, ['isService', 'isSilent']);

        if (typeof config === 'string' && savedConfig) {
          savedConfig.start(webpackConfigured, options);
        } else if (config instanceof this.models.getModel(true)) {
          config.start(webpackConfigured, options);
        }
      });
    } else {
      webpackConfigured.run(this.defaults.getHandler());
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
      configs = Helper.toArr(configs);
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

  _initDefaultConfigs() {
    const defaultConfigs = this.defaults.getDefaultConfigs();

    defaultConfigs.forEach((config) => {
      const { id, isService, additionalConfigs } = config;
      this.makeNewConfig(
        { id, configs: additionalConfigs },
        { isService, isSilent: true }
      );
    });
  }
}

export default WebpackLoader;
