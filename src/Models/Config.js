import merge from 'webpack-merge';
import Defaults from '../Defaults/Defaults';
import helper from '../helper/helper';

class Config {
  constructor() {
    this.defaults = Defaults;
    this.config = {};
    this.getDefaults = null;

    this._init(arguments);
  }

  setDefaults(defaults) {
    if (typeof defaults !== 'object') return;
    this.getDefaults = defaults;
  }

  resetToDefaults(options) {
    this.config = this.getDefaults(options);
  }

  addToConfig(configs) {
    if (!helper.isArr(configs) && !helper.isObj(configs)) {
      return console.error(`Wrong type of configs: ${typeof configs}`);
    }

    configs = helper.toArr(configs);

    configs.forEach((config) => {
      this.config = merge([
        this.config,
        config,
      ]);
    });
  }

  _init(defaults, configs, options) {
    this.setDefaults(defaults || this.defaults.getSimpleConfigDefaults);
    this.resetToDefaults(options);
    if (configs) this.addToConfig(configs);
  }
}

export default Config;
