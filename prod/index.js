"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _Defaults = _interopRequireDefault(require("./Defaults/Defaults"));

var _ServiceConfig = _interopRequireDefault(require("./Models/ServiceConfig"));

var _Config = _interopRequireDefault(require("./Models/Config"));

var _helper = _interopRequireDefault(require("./helper/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebpackLoader =
/*#__PURE__*/
function () {
  function WebpackLoader() {
    _classCallCheck(this, WebpackLoader);

    this.defaults = _Defaults["default"];
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };

    this._init();
  }

  _createClass(WebpackLoader, [{
    key: "makeNewConfig",
    value: function makeNewConfig(id, configs, options, serviceOptions) {
      var _helper$flagsToObj = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj$is = _helper$flagsToObj.isForced,
          isForced = _helper$flagsToObj$is === void 0 ? false : _helper$flagsToObj$is;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        return console.error("Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
      }

      if (!isForced && this._isUsed(id)) {
        return console.error("ID is already in use: ".concat(id));
      }

      this.configs.simpleConfigs[id] = new _Config["default"]({
        defaults: this.defaults.getSimpleConfigDefaults(),
        configs: configs,
        options: options
      });
      return this.configs.simpleConfigs[id];
    }
  }, {
    key: "addToConfig",
    value: function addToConfig(id, configs, serviceOptions) {
      var _helper$flagsToObj2 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj2$i = _helper$flagsToObj2.isService,
          isService = _helper$flagsToObj2$i === void 0 ? false : _helper$flagsToObj2$i,
          _helper$flagsToObj2$i2 = _helper$flagsToObj2.isForced,
          isForced = _helper$flagsToObj2$i2 === void 0 ? false : _helper$flagsToObj2$i2;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        return console.error("Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
      }

      if (!_helper["default"].isArr(configs) && !_helper["default"].isObj(configs)) {
        return console.error("Wrong type of configs: ".concat(_typeof(configs)));
      }

      if (!this._isUsed(id, isService)) {
        if (isService || !isForced) {
          return console.error("There is no config with such ID: ".concat(id));
        }

        this.makeNewConfig(id);
      }

      var configsTree = this._selectConfsTree(isService);

      configsTree[id].addToConfig(configs);
    }
  }, {
    key: "run",
    value: function run(configs, serviceConfigs, options) {
      var _this = this;

      var webpackConfigured = (0, _webpack["default"])(this._buildConfigs(configs));

      if (serviceConfigs && serviceConfigs.length) {
        serviceConfigs.forEach(function (config) {
          if (typeof config === 'string' && _this.configs.serviceConfigs[config]) {
            _this.configs.serviceConfigs[config].start(webpackConfigured, options);
          } else if (_typeof(config) === 'object') {
            config.start(webpackConfigured, options);
          }
        });
      } else {
        webpackConfigured.run(_helper["default"].getNativeHandler(options));
      }
    }
  }, {
    key: "stop",
    value: function stop(options) {
      Object.values(this.serviceConfigs).forEach(function (config) {
        if (config.handler) config.stop(options);
      });
    }
  }, {
    key: "getConfig",
    value: function getConfig(id, serviceOptions) {
      var _helper$flagsToObj3 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj3$i = _helper$flagsToObj3.isService,
          isService = _helper$flagsToObj3$i === void 0 ? false : _helper$flagsToObj3$i;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        return console.error("Wrong type of identificator ".concat(id, ": ").concat(_typeof(id)));
      }

      if (!this._isUsed(id)) {
        return console.error("There is no config with such ID: ".concat(id));
      }

      var configsTree = this._selectConfsTree(isService);

      return configsTree(isService)[id];
    }
  }, {
    key: "getConfigs",
    value: function getConfigs() {
      return this.configs;
    }
  }, {
    key: "resetConfig",
    value: function resetConfig(id, options, serviceOptions) {
      var _helper$flagsToObj4 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj4$i = _helper$flagsToObj4.isService,
          isService = _helper$flagsToObj4$i === void 0 ? false : _helper$flagsToObj4$i;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        return console.error("Wrong type of identificator ".concat(id, ": ").concat(_typeof(id)));
      }

      var configsTree = this._selectConfsTree(isService);

      configsTree[id].resetToDefaults(options);
    }
  }, {
    key: "removeConfig",
    value: function removeConfig(id) {
      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        return console.error("Wrong type of identificator ".concat(id, ": ").concat(_typeof(id)));
      }

      if (!this._isUsed(id)) {
        return console.error("There is no config with such ID: ".concat(id));
      }

      delete this.configs.simpleConfigs[id];
    }
  }, {
    key: "_init",
    value: function _init() {
      var _this2 = this;

      var makeServiceConf = function makeServiceConf(id, preset) {
        _this2.configs.serviceConfigs[id] = new _ServiceConfig["default"](preset);
      };

      makeServiceConf(this.defaults.watchConfigId, this.defaults.getWatchServicePreset());
      makeServiceConf(this.defaults.devServerConfigId, this.defaults.getDevServerServicePreset());
    }
  }, {
    key: "_buildConfigs",
    value: function _buildConfigs(configs) {
      var _this3 = this;

      if (configs) configs = _helper["default"].toArr(configs);
      var results = [];

      if (!configs) {
        results = Object.values(this.configs.simpleConfigs).map(function (config) {
          return config.config;
        });
      } else {
        configs.forEach(function (config) {
          if (typeof config === 'string' && _this3.configs.simpleConfigs[config]) {
            results.push(_this3.configs.simpleConfigs[config].config);
          } else if (config instanceof _Config["default"]) {
            results.push(config.config);
          } else if (_typeof(config) === 'object') {
            results.push(config);
          }
        });
      }

      return results.length > 1 ? results : results[0];
    }
  }, {
    key: "_isUsed",
    value: function _isUsed(id) {
      var isService = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return !!this._selectConfsTree(isService)[id];
    }
  }, {
    key: "_selectConfsTree",
    value: function _selectConfsTree() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return !isService ? this.configs.simpleConfigs : this.configs.serviceConfigs;
    }
  }]);

  return WebpackLoader;
}();

var _default = WebpackLoader;
exports["default"] = _default;