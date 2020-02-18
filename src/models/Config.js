import merge from 'webpack-merge';
import helper from '../helper/helper';

class Config {
  constructor(options) {
    this.config = null;
    this.getDefaults = () => ({});

    this._init(options);
  }

  setDefaultsGetter(getDefaults) {
    if (typeof getDefaults !== 'function') return;
    this.getDefaults = getDefaults;
  }

  resetToDefaults() {
    this.config = this.getDefaults();
  }

  addToConfig(configs) {
    if (!helper.isArr(configs) && !helper.isObj(configs)) return;

    configs = helper.toArr(configs);

    configs.forEach((config) => {
      this.config = merge([
        this.config,
        config
      ]);
    });
  }

  _init(options = {}) {
    const { getDefaults, configs } = options;
    this.setDefaultsGetter(getDefaults);
    this.resetToDefaults();
    this.addToConfig(configs);
  }
}

export default Config;
