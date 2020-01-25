import Helper from '../Helper/Helper';

class Defaults {
  constructor() {
    this.devServerConfigName = 'dev';
    this.watchConfigName = 'watch';
  }

  getConfigDefaults(mode, isService, id) {
    if (!isService) {
      return Defaults._getSimpleConfigDefaults(mode);
    }
    if (isService) {
      switch (id) {
        case this.devServerConfigName:
          return Defaults._getServerConfigDefaults();
        case this.watchConfigName:
          return Defaults._getWatchConfigDefaults();
        default:
          return false;
      }
    }
    return false;
  }

  static _getSimpleConfigDefaults(mode) {
    if (!Helper.isString(mode)) mode = 'development';
    return {
      mode,
      entry: {
      },
      output: {
      },
      module: {
        rules: [],
      },
      plugins: [
      ],
      optimization: {
      },
      resolve: {
      },
    };
  }

  static _getServerConfigDefaults() {
    return {};
  }

  static _getWatchConfigDefaults() {
    return {};
  }
}

export default Defaults;
