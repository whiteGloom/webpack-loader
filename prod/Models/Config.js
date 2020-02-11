"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _helper = _interopRequireDefault(require("../helper/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Config =
/*#__PURE__*/
function () {
  function Config(options) {
    _classCallCheck(this, Config);

    this.config = null;

    this.getDefaults = function () {
      return {};
    };

    this._init(options);
  }

  _createClass(Config, [{
    key: "setDefaultsGetter",
    value: function setDefaultsGetter(getDefaults) {
      if (typeof getDefaults !== 'function') return;
      this.getDefaults = getDefaults;
    }
  }, {
    key: "resetToDefaults",
    value: function resetToDefaults() {
      this.config = this.getDefaults();
    }
  }, {
    key: "addToConfig",
    value: function addToConfig(configs) {
      var _this = this;

      if (!_helper["default"].isArr(configs) && !_helper["default"].isObj(configs)) return;
      configs = _helper["default"].toArr(configs);
      configs.forEach(function (config) {
        _this.config = (0, _webpackMerge["default"])([_this.config, config]);
      });
    }
  }, {
    key: "_init",
    value: function _init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var getDefaults = options.getDefaults,
          configs = options.configs;
      this.setDefaultsGetter(getDefaults);
      this.resetToDefaults();
      this.addToConfig(configs);
    }
  }]);

  return Config;
}();

var _default = Config;
exports["default"] = _default;