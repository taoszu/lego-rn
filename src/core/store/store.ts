import { currentPageEngine } from "../../apis/page";
import { LegoViewActionType } from "../../types/delegate";
import { BaseLegoData, FetchNetParams, LegoViewProps, LegoViewStatus, ViewId } from "../../types/type";
import BaseEngine from "../page/engine/base-engine";
import { EventParams } from "../page/service/type/event-emiter-service";
import ActionManager, { IActionAble } from "./action-able";
import DataManager, { IDataAble } from "./data-able";
import EventManager, { IEventAble } from "./event-able";
import NetManager, { INetAble } from "./net-able";

/**
 * Store的基类
 * 有事件通讯 业务配置 lego数据处理等能力
 */
export default class BaseStore<L extends BaseLegoData = BaseLegoData>
  implements IActionAble, IDataAble<L>, INetAble, IEventAble {
  private _pageEngine?: BaseEngine | null = undefined;
  private _viewId: ViewId = "";

  // 事件通讯
  private _actionManager: IActionAble;
  // 数据处理
  private _dataManager: IDataAble<L>;
  private _netManager: INetAble;
  private _eventManager: IEventAble;

  constructor(props: LegoViewProps) {
    const {viewId } = props;
    const pageEngine = currentPageEngine()
    this._pageEngine = pageEngine;
    if(!pageEngine) {
      throw new Error("ASSERT: " + "pageEngine is invliad")
    }

    this._viewId = viewId;
    this._dataManager = new DataManager({
      pageEngine,
      viewId,
    });

    const { viewType, dispatchAction } = this.getLegoData() ?? {};
    this._actionManager = new ActionManager({
      pageEngine,
      viewId,
      viewType,
      dispatchAction,
    });
    this._netManager = new NetManager(this);
    this._eventManager = new EventManager(this)
  }

  get pageEngine() {
    return this._pageEngine!!;
  }

  get pageDelegate() {
    return this._pageEngine?.pageDelegate
  }

  get viewId() {
    return this._viewId;
  }

  get viewType() {
    return this.getLegoData() ?.viewType ?? "";
  }

  getLegoDataContent(): L["data"] {
    return this._dataManager.getLegoDataContent();
  }

  getLegoDataBinding() {
    return this._dataManager.getLegoDataBinding();
  }

  getLegoData() {
    return this._dataManager.getLegoData();
  }

  changeLegoDataContent(dataObject: { [key: string]: any }) {
    this._dataManager.changeLegoDataContent(dataObject);
  }

  changeLegoViewStatus(status: LegoViewStatus, errorType?: string) {
    this._dataManager.changeLegoViewStatus(status, errorType);
  }

  get children() {
    return this._dataManager.getLegoData()?.children ?? [];
  }

  dispatchAction(params: {
    actionType?: LegoViewActionType;
    actionParams?: any;
  }): any {
    const wrapParams = { ...params, store: this };
    return this._actionManager.dispatchAction(wrapParams);
  }

  hasDispatchAction(actionType?: LegoViewActionType) {
    return this._actionManager.hasDispatchAction(actionType);
  }

  fetch = (params: FetchNetParams) => {
    return this._netManager.fetch(params);
  };

  getNetFetchConfig = () => {
    return this._netManager.getNetFetchConfig();
  };

  fetchWithConfig = (callBack?: {
    successCallBack?: (res: any) => void,
    failedCallBack?: (e: any) => void
  }, netOptions?: any) => {
    this._netManager.fetchWithConfig(callBack, netOptions);
  }

  emitEvent<T>(params: EventParams<T>) {
    this._eventManager.emitEvent(params)
  }

  unListenAll() {
    this._eventManager.unListenAll()
  }

  eventName() {
    return this._eventManager.eventName()
  }
}
