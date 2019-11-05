"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function makeDefaultConfig(mode) {
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
}

;
var _default = makeDefaultConfig;
exports["default"] = _default;