import { action, toJS } from "mobx";
import LegoHubInstance from "../../../global/lego-hub";
import { BaseLegoData, LegoViewStatus, NetLegoData, ViewId } from "../../../types/type";
import BaseLegoPageDelegate from "../delegate/base-page-delegate";
import ServiceManager from "../service/service-manager";
import { ServiceType } from "../service/type/service-type";
import LegoDataPool, { ILegoDataPool } from "./lego-data-pool";
import ViewConfigFactory from "./view-config-factory";

/**
 * 基本的页面引擎
 * 包含viewId对应数据的缓存
 */
export default abstract class BaseEngine
  extends ILegoDataPool
  implements ServiceManager {  

  private _pageId: string;
  private _pageParams?: any
  private _pageDelegate?: BaseLegoPageDelegate | null

  get pageId() {
    return this._pageId;
  }

  get pageParams() {
    return this._pageParams
  }

  get pageDelegate() {
    return this._pageDelegate
  }

  private _services = new Map<string, any>();
  private _viewConfigFactory = new ViewConfigFactory()
  private _legoDataPool = new LegoDataPool(this, this._viewConfigFactory.getViewConfig);

  constructor(params: { pageId: string; pageParams?:any }) {
    super();
    const { pageId, pageParams } = params;
    this._pageId = pageId;
    this._pageParams = pageParams
    this._pageDelegate = LegoHubInstance.genPageDelegate(pageId)
  }

  registerService = <S extends ServiceType>(
    serviceId: string,
    Service: (new () => S) | S
  ) => {
    if (typeof Service === "object") {
      this._services.set(serviceId, Service);
    } else {
      this._services.set(serviceId, new Service());
    }
  };

  getService = <S extends ServiceType>(serviceId: string) => {
    const service = this._services.get(serviceId);
    return service ? (service as S) : null;
  };

  getPageLegoData = () => {
    return this._legoDataPool.getPageLegoData();
  };

  getLegoDatas = () => {
    return this._legoDataPool.getLegoDatas();
  };

  getLegoData = <L extends BaseLegoData>(viewId: ViewId) => {
    return this._legoDataPool.getLegoData<L>(viewId);
  };

  getLegoDataContent = <L extends BaseLegoData>(viewId: ViewId) => {
    return this._legoDataPool.getLegoData<L>(viewId)?.data;
  };

  @action
  parsePageLegoData = (netLegoData: NetLegoData) => {
    this._legoDataPool.parsePageLegoData(netLegoData);
  };

  @action
  parseLegoData = (data: NetLegoData) => {
    return this._legoDataPool.parseLegoData(data);
  };

  /**
   * 修改lego组件的数据 刷新组件
   * @param viewId
   * @param dataObject
   */
  @action
  changeLegoDataContent(viewId: ViewId, dataObject: { [key: string]: any }) {
    let legoData = this.getLegoData(viewId);
    if (legoData && viewId) {
      legoData = toJS(legoData);
      Object.assign(legoData.data, dataObject);
      this.getLegoDatas().set(viewId, legoData);
    }
  }

  @action
  changeLegoViewStatus(
    viewId: ViewId,
    status: LegoViewStatus,
    errorType?: string
  ) {
    this.changeLegoDataContent(viewId, { viewStatus: status, errorType });
  }

  destroy() {
    toJS(this._legoDataPool.getLegoDatas())?.clear();
  };
}
