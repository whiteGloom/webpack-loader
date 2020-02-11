"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _colors = _interopRequireDefault(require("colors"));

var _helper = _interopRequireDefault(require("../helper/helper"));

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
    var callback = options.callback;
    return function (err, stats) {
      var hasErrors = false;

      if (err) {
        console.error(err.stack || err);
        if (err.details) console.error(err.details);
        hasErrors = true;
      } else {
        var info = stats.toJson();
        if (stats.hasWarnings()) console.warn(info.warnings);

        if (stats.hasErrors()) {
          console.error(info.errors);
          hasErrors = true;
        }
      }

      if (hasErrors !== true) {
        console.log(_colors["default"].green.underline('\n\nCompiled successfully.\n\n'));
        if (typeof callback === 'function') callback(stats, true);
      } else {
        console.log(_colors["default"].red.underline('\n\nCompiled with errors!\n\n'));
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
        this.handler = configured.watch(this.config, _helper["default"].getNativeHandler({
          callback: callback
        }));
      },
      stop: function stop() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = options.callback;
        if (typeof callback !== 'function') callback = function callback() {};
        this.handler.close(callback);
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
            console.log(_colors["default"].green.underline("\n\nServer opened on http://localhost:".concat(port, "\n\n")));
          } else {
            console.error(err);
            console.log(_colors["default"].red.underline('\n\nDevServer has errors!\n\n'));
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
        this.handler.stop(callback);
        this.handler = null;
      }
    };
  }
};
var _default = defaults;
exports["default"] = _default;