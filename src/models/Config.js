import merge from 'webpack-merge';
import Helper from '../helpers/Helper';

class Config {
  constructor(options) {
    const { configDefaults, configs } = options;

    this.config = null;
    this.getConfigDefaults = () => ({});

    if (configDefaults) this.setConfigDefaults(configDefaults);
    this.resetConfig();
    if (configs) this.addToConfig(configs);
  }

  setConfigDefaults(func) {
    if (typeof func !== 'function') return;

    this.getConfigDefaults = func.bind(this);
  }

  resetConfig() {
    this.config = this.getConfigDefaults();
  }

  addToConfig(configs) {
    if (!Helper.isArr(configs) && !Helper.isObj(configs)) return;

    configs = Helper.toArr(configs);

    configs.forEach((config) => {
      this.config = merge([
        this.config,
        config
      ]);
    });
  }

  resetToDefaults() {
    this.resetConfig();
  }
}

export default Config;
