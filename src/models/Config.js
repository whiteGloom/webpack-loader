import merge from 'webpack-merge';
import Helper from '../Helper';

class Config {
  constructor(options) {
    const { configDefaultsGetter, configs } = options;

    this.config = null;
    this.getConfigDefaults = () => ({});

    if (configDefaultsGetter) this.setConfigDefaults({ configDefaultsGetter });
    this.resetConfig();

    if (configs) this.addToConfig({ configs });
  }

  setConfigDefaults(options = {}, serviceOptions = {}) {
    const { isSilent = false } = serviceOptions;
    const { configDefaultsGetter } = options;

    if (typeof configDefaultsGetter !== 'function') {
      if (!isSilent) console.log(`setConfigDefaults: Wrong type of defaults: ${typeof configDefaultsGetter}`);
      return;
    }

    this.getConfigDefaults = configDefaultsGetter.bind(this);
  }

  resetConfig() {
    this.config = this.getConfigDefaults();
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

  resetToDefaults() {
    this.resetConfig();
  }
}

export default Config;
