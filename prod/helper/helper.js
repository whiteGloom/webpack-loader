"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var helper =
/*#__PURE__*/
function () {
  function helper() {
    _classCallCheck(this, helper);
  }

  _createClass(helper, null, [{
    key: "isNumber",
    value: function isNumber(item) {
      return typeof item === 'number';
    }
  }, {
    key: "isString",
    value: function isString(item) {
      return typeof item === 'string';
    }
  }, {
    key: "isObj",
    value: function isObj(item) {
      return _typeof(item) === 'object' && item !== null;
    }
  }, {
    key: "isArr",
    value: function isArr(item) {
      return Array.isArray(item);
    }
  }, {
    key: "toArr",
    value: function toArr(item) {
      if (!helper.isArr(item)) item = [item];
      return item;
    }
  }, {
    key: "hasFlag",
    value: function hasFlag(arr, flag) {
      return arr.indexOf(flag) > -1;
    }
  }, {
    key: "flagsToObj",
    value: function flagsToObj(arr) {
      if (helper.isObj(arr) && !helper.isArr(arr)) return arr;
      var result = {};

      if (helper.isArr(arr)) {
        arr.forEach(function (item) {
          result[item] = true;
        });
      }

      return result;
    }
  }]);

  return helper;
}();

var _default = helper;
exports["default"] = _default;