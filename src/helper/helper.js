class helper {
  static isNumber(item) {
    return typeof item === 'number';
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
    if (!helper.isArr(item)) item = [item];
    return item;
  }

  static hasFlag(arr, flag) {
    return arr.indexOf(flag) > -1;
  }

  static flagsToObj(arr) {
    if (helper.isObj(arr) && !helper.isArr(arr)) return arr;

    const result = {};
    if (helper.isArr(arr)) {
      arr.forEach((item) => {
        result[item] = true;
      });
    }
    return result;
  }
}

export default helper;
