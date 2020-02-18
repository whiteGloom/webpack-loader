"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Config = _interopRequireDefault(require("./Config"));

var _ServiceConfig = _interopRequireDefault(require("./ServiceConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Models = {
  models: {
    simple: _Config["default"],
    service: _ServiceConfig["default"]
  },
  getModel: function getModel(isService) {
    return Models.models[isService ? 'service' : 'simple'];
  }
};
var _default = Models;
exports["default"] = _default;