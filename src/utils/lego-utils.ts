import { toJS } from "mobx";
import { BaseLegoData, NetLegoData } from "../types/type";

export default class LegoUtils {
  static createViewId = () => {
    // 生成唯一 view id
    return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 8)}`;
  };

  /**
   * 通过一个模版的视图数据  重新生成一个新的数据
   * 主要是为了进行viewId的替换
   * FlatList tabContainer 动态生成视图
   * 需要使用此特性
   * @param templateData
   */
  static genLegoDataFromTemplate: (
    templateData?: NetLegoData
  ) => undefined | NetLegoData = (templateData?: NetLegoData) => {
    if (!templateData) {
      return;
    }
    const replaceViewId = (data: NetLegoData) => {
      const newViewId = LegoUtils.createViewId();
      const oldViewId = data.viewId;
      if (oldViewId) {
        templateStr = templateStr.replace(oldViewId, newViewId);
      }
    };
    const changeViewId = (data: NetLegoData) => {
      replaceViewId(data);
      data.children?.forEach((child) => {
        replaceViewId(child);
        changeViewId(child);
      });
    };

    // 先转换为json
    // 遍历json的viewId
    // 找到之后 替换原字符串的viewId
    // 遍历结束 使用替换后的字符串转为新的lego data
    let templateStr = JSON.stringify(toJS(templateData));
    let newLegoData = JSON.parse(templateStr);
    changeViewId(newLegoData);
    newLegoData = JSON.parse(templateStr);
    return newLegoData;
  };

  static genEmptyBaseLegoData(): BaseLegoData {
    return { viewType: "", viewId: "", children: [], data: {} };
  }

  /**
   * 在DEV条件下
   * 框架打印日志
   * @param params 打印的内容
   * @param tag 打印的tag
   */
  static legoLog(params?: any, tag?: any) {
    if (__DEV__ && params) {
      let seen: any[] = [];
      const message =
        typeof params === "object"
          ? JSON.stringify(params, (key, val) => {
              if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                  return;
                }
                seen.push(val);
              }
              return val;
            })
          : params;
      console.log(`lego -- ${tag ?? ""} `, message);
    }
  }

  static safeCallFunc(func?: () => any) {
    typeof func === "function" && func();
  }
}
