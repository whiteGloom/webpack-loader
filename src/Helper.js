class Helper {
  static isNumber(item) {
    return Number.isFinite(item);
  }

  static isString(item) {
    return typeof item === 'string';
  }

  static isObj(item) {
    return typeof item === 'object' && item !== null;
  }

  static isArr(item) {
    return Array.isArray(item);
  }

  static toArr(item) {
    if (!Helper.isArr(item)) item = [item];
    return item;
  }

  static hasFlag(arr, flag) {
    return arr.indexOf(flag) > -1;
  }
}

export default Helper;
