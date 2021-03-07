import { action, observable, ObservableMap, toJS } from "mobx";
import { getHandleDataService } from "../../..";
import { BaseLegoData, NetLegoData, ViewId } from "../../../types/type";
import ArrayUtils from "../../../utils/array-utils";
import LegoUtils from "../../../utils/lego-utils";
import StrUtils from "../../../utils/str-utils";
import ViewConfig from "../../config/view-config";
import BaseEngine from "./base-engine";

/**
 * 页面的lego数据池定义
 */
export abstract class ILegoDataPool {
  abstract parsePageLegoData: (netLegoData: NetLegoData) => any;

  abstract parseLegoData: (
    netLegoData: NetLegoData
  ) => BaseLegoData | undefined;

  abstract getLegoDatas: () => Map<ViewId, BaseLegoData>;
  abstract getPageLegoData: () => BaseLegoData | undefined;

  abstract getLegoData: <L extends BaseLegoData>(
    viewId: ViewId
  ) => L | undefined;

  @action
  resetChildren(children: ViewId[], legoData?: BaseLegoData) {
    if (legoData) {
      legoData.children = children;
    }
  }

  hasChildren(legoData?: BaseLegoData) {
    return legoData && legoData.children && legoData.children.length > 0;
  }

  @action
  pushChild(childViewId: ViewId, legoData?: BaseLegoData) {
    if (legoData && legoData.children && childViewId) {
      legoData.children.push(childViewId);
    }
  }
}

/**
 * 页面的lego数据池
 */
export default class LegoDataPool extends ILegoDataPool {
  private pageEngine: BaseEngine;

  /**
   * 保存与viewId相关的数据
   * 每个组件都从这里取出lego data
   */
  private _legoDatas: ObservableMap<ViewId, BaseLegoData> = observable.map({});

  /**
   * 页面的根lego数据
   */
  @observable
  private _pageLegoData?: BaseLegoData = undefined;

  private getViewConfig: (viewType: string) => ViewConfig | undefined;

  constructor(
    pageEngine: BaseEngine,
    getViewConfig: (viewType: string) => ViewConfig | undefined
  ) {
    super();
    this.pageEngine = pageEngine;
    this.getViewConfig = getViewConfig;
  }

  /**
   * 解析本页面的由后台返回的lego数据
   */
  parsePageLegoData = (netLegoData: NetLegoData) => {
    const viewType = netLegoData.viewType;
    const viewConfig = this.getViewConfig(viewType);
    if (!viewConfig) {
      throw `can not find the root view ${viewType}`;
    } else {
      const pageLegoData = this.parseLegoData(netLegoData);
      if (pageLegoData) {
        this.saveLegoData(pageLegoData);
      }
      this._pageLegoData = pageLegoData;
    }
  };

  /**
   *  保存lego数据时 如果之前存在数据 只做修改
   *  这样才不会导致绑定关系失效
   * @param newLegoData
   */
  saveLegoData(newLegoData: BaseLegoData) {
    let legoData = this.getLegoData(newLegoData.viewId);
    if (legoData) {
      legoData = Object.assign(toJS(legoData), newLegoData);
      this._legoDatas.set(legoData.viewId, legoData);
    } else {
      legoData = LegoUtils.genEmptyBaseLegoData();
      legoData = Object.assign(legoData, newLegoData);
      this._legoDatas.set(legoData.viewId, legoData);
    }
    return this._legoDatas.get(legoData.viewId);
  }

  /**
   * 解析由后台返回的lego数据
   */
  parseLegoData = (data: NetLegoData) => {
    const viewType = data.viewType;
    const viewConfig = this.getViewConfig(viewType);
    if (viewConfig) {
      const children = data.children;
      if (children && ArrayUtils.isArrayNotEmpty(children)) {
        let childrenData: ViewId[] = [];
        children.forEach((child) => {
          const childData = this.parseLegoData(child);
          if (childData && childData.viewId) {
            childrenData.push(childData.viewId);
          }
        });

        const legoData = this.transformData(viewConfig, data);
        if (legoData) {
          legoData.children = childrenData;
          return legoData;
        }
      } else {
        return this.transformData(viewConfig, data);
      }
    }
  };

  getLegoDatas = () => {
    return this._legoDatas;
  };

  getLegoData = <L extends BaseLegoData>(viewId: ViewId) => {
    const legoData = this._legoDatas.get(viewId);
    return legoData ? (legoData as L) : undefined;
  };

  getPageLegoData = () => {
    return this._pageLegoData;
  };


  /**
   * 对lego的data进行转换
   * 并且进行viewId的补全
   * 即如果后台返回的数据不带viewId 会生成一个唯一的viewId
   */
  private transformData = (viewConfig: ViewConfig, data: NetLegoData) => {
    if (data) {
      let legoData = LegoUtils.genEmptyBaseLegoData();
      Object.assign(legoData, data);
      if (StrUtils.isEmpty(data.viewId)) {
        legoData.viewId = LegoUtils.createViewId();
      }

      const handleDataService = getHandleDataService()
      let handleLegoDataContent = {};
      Object.keys(legoData.data).forEach((key) => {
        const value = legoData.data[key];
        const type = value?.type
        // 如果有特殊类型
        // 并且实现了数据处理的能力
        // 那么就使用转换后的值
        if (typeof type === 'string') {
          const handleResult = handleDataService?.handleCustomTypeValue(type, value)
          if (handleResult?.support) {
            Object.assign(handleLegoDataContent, { [key]: handleResult.result });
            return
          }
        }
        Object.assign(handleLegoDataContent, { [key]: value });
      });
      legoData.data = handleLegoDataContent;
      return this.saveLegoData(legoData);
    }
  };

}
