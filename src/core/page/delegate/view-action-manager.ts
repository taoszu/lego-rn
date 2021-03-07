import { LegoViewActionType } from "../../../types/delegate";
import PageDelegateUtils from "../../../utils/page-delegate-util";
import BaseStore from "../../store/store";
import BaseEngine from "../engine/base-engine";

export default class LegoViewActionManager {
  viewId: string;
  viewType: string;
  actionTypes: LegoViewActionType[] = [];

  pageEngine: BaseEngine;

  constructor(params: {
    viewId: string;
    viewType: string;
    actionTypes: LegoViewActionType[];
    pageEngine: BaseEngine;
  }) {
    const { viewId, viewType, actionTypes, pageEngine } = params;
    this.viewId = viewId;
    this.viewType = viewType;
    this.actionTypes = actionTypes;
    this.pageEngine = pageEngine;
  }

  hasAction = (actionType?: LegoViewActionType) => {
    if (actionType && this.actionTypes) {
      return this.actionTypes.some((type) => type === actionType);
    } else {
      return false;
    }
  };

  dispatchAction(
    store: BaseStore,
    actionType?: LegoViewActionType,
    params?: any
  ) {
    if (actionType && this.hasAction(actionType)) {
      const action = PageDelegateUtils.genAction(
        actionType,
        { viewId: this.viewId, viewType: this.viewType },
        params
      );
      return this.pageEngine.pageDelegate?.dispatch(store, action);
    }
  }
}
