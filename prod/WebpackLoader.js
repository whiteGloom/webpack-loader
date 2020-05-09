"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _Helper = _interopRequireDefault(require("./Helper"));

var _Models = _interopRequireDefault(require("./service/Models"));

var _Defaults = _interopRequireDefault(require("./service/Defaults"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebpackLoader = /*#__PURE__*/function () {
  function WebpackLoader() {
    _classCallCheck(this, WebpackLoader);

    this._defaults = new _Defaults["default"]();
    this._models = new _Models["default"]();
    this._configs = {
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
          _Helper$flagsToObj$is = _Helper$flagsToObj.isService,
          isService = _Helper$flagsToObj$is === void 0 ? false : _Helper$flagsToObj$is,
          _Helper$flagsToObj$is2 = _Helper$flagsToObj.isForced,
          isForced = _Helper$flagsToObj$is2 === void 0 ? false : _Helper$flagsToObj$is2,
          _Helper$flagsToObj$is3 = _Helper$flagsToObj.isSilent,
          isSilent = _Helper$flagsToObj$is3 === void 0 ? false : _Helper$flagsToObj$is3;

      var id = options.id,
          userConfigs = options.configs,
          userPreset = options.preset;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
        return;
      }

      if (this._isUsed(id, isService) && !isForced) {
        if (!isSilent) console.error("makeNewConfig: That ID is already in use: ".concat(id));
        return;
      }

      var ConfigModel = this._models.getModel(isService);

      var branch = this._selectConfigsBranch(isService);

      var preset = userPreset || this._defaults.getPreset(id, isService);

      branch[id] = new ConfigModel(_objectSpread({}, preset, {}, {
        configs: userConfigs
      }));
      return branch[id];
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

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
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

      this.getConfig({
        id: id
      }, {
        isService: isService
      }).addToConfig(userConfigs);
    }
  }, {
    key: "getConfig",
    value: function getConfig(options, serviceOptions) {
      var _Helper$flagsToObj3 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj3$i = _Helper$flagsToObj3.isService,
          isService = _Helper$flagsToObj3$i === void 0 ? false : _Helper$flagsToObj3$i,
          _Helper$flagsToObj3$i2 = _Helper$flagsToObj3.isSilent,
          isSilent = _Helper$flagsToObj3$i2 === void 0 ? false : _Helper$flagsToObj3$i2;

      var id = options.id;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isSilent) console.error("getConfig: There is no config with such ID: ".concat(id));
        return;
      }

      return this._selectConfigsBranch(isService)[id];
    }
  }, {
    key: "getConfigs",
    value: function getConfigs(serviceOptions) {
      var _Helper$flagsToObj4 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj4$i = _Helper$flagsToObj4.isService,
          isService = _Helper$flagsToObj4$i === void 0 ? false : _Helper$flagsToObj4$i;

      return this._selectConfigsBranch(isService);
    }
  }, {
    key: "resetConfig",
    value: function resetConfig(options, serviceOptions) {
      var _Helper$flagsToObj5 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj5$i = _Helper$flagsToObj5.isService,
          isService = _Helper$flagsToObj5$i === void 0 ? false : _Helper$flagsToObj5$i,
          _Helper$flagsToObj5$i2 = _Helper$flagsToObj5.isSilent,
          isSilent = _Helper$flagsToObj5$i2 === void 0 ? false : _Helper$flagsToObj5$i2;

      var id = options.id;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
        return;
      }

      this._selectConfigsBranch(isService)[id].resetToDefaults();
    }
  }, {
    key: "removeConfig",
    value: function removeConfig(options, serviceOptions) {
      var _Helper$flagsToObj6 = _Helper["default"].flagsToObj(serviceOptions),
          _Helper$flagsToObj6$i = _Helper$flagsToObj6.isSilent,
          isSilent = _Helper$flagsToObj6$i === void 0 ? false : _Helper$flagsToObj6$i,
          _Helper$flagsToObj6$i2 = _Helper$flagsToObj6.isService,
          isService = _Helper$flagsToObj6$i2 === void 0 ? false : _Helper$flagsToObj6$i2;

      var id = options.id;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error('makeNewConfig: Wrong ID passed');
        return;
      }

      if (!this._isUsed(id, isService)) {
        if (!isSilent) console.error("removeConfig: There is no config with such ID: ".concat(id));
        return;
      }

      delete this._selectConfigsBranch(isService)[id];
    }
  }, {
    key: "removeConfigs",
    value: function removeConfigs() {
      this._configs.simpleConfigs = {};
      this._configs.serviceConfigs = {};
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var configs = options.configs,
          serviceConfigs = options.serviceConfigs,
          startOptions = options.startOptions;
      var webpackConfigured = (0, _webpack["default"])(this._buildConfigs(configs));

      if (serviceConfigs) {
        serviceConfigs.forEach(function (config) {
          if (typeof config === 'string') {
            config = _this.getConfig({
              id: config
            }, {
              isService: true
            });
          }

          config.start(webpackConfigured, startOptions);
        });
      } else {
        webpackConfigured.run(this._defaults.getHandler());
      }
    }
  }, {
    key: "stop",
    value: function stop(options) {
      var serviceTree = this._selectConfigsBranch(true);

      Object.values(serviceTree).forEach(function (config) {
        if (config.isRunning) config.stop(options);
      });
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      return this._defaults;
    }
  }, {
    key: "getModels",
    value: function getModels() {
      return this._models;
    }
  }, {
    key: "_buildConfigs",
    value: function _buildConfigs(configs) {
      var _this2 = this;

      var simpleBranch = this._selectConfigsBranch();

      var results = [];

      if (!configs) {
        results = Object.values(simpleBranch).map(function (config) {
          return config.config;
        });
      } else {
        _Helper["default"].toArr(configs).forEach(function (config) {
          if (typeof config === 'string' && simpleBranch[config]) {
            results.push(simpleBranch[config].config);
          } else if (config instanceof _this2._models.getModel(false)) {
            results.push(config.config);
          } else if (config instanceof Object) {
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
      return !!this._selectConfigsBranch(isService)[id];
    }
  }, {
    key: "_selectConfigsBranch",
    value: function _selectConfigsBranch() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return isService ? this._configs.serviceConfigs : this._configs.simpleConfigs;
    }
  }, {
    key: "_initDefaultConfigs",
    value: function _initDefaultConfigs() {
      var _this3 = this;

      var defaultConfigs = this._defaults.getDefaultConfigs();

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
  }], [{
    key: "_validateId",
    value: function _validateId(id) {
      if (!_Helper["default"].isNumber(id) && !_Helper["default"].isString(id)) return false;
      if (_Helper["default"].isString(id) && id.length < 1) return false;
      return true;
    }
  }]);

  return WebpackLoader;
}();

var _default = WebpackLoader;
exports["default"] = _default;