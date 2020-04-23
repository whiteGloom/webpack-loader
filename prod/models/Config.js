"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _Helper = _interopRequireDefault(require("../helpers/Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config = /*#__PURE__*/function () {
  function Config(options) {
    _classCallCheck(this, Config);

    var configDefaults = options.configDefaults,
        configs = options.configs;
    this.config = null;

    this.getConfigDefaults = function () {
      return {};
    };

    if (configDefaults) this.setConfigDefaults(configDefaults);
    this.resetConfig();
    if (configs) this.addToConfig(configs);
  }

  _createClass(Config, [{
    key: "setConfigDefaults",
    value: function setConfigDefaults(func) {
      if (typeof func !== 'function') return;
      this.getConfigDefaults = func.bind(this);
    }
  }, {
    key: "resetConfig",
    value: function resetConfig() {
      this.config = this.getConfigDefaults();
    }
  }, {
    key: "addToConfig",
    value: function addToConfig(configs) {
      var _this = this;

      if (!_Helper["default"].isArr(configs) && !_Helper["default"].isObj(configs)) return;
      configs = _Helper["default"].toArr(configs);
      configs.forEach(function (config) {
        _this.config = (0, _webpackMerge["default"])([_this.config, config]);
      });
    }
  }, {
    key: "resetToDefaults",
    value: function resetToDefaults() {
      this.resetConfig();
    }
  }]);

  return Config;
}();

var _default = Config;
exports["default"] = _default;