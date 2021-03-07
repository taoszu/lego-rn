import { LegoViewActionType } from "../../types/delegate";
import { DispatchAction } from "../../types/type";
import LegoViewActionManager from "../page/delegate/view-action-manager";
import BaseEngine from "../page/engine/base-engine";
import BaseStore from "./store";

/**
 * 事件分发的能力
 */
export interface IActionAble {
  /**
   * 分发事件
   */
  dispatchAction: (params: {
    store: BaseStore;
    actionType?: LegoViewActionType;
    params?: any;
  }) => any;

  /**
   * 是否有分发事件
   */
  hasDispatchAction: (actionType?: LegoViewActionType) => any;
}

export default class ActionManager implements IActionAble {
  private pageEngine: BaseEngine;
  private viewId: string = "";
  private viewActionManager: LegoViewActionManager;

  constructor(params: {
    pageEngine: BaseEngine;
    viewId: string;
    viewType?: string;
    dispatchAction?: DispatchAction;
  }) {
    const { pageEngine, viewId, viewType, dispatchAction } = params;
    this.pageEngine = pageEngine;
    this.viewId = viewId;
    this.viewActionManager = new LegoViewActionManager({
      viewId: this.viewId,
      viewType: viewType ?? "",
      actionTypes: dispatchAction?.actionTypes ?? [],
      pageEngine: this.pageEngine,
    });
  }

  /**
   * 事件分发
   * @param params
   */
  dispatchAction(params: {
    store: BaseStore;
    actionType?: LegoViewActionType;
    actionParams?: any;
  }): any {
    const { actionType, actionParams, store } = params;
    return this.viewActionManager.dispatchAction(
      store,
      actionType,
      actionParams
    );
  }

  hasDispatchAction(actionType?: LegoViewActionType): any {
    return this.viewActionManager.hasAction(actionType);
  }
}
