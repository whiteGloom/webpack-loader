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

  setHandler(options = {}) {
    const { id, handler, isDefault = !id } = options;

    if (isDefault) {
      this.handlers.default = handler;
    } else {
      this.handlers.custom[id] = handler;
    }
  }

  getHandler(options = {}) {
    const { id } = options;
    return this.handlers.custom[id] || this.handlers.default;
  }

  setId(options = {}) {
    const { id, value } = options;
    this.ids[id] = value;
  }

  getId(options = {}) {
    const { id } = options;
    return this.ids[id];
  }

  setPreset(options = {}) {
    const { id, preset, isService = false, isDefault = !id } = options;
    const tree = this.presets[isService ? 'service' : 'simple'];

    if (isDefault) {
      tree.default = preset;
    } else {
      tree.custom[id] = preset;
    }
  }

  getPreset(options = {}) {
    const { id, isService = false } = options;
    const tree = this.presets[isService ? 'service' : 'simple'];

    return tree.custom[id] || tree.default;
  }

  addDefaultConfig(options = {}) {
    const { id, additionalConfigs, isService = false } = options;
    this.defaultConfigs.push({ id, isService, additionalConfigs });
  }

  getDefaultConfigs() {
    return this.defaultConfigs;
  }
}

export default Defaults;
