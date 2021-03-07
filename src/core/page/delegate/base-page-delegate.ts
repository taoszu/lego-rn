import { InterceptResult, LegoViewAction } from "../../../types/delegate";
import LegoUtils from "../../../utils/lego-utils";
import BaseStore from "../../store/store";
import { ViewStatusParams } from "../service/type/handle-view-service";

/**
 * 基础的页面代理类
 * 负责分发事件
 */
export default abstract class BaseLegoPageDelegate {
  pageId = "";
  storeMap: Map<string, BaseStore> = new Map();

  dispatch = (store: BaseStore, action?: LegoViewAction) => {
    if (!action || !action.viewId) {
      return;
    }
    const { type, viewId } = action;

    const firstToUpper = (str: string) => {
      return str.replace(/^\S/, (s) => s.toUpperCase());
    };

    try {
      /**
       * 执行的函数名 = viewId + On + 类型的驼峰
       */
      const funName = `on${firstToUpper(viewId)}${type}`;
      const result = eval(
        "this." + funName + "(" + JSON.stringify(action) + ")"
      );
      LegoUtils.legoLog(action, funName);
      return result;
    } catch (error) {
      if (error) {
        LegoUtils.legoLog(error, "delegate dispatch action error");
      }
    }
  };

  abstract interceptViewStatus(params:ViewStatusParams): InterceptResult

}
