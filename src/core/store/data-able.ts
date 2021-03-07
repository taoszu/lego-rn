import { action, toJS } from "mobx";
import { BaseLegoData, LegoViewStatus } from "../../types/type";
import BaseEngine from "../page/engine/base-engine";

/**
 * 数据的能力
 */
export interface IDataAble<L extends BaseLegoData> {
  getLegoDataContent: () => L["data"];
  getLegoDataBinding: () => L["dataBinding"];

  getLegoData: () => L | undefined;
  changeLegoDataContent: (dataObject: { [key: string]: any }) => any;
  changeLegoViewStatus: (status: LegoViewStatus, errorType?: string) => any;
}

export default class DataManager<L extends BaseLegoData>
  implements IDataAble<L> {
  private pageEngine: BaseEngine;
  private viewId: string = "";

  constructor(params: { pageEngine: BaseEngine; viewId: string }) {
    const { pageEngine, viewId } = params;
    this.pageEngine = pageEngine;
    this.viewId = viewId;
  }

  getLegoDataContent() {
    return this.getLegoData()?.data ?? {};
  }

  getLegoDataBinding() {
    return this.getLegoData()?.dataBinding ?? {};
  }

  getLegoData() {
    return this.pageEngine.getLegoData<L>(this.viewId);
  }

  /**
   * 修改lego组件的数据的data部分的某些属性值
   * @param dataObject
   */
  @action
  changeLegoDataContent(dataObject: { [key: string]: any }) {
    if(typeof dataObject !== 'object') {
      return
    }
    
    let legoData = this.getLegoData();
    const viewId = this.viewId;
    if (legoData && viewId) {
      legoData = toJS(legoData);
      Object.assign(legoData.data, dataObject);
      this.pageEngine.getLegoDatas().set(this.viewId, legoData);
    }
  }

  /**
   * 修改lego的视图状态
   * @param status
   * @param errorType
   */
  @action
  changeLegoViewStatus(status: LegoViewStatus, errorType?: string) {
    this.changeLegoDataContent({ viewStatus: status, errorType });
  }
}
