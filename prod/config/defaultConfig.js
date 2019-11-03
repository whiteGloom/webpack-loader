"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function makeDefaultConfig(mode) {
  var config = {
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
  return config;
}

;
var _default = makeDefaultConfig;
exports["default"] = _default;