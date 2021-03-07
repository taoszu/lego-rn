export default class ArrayUtils {
  /**
   * 移除 func 判定结果为false的元素
   * @param arr
   * @param func
   */
  static removeFromArray(arr: any[], func: (item: any) => any) {
    return arr.filter(func).reduce((acc, val) => {
      arr.splice(arr.indexOf(val), 1);
      return acc.concat(val);
    }, []);
  }

  /**
   * 合并数组
   * @param toArray
   * @param fromArray
   */
  static pushArray(toArray: any[], fromArray: any[]) {
    fromArray.forEach((element) => {
      toArray.push(element);
    });
  }

  /**
   * 清空数组
   * @param array
   */
  static clearArray(array: any[]) {
    array.splice(0, array.length);
  }

  static isArrayNotEmpty(array?: any[]) {
    if (array && array.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  static getArrayLast(array?: any[]) {
    if (ArrayUtils.isArrayNotEmpty(array)) {
      return array![array!.length - 1];
    } else {
      return null;
    }
  }

  static isArrayEqual(
    list1: any[],
    list2: any[],
    onEqual: (item1: any, item2: any) => boolean
  ) {
    if (list1 === list2) return true;
    if ((!list1 && list2) || (list1 && !list2)) return false;
    if (list1.length !== list2.length) return false;
    for (var i = 0, n = list1.length; i < n; i++) {
      if (!onEqual(list1[i], list2[i])) return false;
    }
    return true;
  }

  static isEmptyList(list?: any[]): boolean {
    return list == null || list.length == 0;
  }
  
  static isNotEmptyList(list?: any[]): boolean {
    return !ArrayUtils.isEmptyList(list);
  }
  
}
