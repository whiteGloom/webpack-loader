"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Webpack = _interopRequireDefault(require("Webpack"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _Server = _interopRequireDefault(require("./node_modules/webpack-dev-server/lib/Server.js"));

var _colors = _interopRequireDefault(require("colors"));

var _defaultConfig = _interopRequireDefault(require("./src/defaultConfig.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebpackLoader =
/*#__PURE__*/
function () {
  function WebpackLoader(options) {
    _classCallCheck(this, WebpackLoader);

    options = _typeof(options) === "object" ? options : {};
    this.configs = {};
    this.devServerConfig = {};
    this.watchConfig = {};
  }

  _createClass(WebpackLoader, [{
    key: "makeNewConfig",
    value: function makeNewConfig(id, config, mode) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      if (typeof mode !== "string") {
        mode = "development";
      }

      this.configs[id] = (0, _webpackMerge["default"])([(0, _defaultConfig["default"])(mode), config]);
    }
  }, {
    key: "addToConfig",
    value: function addToConfig(id, config) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      this.configs[id] = (0, _webpackMerge["default"])([this.configs[id], config]);
    }
  }, {
    key: "removeFromConfig",
    value: function removeFromConfig(id, config) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      delete this.configs[id][config];
    }
  }, {
    key: "getConfigForEdit",
    value: function getConfigForEdit(id) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      return this.configs[id];
    }
  }, {
    key: "getConfig",
    value: function getConfig(id) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      return Object.assign({}, this.configs[id]);
    }
  }, {
    key: "getConfigs",
    value: function getConfigs() {
      return Object.assign({}, this.configs);
    }
  }, {
    key: "removeConfig",
    value: function removeConfig(id) {
      if (typeof id !== "number" && typeof id !== "string") {
        console.log("Wrong identificator: " + id);
        return;
      }

      delete this.configs[id];
    }
  }, {
    key: "addToDevServerConfig",
    value: function addToDevServerConfig(config) {
      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      this.devServerConfig = (0, _webpackMerge["default"])([this.devServerConfig, config]);
    }
  }, {
    key: "removeFromDevServerConfig",
    value: function removeFromDevServerConfig(config) {
      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      delete this.devServerConfig[config];
    }
  }, {
    key: "getDevServerConfig",
    value: function getDevServerConfig() {
      return Object.assign({}, this.devServerConfig);
    }
  }, {
    key: "getDevServerConfigForEdit",
    value: function getDevServerConfigForEdit() {
      return this.devServerConfig;
    }
  }, {
    key: "addToWatchConfig",
    value: function addToWatchConfig(config) {
      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      this.watchConfig = (0, _webpackMerge["default"])([this.watchConfig, config]);
    }
  }, {
    key: "removeFromWatchConfig",
    value: function removeFromWatchConfig(config) {
      if (_typeof(config) !== "object") {
        console.log("Wrong config: " + config);
        return;
      }

      delete this.watchConfig[config];
    }
  }, {
    key: "getWatchConfig",
    value: function getWatchConfig() {
      return Object.assign({}, this.watchConfig);
    }
  }, {
    key: "getWatchConfigForEdit",
    value: function getWatchConfigForEdit() {
      return this.watchConfig;
    }
  }, {
    key: "_buildConfigs",
    value: function _buildConfigs() {
      var prodConfigs = [];

      for (var config in this.configs) {
        prodConfigs.push(this.configs[config]);
      }

      return prodConfigs;
    }
  }, {
    key: "run",
    value: function run() {
      var webpackConfigured = (0, _Webpack["default"])(this._buildConfigs());
      webpackConfigured.run(handler);

      function handler(err, stats) {
        var hasErrors = false;

        if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
          console.log(stats.compilation.errors);
          console.log(_colors["default"].red.underline("\n\nCompiled with errors!\n\n"));
          hasErrors = true;
        }

        if (err) {
          console.log(err);
          console.log(_colors["default"].red.underline("\n\nCompiled with errors!\n\n"));
          hasErrors = true;
        }

        if (hasErrors !== true) {
          console.log(_colors["default"].green.underline("\n\nCompiled successfully.\n\n"));
          if (typeof callback == "function") callback(stats);
        }
      }
    }
  }, {
    key: "runWatch",
    value: function runWatch() {
      var webpackConfigured = (0, _Webpack["default"])(this._buildConfigs());
      webpackConfigured.watch(this.watchConfig, handler);

      function handler(err, stats) {
        var hasErrors = false;

        if (stats && stats.compilation && stats.compilation.errors.length !== 0) {
          console.log(stats.compilation.errors);
          console.log(_colors["default"].red.underline("\n\nCompiled with errors!\n\n"));
          hasErrors = true;
        }

        if (err) {
          console.log(err);
          console.log(_colors["default"].red.underline("\n\nCompiled with errors!\n\n"));
          hasErrors = true;
        }

        if (hasErrors !== true) {
          console.log(_colors["default"].green.underline("\nCompiled successfully."));
          if (typeof callback == "function") callback(stats);
        }
      }
    }
  }, {
    key: "runDevServer",
    value: function runDevServer(port) {
      if (typeof port !== "number") port = 8080;
      var webpackConfigured = (0, _Webpack["default"])(this._buildConfigs());
      var devServer = new _Server["default"](webpackConfigured, this.devServerConfig);
      devServer.listen(port, "127.0.0.1", function () {
        console.log("Starting server on http://localhost:" + port);
      });
    }
  }]);

  return WebpackLoader;
}();

var _default = WebpackLoader;
exports["default"] = _default;
