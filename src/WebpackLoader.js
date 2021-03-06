import webpack from 'webpack';

import Helper from './Helper';
import Defaults from './service/Defaults';
import Config from './models/Config';
import ServiceConfig from './models/ServiceConfig';

class WebpackLoader {
  constructor() {
    this._defaults = new Defaults();
    this._configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
    this._models = {
      Simple: Config,
      Service: ServiceConfig
    };
  }

  makeNewConfig(options = {}, serviceOptions = {}) {
    const { isForced = false, isSilent = false } = serviceOptions;
    const { id, configData = {}, preset: userPreset, isService = false } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error(`makeNewConfig: Wrong ID passed: ${id}`);
      return;
    }

    if (this._isUsed(id, isService) && !isForced) {
      if (!isSilent) console.error(`makeNewConfig: That ID is already in use: ${id}`);
      return;
    }

    const ConfigModel = this._selectConfigModel(isService);
    const branch = this._selectConfigsBranch(isService);
    const preset = userPreset || this._defaults.getPreset({ id, isService });

    branch[id] = new ConfigModel({ ...preset, ...configData });
    return branch[id];
  }

  getConfig(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { id, isService = false } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error(`getConfig: Wrong ID passed: ${id}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      if (!isSilent) console.error(`getConfig: There is no config with such ID: ${id}`);
      return;
    }

    return this._selectConfigsBranch(isService)[id];
  }

  getConfigs(options = {}) {
    const { isService = false } = options;

    return this._selectConfigsBranch(isService);
  }

  removeConfig(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { id, isService = false } = options;

    if (!WebpackLoader._validateId(id)) {
      if (!isSilent) console.error(`removeConfig: Wrong ID passed: ${id}`);
      return;
    }

    if (!this._isUsed(id, isService)) {
      return;
    }

    const branch = this._selectConfigsBranch(isService);

    if (isService && branch[id].isRunning) branch[id].stop();

    delete branch[id];
  }

  removeConfigs() {
    this._configs.simpleConfigs = {};

    this.stop();
    this._configs.serviceConfigs = {};
  }

  start(options = {}) {
    const { configs, serviceConfigs, startOptions } = options;

    const webpackConfigured = webpack(this._buildConfigs(configs));

    if (serviceConfigs) {
      serviceConfigs.forEach((config) => {
        if (typeof config === 'string') {
          config = this.getConfig({ id: config, isService: true });
        }
        config.start(webpackConfigured, startOptions);
      });
    } else {
      webpackConfigured.run(this._defaults.getHandler());
    }
  }

  stop(options = {}) {
    const { stopOptions } = options;

    const serviceTree = this._selectConfigsBranch(true);

    Object.values(serviceTree).forEach((config) => {
      if (config.isRunning) config.stop(stopOptions);
    });
  }

  getDefaults() {
    return this._defaults;
  }

  getSimpleConfigModel() {
    return this._models.Simple;
  }

  getServiceConfigModel() {
    return this._models.Service;
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
        } else if (config instanceof this._selectConfigModel()) {
          results.push(config.config);
        } else if (typeof config === 'object') {
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

  _selectConfigModel(isService = false) {
    if (isService) {
      return this.getServiceConfigModel();
    }

    return this.getSimpleConfigModel();
  }

  static _validateId(id) {
    if (!Helper.isNumber(id) && !Helper.isString(id)) return false;

    if (Helper.isString(id) && id.length < 1) return false;

    return true;
  }
}

export default WebpackLoader;
