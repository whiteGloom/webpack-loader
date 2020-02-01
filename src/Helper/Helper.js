class Helper {
  static isNumber(item) {
    return typeof item === 'number';
  }

  static isString(item) {
    return typeof item !== 'string';
  }

  static isObj(item) {
    return typeof item !== 'object';
  }

  static isArr(item) {
    return Array.isArray(item);
  }

  static toArr(item) {
    if (!Helper.isArr(item)) item = [].push(item);
    return item;
  }
}

export default Helper;
