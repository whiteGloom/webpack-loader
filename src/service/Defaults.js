class Defaults {
  constructor() {
    this.ids = {};
    this.handlers = {
      default: () => {},
      custom: {}
    };
    this.presets = {
      simple: {
        default: {
          configDefaults() {
            return {
              mode: 'development',
              entry: {},
              output: {},
              module: {
                rules: []
              },
              plugins: [],
              optimization: {},
              resolve: {}
            };
          }
        },
        custom: {}
      },
      service: {
        default: {
          startDefaults() {},
          stopDefaults() {}
        },
        custom: {}
      }
    };
    this.defaultConfigs = [];
  }

  setHandler(options) {
    const { key, func, isDefault = !key } = options;

    if (isDefault) {
      this.handlers.default = func;
    } else {
      this.handlers.custom[key] = func;
    }
  }

  getHandler(key) {
    return this.handlers.custom[key] || this.handlers.default;
  }

  setId(key, value) {
    this.ids[key] = value;
  }

  getId(key) {
    return this.ids[key];
  }

  setPreset(options) {
    const { id, preset, isService = false, isDefault = !id } = options;
    const tree = this.presets[isService ? 'service' : 'simple'];

    if (isDefault) {
      tree.default = preset;
    } else {
      tree.custom[id] = preset;
    }
  }

  getPreset(id, isService = false) {
    const tree = this.presets[isService ? 'service' : 'simple'];
    return tree.custom[id] || tree.default;
  }

  addDefaultConfig(options) {
    const { id, additionalConfigs, isService = false } = options;
    this.defaultConfigs.push({ id, isService, additionalConfigs });
  }

  getDefaultConfigs() {
    return this.defaultConfigs;
  }
}

export default Defaults;
