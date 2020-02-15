"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _defaults = _interopRequireDefault(require("./defaults/defaults"));

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

    this.defaults = _defaults["default"];
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };

    this._init();
  }

  _createClass(WebpackLoader, [{
    key: "makeNewConfig",
    value: function makeNewConfig(id, configs, serviceOptions) {
      var _helper$flagsToObj = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj$is = _helper$flagsToObj.isForced,
          isForced = _helper$flagsToObj$is === void 0 ? false : _helper$flagsToObj$is,
          _helper$flagsToObj$is2 = _helper$flagsToObj.isSilent,
          isSilent = _helper$flagsToObj$is2 === void 0 ? false : _helper$flagsToObj$is2;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!isForced && this._isUsed(id)) {
        if (!isSilent) console.error("ID is already in use: ".concat(id));
        return;
      }

      var simpleTree = this._selectConfigsTree();

      simpleTree[id] = new _Config["default"]({
        getDefaults: this.defaults.getSimpleConfigDefaults(),
        configs: configs
      });
      return simpleTree[id];
    }
  }, {
    key: "addToConfig",
    value: function addToConfig(id, configs, serviceOptions) {
      var _helper$flagsToObj2 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj2$i = _helper$flagsToObj2.isService,
          isService = _helper$flagsToObj2$i === void 0 ? false : _helper$flagsToObj2$i,
          _helper$flagsToObj2$i2 = _helper$flagsToObj2.isForced,
          isForced = _helper$flagsToObj2$i2 === void 0 ? false : _helper$flagsToObj2$i2,
          _helper$flagsToObj2$i3 = _helper$flagsToObj2.isSilent,
          isSilent = _helper$flagsToObj2$i3 === void 0 ? false : _helper$flagsToObj2$i3;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!_helper["default"].isArr(configs) && !_helper["default"].isObj(configs)) {
        if (!isSilent) console.error("Wrong type of configs: ".concat(_typeof(configs)));
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (isService || !isForced) {
          if (!isSilent) console.error("There is no config with such ID: ".concat(id));
          return;
        }

        this.makeNewConfig(id);
      }

      var tree = this._selectConfigsTree(isService);

      tree[id].addToConfig(configs);
    }
  }, {
    key: "run",
    value: function run(configs, serviceConfigs, options) {
      var webpackConfigured = (0, _webpack["default"])(this._buildConfigs(configs));

      if (serviceConfigs && serviceConfigs.length) {
        var serviceTree = this._selectConfigsTree(true);

        serviceConfigs.forEach(function (config) {
          if (typeof config === 'string' && serviceTree[config]) {
            serviceTree[config].start(webpackConfigured, options);
          } else if (_typeof(config) === 'object') {
            config.start(webpackConfigured, options);
          }
        });
      } else {
        webpackConfigured.run(this.defaults.getNativeHandler(options));
      }
    }
  }, {
    key: "stop",
    value: function stop(options) {
      var serviceTree = this._selectConfigsTree(true);

      Object.values(serviceTree).forEach(function (config) {
        if (config.handler) config.stop(options);
      });
    }
  }, {
    key: "getConfig",
    value: function getConfig(id, serviceOptions) {
      var _helper$flagsToObj3 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj3$i = _helper$flagsToObj3.isService,
          isService = _helper$flagsToObj3$i === void 0 ? false : _helper$flagsToObj3$i,
          _helper$flagsToObj3$i2 = _helper$flagsToObj3.isSilent,
          isSilent = _helper$flagsToObj3$i2 === void 0 ? false : _helper$flagsToObj3$i2;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isSilent) console.error("There is no config with such ID: ".concat(id));
        return;
      }

      var tree = this._selectConfigsTree(isService);

      return tree[id];
    }
  }, {
    key: "getConfigs",
    value: function getConfigs() {
      return this.configs;
    }
  }, {
    key: "resetConfig",
    value: function resetConfig(id, serviceOptions) {
      var _helper$flagsToObj4 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj4$i = _helper$flagsToObj4.isService,
          isService = _helper$flagsToObj4$i === void 0 ? false : _helper$flagsToObj4$i,
          _helper$flagsToObj4$i2 = _helper$flagsToObj4.isSilent,
          isSilent = _helper$flagsToObj4$i2 === void 0 ? false : _helper$flagsToObj4$i2;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      var tree = this._selectConfigsTree(isService);

      tree[id].resetToDefaults();
    }
  }, {
    key: "removeConfig",
    value: function removeConfig(id, serviceOptions) {
      var _helper$flagsToObj5 = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj5$i = _helper$flagsToObj5.isSilent,
          isSilent = _helper$flagsToObj5$i === void 0 ? false : _helper$flagsToObj5$i;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!this._isUsed(id)) {
        if (!isSilent) console.error("There is no config with such ID: ".concat(id));
        return;
      }

      var simpleTree = this._selectConfigsTree();

      delete simpleTree[id];
    }
  }, {
    key: "removeAllConfigs",
    value: function removeAllConfigs() {
      var simpleTree = this._selectConfigsTree();

      Object.keys(simpleTree).forEach(function (id) {
        delete simpleTree[id];
      });
    }
  }, {
    key: "_init",
    value: function _init() {
      var serviceTree = this._selectConfigsTree(true);

      var makeServiceConf = function makeServiceConf(id, preset) {
        serviceTree[id] = new _ServiceConfig["default"](preset);
      };

      makeServiceConf(this.defaults.watchConfigId, this.defaults.getWatchServicePreset());
      makeServiceConf(this.defaults.devServerConfigId, this.defaults.getDevServerServicePreset());
    }
  }, {
    key: "_buildConfigs",
    value: function _buildConfigs(configs) {
      var simpleTree = this._selectConfigsTree();

      if (configs) configs = _helper["default"].toArr(configs);
      var results = [];

      if (!configs) {
        results = Object.values(simpleTree).map(function (config) {
          return config.config;
        });
      } else {
        configs.forEach(function (config) {
          if (typeof config === 'string' && simpleTree[config]) {
            results.push(simpleTree[config].config);
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
      return !!this._selectConfigsTree(isService)[id];
    }
  }, {
    key: "_selectConfigsTree",
    value: function _selectConfigsTree() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return !isService ? this.configs.simpleConfigs : this.configs.serviceConfigs;
    }
  }]);

  return WebpackLoader;
}();

var _default = WebpackLoader;
exports["default"] = _default;