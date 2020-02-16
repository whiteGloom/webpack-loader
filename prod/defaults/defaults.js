"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _colors = _interopRequireDefault(require("colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaults = {
  devServerConfigId: 'devServer',
  watchConfigId: 'watch',
  getSimpleConfigDefaults: function getSimpleConfigDefaults() {
    return function () {
      return {
        mode: 'development',
        entry: {},
        output: {},
        module: {
          rules: []
        },
        plugins: [],
        optimization: {},
        resolve: {}
      };
    };
  },
  getNativeHandler: function getNativeHandler() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = options.callback,
        _options$processName = options.processName,
        processName = _options$processName === void 0 ? 'Webpack' : _options$processName;
    return function (err, stats) {
      var hasErrors = false;
      var hasWarnings = false;

      if (err) {
        console.error(err.stack || err);
        if (err.details) console.error(err.details);
        hasErrors = true;
      } else {
        var info = stats.toJson();

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
          hasWarnings = true;
        }

        if (stats.hasErrors()) {
          console.error(info.errors);
          hasErrors = true;
        }
      }

      if (!hasErrors) {
        if (hasWarnings) {
          console.log(_colors["default"].red.underline("\n".concat(processName, ": compiled with warnings!\n")));
        } else {
          console.log(_colors["default"].green.underline("\n".concat(processName, ": compiled successfully.\n")));
        }

        if (typeof callback === 'function') callback(stats, true);
      } else {
        if (hasErrors) console.log(_colors["default"].red.underline("\n".concat(processName, ": compilation failed!\n")));
        if (_this.watcher) _this.watcher = null;
        if (typeof callback === 'function') callback(stats, false);
      }
    };
  },
  getWatchServicePreset: function getWatchServicePreset() {
    return {
      start: function start(configured) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var callback = options.callback;
        this.handler = configured.watch(this.config, defaults.getNativeHandler({
          processName: defaults.watchConfigId,
          callback: callback
        }));
      },
      stop: function stop() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = options.callback;
        if (typeof callback !== 'function') callback = function callback() {};
        this.handler.close(callback);
        console.log(_colors["default"].yellow.underline("\n".concat(defaults.watchConfigId, ": compilation was stopped.\n")));
        this.handler = null;
      }
    };
  },
  getDevServerServicePreset: function getDevServerServicePreset() {
    return {
      start: function start(configured) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var _options$port = options.port,
            port = _options$port === void 0 ? 8080 : _options$port,
            callback = options.callback;

        function devServerHandler(err) {
          if (!err) {
            console.log(_colors["default"].green.underline("\nDevServer: opened on http://localhost:".concat(port, "\n")));
          } else {
            console.error(err);
            console.log(_colors["default"].red.underline('\nDevServer: can not be opened!\n'));
          }

          if (typeof callback === 'function') callback(err);
        }

        this.handler = new _webpackDevServer["default"](configured, this.config);
        this.handler.listen(port, '127.0.0.1', devServerHandler);
      },
      stop: function stop() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = options.callback;
        if (typeof callback !== 'function') callback = function callback() {};
        this.handler.close(callback);
        console.log(_colors["default"].yellow.underline("\n".concat(defaults.devServerConfigId, ": compilation was stopped.\n")));
        this.handler = null;
      }
    };
  }
};
var _default = defaults;
exports["default"] = _default;