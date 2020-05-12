"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Config2 = _interopRequireDefault(require("./Config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ServiceConfig = /*#__PURE__*/function (_Config) {
  _inherits(ServiceConfig, _Config);

  function ServiceConfig() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ServiceConfig);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ServiceConfig).call(this, options));
    var startDefaultsGetter = options.startDefaultsGetter,
        stopDefaultsGetter = options.stopDefaultsGetter,
        startFunction = options.startFunction,
        stopFunction = options.stopFunction;
    _this.isRunning = false;
    _this.handler = null;
    _this.start = null;
    _this.stop = null;

    _this.startDefaults = function () {};

    _this.stopDefaults = function () {};

    if (startDefaultsGetter) _this.setStartDefaults({
      startDefaultsGetter: startDefaultsGetter
    });
    if (stopDefaultsGetter) _this.setStopDefaults({
      stopDefaultsGetter: stopDefaultsGetter
    });

    _this.resetStartFunction();

    _this.resetStopFunction();

    if (startFunction) _this.setStartFunction({
      startFunction: startFunction
    });
    if (stopFunction) _this.setStopFunction({
      stopFunction: stopFunction
    });
    return _this;
  }

  _createClass(ServiceConfig, [{
    key: "setStartFunction",
    value: function setStartFunction() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil === void 0 ? false : _serviceOptions$isSil;
      var startFunction = options.startFunction;

      if (typeof startFunction !== 'function') {
        if (!isSilent) console.log("setStartFunction: Wrong type of startFunction: ".concat(_typeof(startFunction)));
        return;
      }

      this.start = startFunction.bind(this);
    }
  }, {
    key: "setStopFunction",
    value: function setStopFunction() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil2 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil2 === void 0 ? false : _serviceOptions$isSil2;
      var stopFunction = options.stopFunction;

      if (typeof stopFunction !== 'function') {
        if (!isSilent) console.log("setStopFunction: wrong type of stopFunction: ".concat(_typeof(stopFunction)));
        return;
      }

      this.stop = stopFunction.bind(this);
    }
  }, {
    key: "setStartDefaults",
    value: function setStartDefaults() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil3 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil3 === void 0 ? false : _serviceOptions$isSil3;
      var startDefaults = options.startDefaults;

      if (typeof startDefaults !== 'function') {
        if (!isSilent) console.log("setStartDefaults: Wrong type of setStartDefaults: ".concat(_typeof(startDefaults)));
        return;
      }

      this.startDefaults = startDefaults.bind(this);
    }
  }, {
    key: "setStopDefaults",
    value: function setStopDefaults() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var serviceOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _serviceOptions$isSil4 = serviceOptions.isSilent,
          isSilent = _serviceOptions$isSil4 === void 0 ? false : _serviceOptions$isSil4;
      var stopDefaults = options.stopDefaults;

      if (typeof stopDefaults !== 'function') {
        if (!isSilent) console.log("setStopDefaults: Wrong type of stopDefaults: ".concat(_typeof(stopDefaults)));
        return;
      }

      this.stopDefaults = stopDefaults.bind(this);
    }
  }, {
    key: "resetStartFunction",
    value: function resetStartFunction() {
      this.start = this.startDefaults;
    }
  }, {
    key: "resetStopFunction",
    value: function resetStopFunction() {
      this.stop = this.stopDefaults;
    }
  }, {
    key: "resetToDefaults",
    value: function resetToDefaults() {
      this.stop();
      this.resetStartFunction();
      this.resetStopFunction();

      _get(_getPrototypeOf(ServiceConfig.prototype), "resetToDefaults", this).call(this);
    }
  }]);

  return ServiceConfig;
}(_Config2["default"]);

var _default = ServiceConfig;
exports["default"] = _default;