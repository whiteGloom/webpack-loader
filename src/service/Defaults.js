import Helper from '../Helper';

class Defaults {
  constructor() {
    this._handlers = {
      default: () => {},
      custom: {}
    };
    this._presets = {
      simple: {
        default: {
          configDefaultsGetter() {
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
  }

  setHandler(options = {}) {
    const { id, handler, isDefault = !id } = options;

    if (typeof handler !== 'function') return;

    if (isDefault) {
      this._handlers.default = handler;
    } else {
      this._handlers.custom[id] = handler;
    }
  }

  getHandler(options = {}) {
    const { id } = options;

    return this._handlers.custom[id] || this._handlers.default;
  }

  setPreset(options = {}) {
    const { id, preset, isService = false, isDefault = !id } = options;
    const tree = this._presets[isService ? 'service' : 'simple'];

    if (!Helper.isObj(preset)) return;

    if (isDefault) {
      tree.default = preset;
    } else {
      tree.custom[id] = preset;
    }
  }

  getPreset(options = {}) {
    const { id, isService = false } = options;
    const tree = this._presets[isService ? 'service' : 'simple'];

    return tree.custom[id] || tree.default;
  }
}

export default Defaults;
