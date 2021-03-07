import { LegoViewActionType, LegoViewAction } from "../types/delegate";

export interface ActionData {
  viewId: string;
  viewType: string;
}

export default class PageDelegateUtils {
  static genDidMountAction(actionData: ActionData, params?: any) {
    return PageDelegateUtils.genAction(
      LegoViewActionType.didMount,
      actionData,
      params
    );
  }

  static genWillUnMountAction(actionData: ActionData, params?: any) {
    return PageDelegateUtils.genAction(
      LegoViewActionType.willUnmount,
      actionData,
      params
    );
  }

  static genClickAction(actionData: ActionData, params?: any) {
    return PageDelegateUtils.genAction(
      LegoViewActionType.click,
      actionData,
      params
    );
  }

  static genLongPressAction(actionData: ActionData, params?: any) {
    return PageDelegateUtils.genAction(
      LegoViewActionType.click,
      actionData,
      params
    );
  }

  static genAction(
    type: LegoViewActionType,
    actionData: ActionData,
    params?: any
  ): LegoViewAction | undefined {
    const { viewId, viewType } = actionData;
    if (viewId && viewType && type) {
      return {
        viewId,
        viewType,
        type,
        params,
      };
    }
  }
  
}
