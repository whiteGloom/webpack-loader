import merge from 'webpack-merge';
import Helper from '../Helper';

class Config {
  constructor(options = {}) {
    const { configDefaultsGetter, configs } = options;

    this.config = null;
    this._getConfigDefaults = () => ({});

    if (configDefaultsGetter) this.setConfigDefaultsGetter({ configDefaultsGetter });
    this.resetConfig();

    if (configs) this.addToConfig({ configs });
  }

  addToConfig(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { configs } = options;

    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      if (!isSilent) console.log(`addToConfig: Wrong type of configs: ${typeof configs}`);
      return;
    }

    this.config = merge([this.config, ...Helper.toArr(configs)]);
  }

  setConfigDefaultsGetter(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { configDefaultsGetter } = options;

    if (typeof configDefaultsGetter !== 'function') {
      if (!isSilent) console.log(`setConfigDefaults: Wrong type of defaults: ${typeof configDefaultsGetter}`);
      return;
    }

    this._getConfigDefaults = configDefaultsGetter.bind(this);
  }

  resetConfig() {
    this.config = this._getConfigDefaults();
  }

  resetToDefaults() {
    this.resetConfig();
  }
}

export default Config;
