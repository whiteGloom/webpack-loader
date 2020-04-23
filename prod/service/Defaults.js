"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Defaults = /*#__PURE__*/function () {
  function Defaults() {
    _classCallCheck(this, Defaults);

    this.ids = {};
    this.handlers = {
      "default": function _default() {},
      custom: {}
    };
    this.presets = {
      simple: {
        "default": {
          configDefaults: function configDefaults() {
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
        "default": {
          startDefaults: function startDefaults() {},
          stopDefaults: function stopDefaults() {}
        },
        custom: {}
      }
    };
    this.defaultConfigs = [];
  }

  _createClass(Defaults, [{
    key: "setHandler",
    value: function setHandler(options) {
      var key = options.key,
          func = options.func,
          _options$isDefault = options.isDefault,
          isDefault = _options$isDefault === void 0 ? !key : _options$isDefault;

      if (isDefault) {
        this.handlers["default"] = func;
      } else {
        this.handlers.custom[key] = func;
      }
    }
  }, {
    key: "getHandler",
    value: function getHandler(key) {
      return this.handlers.custom[key] || this.handlers["default"];
    }
  }, {
    key: "setId",
    value: function setId(key, value) {
      this.ids[key] = value;
    }
  }, {
    key: "getId",
    value: function getId(key) {
      return this.ids[key];
    }
  }, {
    key: "setPreset",
    value: function setPreset(options) {
      var id = options.id,
          preset = options.preset,
          _options$isService = options.isService,
          isService = _options$isService === void 0 ? false : _options$isService,
          _options$isDefault2 = options.isDefault,
          isDefault = _options$isDefault2 === void 0 ? !id : _options$isDefault2;
      var tree = this.presets[isService ? 'service' : 'simple'];

      if (isDefault) {
        tree["default"] = preset;
      } else {
        tree.custom[id] = preset;
      }
    }
  }, {
    key: "getPreset",
    value: function getPreset(id) {
      var isService = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var tree = this.presets[isService ? 'service' : 'simple'];
      return tree.custom[id] || tree["default"];
    }
  }, {
    key: "addDefaultConfig",
    value: function addDefaultConfig(options) {
      var id = options.id,
          additionalConfigs = options.additionalConfigs,
          _options$isService2 = options.isService,
          isService = _options$isService2 === void 0 ? false : _options$isService2;
      this.defaultConfigs.push({
        id: id,
        isService: isService,
        additionalConfigs: additionalConfigs
      });
    }
  }, {
    key: "getDefaultConfigs",
    value: function getDefaultConfigs() {
      return this.defaultConfigs;
    }
  }]);

  return Defaults;
}();

var _default2 = Defaults;
exports["default"] = _default2;