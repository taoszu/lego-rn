export default class ObjectUtils {
  /**
   * 对象是否不为空
   * 即存在key
   */
  static isNotEmpty(object?: any) {
    if (this.isObject(object)) {
      return Object.keys(object).length > 0;
    } else {
      return false;
    }
  }

  /**
   * 是否为对象
   * @param object
   */
  static isObject(object?: any) {
    return typeof object === "object";
  }

  /**
   * 如果对象的key的value为null undefine
   * 删掉key
   * 如 {width:null, left:"",height:100}
   * 则变为 {height:100}
   * @param object
   */
  static deleteNullValue(object?: any) {
    if (this.isObject(object)) {
      Object.keys(object).forEach((key) => {
        const value = object[key];
        if (value === null || value === undefined) {
          delete object[key];
        }
      });
    }
  }

  /**
   * 如果对象的key的value为null undefine 或者有效字符长度为0
   * 删掉key
   * 如 {width:null, left:"", height:100}
   * 则变为 {height:100}
   * @param object
   */
  static deleteEmptyValue(object?: any) {
    if (this.isObject(object)) {
      Object.keys(object).forEach((key) => {
        const value = object[key];
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim().length === 0)
        ) {
          delete object[key];
        }
      });
    }
  }
}
