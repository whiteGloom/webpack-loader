"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _defaults = _interopRequireDefault(require("./defaults/defaults"));

var _models = _interopRequireDefault(require("./models/models"));

var _helper = _interopRequireDefault(require("./helper/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    this.models = _models["default"];
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
    this.makeNewConfig(this.defaults.ids.watchConfigId, {}, ['isService']);
    this.makeNewConfig(this.defaults.ids.devServerConfigId, {}, ['isService']);
  }

  _createClass(WebpackLoader, [{
    key: "makeNewConfig",
    value: function makeNewConfig(id, options, serviceOptions) {
      var _helper$flagsToObj = _helper["default"].flagsToObj(serviceOptions),
          _helper$flagsToObj$is = _helper$flagsToObj.isForced,
          isForced = _helper$flagsToObj$is === void 0 ? false : _helper$flagsToObj$is,
          _helper$flagsToObj$is2 = _helper$flagsToObj.isSilent,
          isSilent = _helper$flagsToObj$is2 === void 0 ? false : _helper$flagsToObj$is2,
          isService = _helper$flagsToObj.isService;

      options = _helper["default"].isObj(options) ? options : {};

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("makeNewConfig: Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (this._isUsed(id) && (isService || !isForced)) {
        if (!isSilent) console.error("makeNewConfig: ID is already in use: ".concat(id));
        return;
      }

      var Class = this.models.getModel(isService);

      var tree = this._selectConfigsTree(isService);

      tree[id] = new Class(_objectSpread({}, _defaults["default"].getPreset(id, isService), {}, options));
      return tree[id];
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
        if (!isSilent) console.error("addToConfig: Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!_helper["default"].isArr(configs) && !_helper["default"].isObj(configs)) {
        if (!isSilent) console.error("addToConfig: Wrong type of configs: ".concat(_typeof(configs)));
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (isService || !isForced) {
          if (!isSilent) console.error("addToConfig: There is no config with such ID: ".concat(id));
          return;
        }

        this.makeNewConfig(id, {
          configs: configs
        }, serviceOptions);
        return;
      }

      var tree = this._selectConfigsTree(isService);

      tree[id].addToConfig(configs);
    }
  }, {
    key: "run",
    value: function run(configs, serviceConfigs, options) {
      var _this = this;

      var webpackConfigured = (0, _webpack["default"])(this._buildConfigs(configs));

      if (serviceConfigs && serviceConfigs.length) {
        var serviceTree = this._selectConfigsTree(true);

        serviceConfigs.forEach(function (config) {
          if (typeof config === 'string' && serviceTree[config]) {
            serviceTree[config].start(webpackConfigured, options);
          } else if (config instanceof _this.models.getModel(true)) {
            config.start(webpackConfigured, options);
          }
        });
      } else {
        webpackConfigured.run(this.defaults.handlers.getNativeHandler(options));
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
        if (!isSilent) console.error("getConfig: Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isSilent) console.error("getConfig: There is no config with such ID: ".concat(id));
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
        if (!isSilent) console.error("resetConfig: Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
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
          isSilent = _helper$flagsToObj5$i === void 0 ? false : _helper$flagsToObj5$i,
          isService = _helper$flagsToObj5.isService;

      if (!_helper["default"].isNumber(id) && !_helper["default"].isString(id)) {
        if (!isSilent) console.error("removeConfig: Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isSilent) console.error("removeConfig: There is no config with such ID: ".concat(id));
        return;
      }

      var tree = this._selectConfigsTree(isService);

      delete tree[id];
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
    key: "getDefaults",
    value: function getDefaults() {
      return this.defaults;
    }
  }, {
    key: "getModels",
    value: function getModels() {
      return this.models;
    }
  }, {
    key: "_buildConfigs",
    value: function _buildConfigs(configs) {
      var _this2 = this;

      var simpleTree = this._selectConfigsTree();

      var results = [];

      if (!configs) {
        results = Object.values(simpleTree).map(function (config) {
          return config.config;
        });
      } else {
        configs = _helper["default"].toArr(configs);
        configs.forEach(function (config) {
          if (typeof config === 'string' && simpleTree[config]) {
            results.push(simpleTree[config].config);
          } else if (config instanceof _this2.models.getModel(false)) {
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