"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _Helper = _interopRequireDefault(require("./Helper"));

var _Defaults = _interopRequireDefault(require("./service/Defaults"));

var _Config = _interopRequireDefault(require("./models/Config"));

var _ServiceConfig = _interopRequireDefault(require("./models/ServiceConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    this._configs = {
      simpleConfigs: {},
      serviceConfigs: {}
    };
    this._models = {
      Simple: _Config["default"],
      Service: _ServiceConfig["default"]
    };
  }

  _createClass(WebpackLoader, [{
    key: "makeNewConfig",
    value: function makeNewConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isFor = serviceOptions.isForced,
          isForced = _serviceOptions$isFor === void 0 ? false : _serviceOptions$isFor,
          _serviceOptions$isSil = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil === void 0 ? false : _serviceOptions$isSil;
      var id = options.id,
          _options$configData = options.configData,
          configData = _options$configData === void 0 ? {} : _options$configData,
          userPreset = options.preset,
          _options$isService = options.isService,
          isService = _options$isService === void 0 ? false : _options$isService;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error("makeNewConfig: Wrong ID passed: ".concat(id));
        return;
      }

      if (this._isUsed(id, isService) && !isForced) {
        if (!isSilent) console.error("makeNewConfig: That ID is already in use: ".concat(id));
        return;
      }

      var ConfigModel = this._selectConfigModel(isService);

      var branch = this._selectConfigsBranch(isService);

      var preset = userPreset || this._defaults.getPreset({
        id: id,
        isService: isService
      });

      branch[id] = new ConfigModel(_objectSpread(_objectSpread({}, preset), configData));
      return branch[id];
    }
  }, {
    key: "getConfig",
    value: function getConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil2 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil2 === void 0 ? false : _serviceOptions$isSil2;
      var id = options.id,
          _options$isService2 = options.isService,
          isService = _options$isService2 === void 0 ? false : _options$isService2;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error("getConfig: Wrong ID passed: ".concat(id));
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
    value: function getConfigs() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _options$isService3 = options.isService,
          isService = _options$isService3 === void 0 ? false : _options$isService3;
      return this._selectConfigsBranch(isService);
    }
  }, {
    key: "removeConfig",
    value: function removeConfig() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil3 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil3 === void 0 ? false : _serviceOptions$isSil3;
      var id = options.id,
          _options$isService4 = options.isService,
          isService = _options$isService4 === void 0 ? false : _options$isService4;

      if (!WebpackLoader._validateId(id)) {
        if (!isSilent) console.error("removeConfig: Wrong ID passed: ".concat(id));
        return;
      }

      if (!this._isUsed(id, isService)) {
        return;
      }

      var branch = this._selectConfigsBranch(isService);

      if (isService && branch[id].isRunning) branch[id].stop();
      delete branch[id];
    }
  }, {
    key: "removeConfigs",
    value: function removeConfigs() {
      this._configs.simpleConfigs = {};
      this.stop();
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
              id: config,
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
    value: function stop() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var stopOptions = options.stopOptions;

      var serviceTree = this._selectConfigsBranch(true);

      Object.values(serviceTree).forEach(function (config) {
        if (config.isRunning) config.stop(stopOptions);
      });
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      return this._defaults;
    }
  }, {
    key: "getSimpleConfigModel",
    value: function getSimpleConfigModel() {
      return this._models.Simple;
    }
  }, {
    key: "getServiceConfigModel",
    value: function getServiceConfigModel() {
      return this._models.Service;
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
          } else if (config instanceof _this2._selectConfigModel()) {
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
      return !!this._selectConfigsBranch(isService)[id];
    }
  }, {
    key: "_selectConfigsBranch",
    value: function _selectConfigsBranch() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return isService ? this._configs.serviceConfigs : this._configs.simpleConfigs;
    }
  }, {
    key: "_selectConfigModel",
    value: function _selectConfigModel() {
      var isService = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (isService) {
        return this.getServiceConfigModel();
      }

      return this.getSimpleConfigModel();
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