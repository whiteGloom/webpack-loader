"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Helper = _interopRequireDefault(require("../Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Defaults = /*#__PURE__*/function () {
  function Defaults() {
    _classCallCheck(this, Defaults);

    this._handlers = {
      "default": function _default() {},
      custom: {}
    };
    this._presets = {
      simple: {
        "default": {
          configDefaultsGetter: function configDefaultsGetter() {
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
  }

  _createClass(Defaults, [{
    key: "setHandler",
    value: function setHandler() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var id = options.id,
          handler = options.handler,
          _options$isDefault = options.isDefault,
          isDefault = _options$isDefault === void 0 ? !id : _options$isDefault;
      if (typeof handler !== 'function') return;

      if (isDefault) {
        this._handlers["default"] = handler;
      } else {
        this._handlers.custom[id] = handler;
      }
    }
  }, {
    key: "getHandler",
    value: function getHandler() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var id = options.id;
      return this._handlers.custom[id] || this._handlers["default"];
    }
  }, {
    key: "setPreset",
    value: function setPreset() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var id = options.id,
          preset = options.preset,
          _options$isService = options.isService,
          isService = _options$isService === void 0 ? false : _options$isService,
          _options$isDefault2 = options.isDefault,
          isDefault = _options$isDefault2 === void 0 ? !id : _options$isDefault2;

      var tree = this._selectPresetTree(isService);

      if (!_Helper["default"].isObj(preset)) return;

      if (isDefault) {
        tree["default"] = preset;
      } else {
        tree.custom[id] = preset;
      }
    }
  }, {
    key: "getPreset",
    value: function getPreset() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var id = options.id,
          _options$isService2 = options.isService,
          isService = _options$isService2 === void 0 ? false : _options$isService2;

      var tree = this._selectPresetTree(isService);

      return tree.custom[id] || tree["default"];
    }
  }, {
    key: "_selectPresetTree",
    value: function _selectPresetTree() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (isService) {
        return this._presets.service;
      }

      return this._presets.simple;
    }
  }]);

  return Defaults;
}();

var _default2 = Defaults;
exports["default"] = _default2;