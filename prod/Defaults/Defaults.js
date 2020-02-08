"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _colors = _interopRequireDefault(require("colors"));

var _helper = _interopRequireDefault(require("../helper/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Defaults = {
  devServerConfigId: 'devServer',
  watchConfigId: 'watch',
  getSimpleConfigDefaults: function getSimpleConfigDefaults(_ref) {
    var mode = _ref.mode;
    if (!_helper["default"].isString(mode)) mode = 'development';
    return {
      mode: mode,
      entry: {},
      output: {},
      module: {
        rules: []
      },
      plugins: [],
      optimization: {},
      resolve: {}
    };
  },
  getNativeHandler: function getNativeHandler(_ref2) {
    var _this = this;

    var callback = _ref2.callback;
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
      start: function start(configured, _ref3) {
        var callback = _ref3.callback;
        this.handler = configured.watch(this.config, _helper["default"].getNativeHandler({
          callback: callback
        }));
      },
      stop: function stop(_ref4) {
        var callback = _ref4.callback;
        if (typeof callback !== 'function') callback = function callback() {};
        this.handler.close(callback);
        this.handler = null;
      }
    };
  },
  getDevServerServicePreset: function getDevServerServicePreset() {
    return {
      start: function start(configured, _ref5) {
        var port = _ref5.port,
            callback = _ref5.callback;

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
      stop: function stop(_ref6) {
        var callback = _ref6.callback;
        if (typeof callback !== 'function') callback = function callback() {};
        this.handler.stop(callback);
        this.handler = null;
      }
    };
  }
};
var _default = Defaults;
exports["default"] = _default;