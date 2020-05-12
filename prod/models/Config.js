"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _Helper = _interopRequireDefault(require("../Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config = /*#__PURE__*/function () {
  function Config() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Config);

    var configDefaultsGetter = options.configDefaultsGetter,
        configs = options.configs;
    this.config = null;

    this._getConfigDefaults = function () {
      return {};
    };

    if (configDefaultsGetter) this.setConfigDefaultsGetter({
      configDefaultsGetter: configDefaultsGetter
    });
    this.resetConfig();
    if (configs) this.addToConfig({
      configs: configs
    });
  }

  _createClass(Config, [{
    key: "addToConfig",
    value: function addToConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil === void 0 ? false : _serviceOptions$isSil;
      var configs = options.configs;

      if (!_Helper["default"].isArr(configs) && !_Helper["default"].isObj(configs)) {
        if (!isSilent) console.log("addToConfig: Wrong type of configs: ".concat(_typeof(configs)));
        return;
      }

      this.config = (0, _webpackMerge["default"])([this.config].concat(_toConsumableArray(_Helper["default"].toArr(configs))));
    }
  }, {
    key: "setConfigDefaultsGetter",
    value: function setConfigDefaultsGetter() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil2 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil2 === void 0 ? false : _serviceOptions$isSil2;
      var configDefaultsGetter = options.configDefaultsGetter;

      if (typeof configDefaultsGetter !== 'function') {
        if (!isSilent) console.log("setConfigDefaults: Wrong type of defaults: ".concat(_typeof(configDefaultsGetter)));
        return;
      }

      this._getConfigDefaults = configDefaultsGetter.bind(this);
    }
  }, {
    key: "resetConfig",
    value: function resetConfig() {
      this.config = this._getConfigDefaults();
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