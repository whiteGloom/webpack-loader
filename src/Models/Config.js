import merge from 'webpack-merge';
import Defaults from '../Defaults/Defaults';
import Helper from '../Helper/Helper';

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

  resetToDefaults() {
    this.config = this.getDefaults();
  }

  addToConfig(configs) {
    if (!Helper.isArr(configs) && !Helper.isObj(configs)) {
      return console.error(`Wrong type of configs: ${typeof configs}`);
    }

    configs = Helper.toArr(configs);

    configs.forEach((config) => {
      this.config = merge([
        this.config,
        config,
      ]);
    });
  }

  _init({ defaults, configs }) {
    this.setDefaults(defaults || this.defaults.getSimpleConfigDefaults);
    this.resetToDefaults();
    if (configs) this.addToConfig(configs);
  }
}

export default Config;
