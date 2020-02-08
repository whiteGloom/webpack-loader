import merge from 'webpack-merge';
import helper from '../helper/helper';

class Config {
  constructor() {
    this.config = null;
    this.getDefaults = () => ({});

    this._init(arguments);
  }

  setDefaultsGetter(getDefaults) {
    if (typeof getDefaults !== 'function') return;
    this.getDefaults = getDefaults;
  }

  resetToDefaults(options) {
    this.config = this.getDefaults(options);
  }

  addToConfig(configs) {
    if (!helper.isArr(configs) && !helper.isObj(configs)) return;

    configs = helper.toArr(configs);

    configs.forEach((config) => {
      this.config = merge([
        this.config,
        config,
      ]);
    });
  }

  _init({ getDefaults, configs, options }) {
    this.setDefaultsGetter(getDefaults);
    this.resetToDefaults(options);
    this.addToConfig(configs);
  }
}

export default Config;
