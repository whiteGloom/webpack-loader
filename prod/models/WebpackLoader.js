"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _Models = _interopRequireDefault(require("../service/Models"));

var _Defaults = _interopRequireDefault(require("../service/Defaults"));

var _Helper = _interopRequireDefault(require("../helpers/Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebpackLoader = /*#__PURE__*/function () {
  function WebpackLoader() {
    _classCallCheck(this, WebpackLoader);

    this.defaults = new _Defaults["default"]();
    this.models = new _Models["default"]();
    this.configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
  }

  _createClass(WebpackLoader, [{
    key: "init",
    value: function init() {
      this._initDefaultConfigs();
    }
  }, {
    key: "makeNewConfig",
    value: function makeNewConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 ? arguments[1] : undefined;

      var _Helper$flagsToObj = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj$is = _Helper$flagsToObj.isForced,
          isForced = _Helper$flagsToObj$is === void 0 ? false : _Helper$flagsToObj$is,
          _Helper$flagsToObj$is2 = _Helper$flagsToObj.isSilent,
          isSilent = _Helper$flagsToObj$is2 === void 0 ? false : _Helper$flagsToObj$is2,
          _Helper$flagsToObj$is3 = _Helper$flagsToObj.isService,
          isService = _Helper$flagsToObj$is3 === void 0 ? false : _Helper$flagsToObj$is3;

      var id = options.id,
          userConfigs = options.configs,
          userPreset = options.preset;

      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) {
        if (!isSilent) console.error("makeNewConfig: Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (this._isUsed(id, isService) && !isForced) {
        if (!isSilent) console.error("makeNewConfig: ID is already in use: ".concat(id));
        return;
      }

      var ConfigClass = this.models.getModel(isService);

      var tree = this._selectConfigsTree(isService);

      var preset = userPreset || this.defaults.getPreset(id, isService);
      tree[id] = new ConfigClass(_objectSpread({}, preset, {}, userConfigs));
      return tree[id];
    }
  }, {
    key: "addToConfig",
    value: function addToConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 ? arguments[1] : undefined;

      var _Helper$flagsToObj2 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj2$i = _Helper$flagsToObj2.isService,
          isService = _Helper$flagsToObj2$i === void 0 ? false : _Helper$flagsToObj2$i,
          _Helper$flagsToObj2$i2 = _Helper$flagsToObj2.isForced,
          isForced = _Helper$flagsToObj2$i2 === void 0 ? false : _Helper$flagsToObj2$i2,
          _Helper$flagsToObj2$i3 = _Helper$flagsToObj2.isSilent,
          isSilent = _Helper$flagsToObj2$i3 === void 0 ? false : _Helper$flagsToObj2$i3;

      var id = options.id,
          userConfigs = options.configs;

      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) {
        if (!isSilent) console.error("addToConfig: Wrong type of ID ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      if (!userConfigs) {
        if (!isSilent) console.error('addToConfig: No configs passed');
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isForced) {
          if (!isSilent) console.error("addToConfig: There is no config with such ID: ".concat(id));
          return;
        }

        this.makeNewConfig(options, serviceOptions);
        return;
      }

      var tree = this._selectConfigsTree(isService);

      tree[id].addToConfig(userConfigs);
    }
  }, {
    key: "getConfig",
    value: function getConfig(id, serviceOptions) {
      var _Helper$flagsToObj3 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj3$i = _Helper$flagsToObj3.isService,
          isService = _Helper$flagsToObj3$i === void 0 ? false : _Helper$flagsToObj3$i,
          _Helper$flagsToObj3$i2 = _Helper$flagsToObj3.isSilent,
          isSilent = _Helper$flagsToObj3$i2 === void 0 ? false : _Helper$flagsToObj3$i2;

      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) {
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
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (isService) {
        return this.configs.serviceConfigs;
      }

      return this.configs.simpleConfigs;
    }
  }, {
    key: "resetConfig",
    value: function resetConfig(id, serviceOptions) {
      var _Helper$flagsToObj4 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj4$i = _Helper$flagsToObj4.isService,
          isService = _Helper$flagsToObj4$i === void 0 ? false : _Helper$flagsToObj4$i,
          _Helper$flagsToObj4$i2 = _Helper$flagsToObj4.isSilent,
          isSilent = _Helper$flagsToObj4$i2 === void 0 ? false : _Helper$flagsToObj4$i2;

      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) {
        if (!isSilent) console.error("resetConfig: Wrong type of identifier ".concat(id, ": ").concat(_typeof(id)));
        return;
      }

      var tree = this._selectConfigsTree(isService);

      tree[id].resetToDefaults();
    }
  }, {
    key: "removeConfig",
    value: function removeConfig(id, serviceOptions) {
      var _Helper$flagsToObj5 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj5$i = _Helper$flagsToObj5.isSilent,
          isSilent = _Helper$flagsToObj5$i === void 0 ? false : _Helper$flagsToObj5$i,
          _Helper$flagsToObj5$i2 = _Helper$flagsToObj5.isService,
          isService = _Helper$flagsToObj5$i2 === void 0 ? false : _Helper$flagsToObj5$i2;

      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) {
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
    key: "start",
    value: function start(configs, serviceConfigs, options) {
      var _this = this;

      var webpackConfigured = (0, _webpack["default"])(this._buildConfigs(configs));

      if (serviceConfigs && serviceConfigs.length) {
        serviceConfigs.forEach(function (config) {
          var savedConfig = _this.getConfig(config, ['isService', 'isSilent']);

          if (typeof config === 'string' && savedConfig) {
            savedConfig.start(webpackConfigured, options);
          } else if (config instanceof _this.models.getModel(true)) {
            config.start(webpackConfigured, options);
          }
        });
      } else {
        webpackConfigured.run(this.defaults.getHandler());
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
        configs = _Helper["default"].toArr(configs);
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
  }, {
    key: "_initDefaultConfigs",
    value: function _initDefaultConfigs() {
      var _this3 = this;

      var defaultConfigs = this.defaults.getDefaultConfigs();
      defaultConfigs.forEach(function (config) {
        var id = config.id,
            isService = config.isService,
            additionalConfigs = config.additionalConfigs;

        _this3.makeNewConfig({
          id: id,
          configs: additionalConfigs
        }, {
          isService: isService,
          isSilent: true
        });
      });
    }
  }]);

  return WebpackLoader;
}();

var _default = WebpackLoader;
exports["default"] = _default;