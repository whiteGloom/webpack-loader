import webpack from 'webpack';

import Helper from './Helper';
import Models from './service/Models';
import Defaults from './service/Defaults';

class WebpackLoader {
  constructor() {
    this._defaults = new Defaults();
    this._models = new Models();
    this._configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
  }

  init() {
    this._initDefaultConfigs();
  }

  makeNewConfig(options = {}, serviceOptions) {
    const { isService = false, isForced = false, isSilent = false } = Helper.flagsToObj(serviceOptions);
    const { id, configs: userConfigs, preset: userPreset } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
      return;
    }

    if (this._isUsed(id, isService) && !isForced) {
      if (!isSilent) console.error(`makeNewConfig: That ID is already in use: ${id}`);
      return;
    }

    const ConfigModel = this._models.getModel(isService);
    const branch = this._selectConfigsBranch(isService);
    const preset = userPreset || this._defaults.getPreset(id, isService);

    branch[id] = new ConfigModel({ ...preset, ...{ configs: userConfigs } });
    return branch[id];
  }

  addToConfig(options = {}, serviceOptions) {
    const { isService = false, isForced = false, isSilent = false } = Helper.flagsToObj(serviceOptions);
    const { id, configs: userConfigs } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
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

    this.getConfig({ id }, { isService }).addToConfig(userConfigs);
  }

  getConfig(options, serviceOptions) {
    const { isService = false, isSilent = false } = Helper.flagsToObj(serviceOptions);
    const { id } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`getConfig: There is no config with such ID: ${id}`);
      return;
    }

    return this._selectConfigsBranch(isService)[id];
  }

  getConfigs(serviceOptions) {
    const { isService = false } = Helper.flagsToObj(serviceOptions);

    return this._selectConfigsBranch(isService);
  }

  resetConfig(options, serviceOptions) {
    const { isService = false, isSilent = false } = Helper.flagsToObj(serviceOptions);
    const { id } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
      return;
    }

    this._selectConfigsBranch(isService)[id].resetToDefaults();
  }

  removeConfig(options, serviceOptions) {
    const { isSilent = false, isService = false } = Helper.flagsToObj(serviceOptions);
    const { id } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`removeConfig: There is no config with such ID: ${id}`);
      return;
    }

    delete this._selectConfigsBranch(isService)[id];
  }

  removeConfigs() {
    this._configs.simpleConfigs = {};
    this._configs.serviceConfigs = {};
  }

  start(options = {}) {
    const { configs, serviceConfigs, startOptions } = options;

    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs) {
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string') {
          config = this.getConfig({ id: config }, { isService: true });
        }
        config.start(webpackConfigured, startOptions);
      });
    } else {
      webpackConfigured.run(this._defaults.getHandler());
    }
  }

  stop(options) {
    const serviceTree = this._selectConfigsBranch(true);

    Object.values(serviceTree).forEach((config) => {
      if (config.isRunning) config.stop(options);
    });
  }

  getDefaults() {
    return this._defaults;
  }

  getModels() {
    return this._models;
  }

  _buildConfigs(configs) {
    const simpleBranch = this._selectConfigsBranch();
    let results = [];

    if (!configs) {
      results = Object.values(simpleBranch).map((config) => config.config);
    } else {
      Helper.toArr(configs).forEach((config) => {
        if (typeof config === 'string' && simpleBranch[config]) {
          results.push(simpleBranch[config].config);
        } else if (config instanceof this._models.getModel(false)) {
          results.push(config.config);
        } else if (config instanceof Object) {
          results.push(config);
        }
      });
    }
    return results.length > 1 ? results : results[0];
  }

  _isUsed(id, isService = false) {
    return !!this._selectConfigsBranch(isService)[id];
  }

  _selectConfigsBranch(isService = false) {
    return isService ? this._configs.serviceConfigs : this._configs.simpleConfigs;
  }

  _initDefaultConfigs() {
    const defaultConfigs = this._defaults.getDefaultConfigs();

    defaultConfigs.forEach((config) => {
      const { id, isService, additionalConfigs } = config;
      this.makeNewConfig(
        { id, configs: additionalConfigs },
        { isService, isSilent: true }
      );
    });
  }

  static _validateId(id) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) return false;

    if (Helper.isString(id) && id.length < 1) return false;

    return true;
  }
}

export default WebpackLoader;
