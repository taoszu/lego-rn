import { autorun, IReactionDisposer } from "mobx";
import React from "react";
import { getBaseService, getStorageService } from "../..";
import { renderByData } from "../../apis/view-builder";
import LegoHubInstance from "../../global/lego-hub";
import LegoUtils from "../../utils/lego-utils";
import ViewConfig from "../config/view-config";
import PageEngine from "./engine/page-engine";


/**
 * 页面级别的lego组件
 * 要配置
 * 1. 需要注册的组件
 * 2. 该页面的lego数据
 *
 *  ⚠️ 不能重写以下函数
 *  render
 *  componentWillUnmount
 *  componentDidMount
 */
export default abstract class BasePageView<
  P = {},
  E extends PageEngine = PageEngine
  > extends React.Component<P> {

  private pageId: string;
  private pageParams?: any;

  pageEngine: E | PageEngine;
  disposer?: IReactionDisposer;

  constructor(
    props: P,
    params: {
      pageId: string;
      pageParams?: any
    },
    PageEngineType: { new(...args: any): E }
  ) {
    super(props);
    const { pageId, pageParams } = params;
    this.pageId = pageId;
    this.pageParams = pageParams;

    if (PageEngineType) {
      this.pageEngine = new PageEngineType(params);
    } else {
      this.pageEngine = new PageEngine(params);
    }
  }

  componentDidMount() {
    this.init();
    LegoUtils.safeCallFunc(this.pageDidMount);
  }

  componentWillUnmount() {
    this.disposer && this.disposer();
    LegoUtils.safeCallFunc(this.pageWillUnmount);
    this.pageEngine?.destroy();
  }

  private init = () => {
    this.registerComponents();
    this.refreshPage();
    /**
     * 监听页面数据变化
     */
    this.disposer = autorun(() => {
      // 持有被观察的变量
      // 将变量和视图绑定
      const legoPageData = this.pageEngine.getPageLegoData();
      LegoUtils.legoLog(legoPageData, "page data did change");
      if (legoPageData) {
        // 强制刷新
        this.setState({}, () => {
          LegoUtils.safeCallFunc(this.pageDataDidChange);
        });
      }
    });
  };

  /**
   * 如果需要刷新页面数据
   * 需要主动调用
   */
  async refreshPage () {
    const storageService = getStorageService()
    const baseService = getBaseService()
    if (!baseService) {
      LegoUtils.legoLog('base service should not be empty', 'lego')
      return
    }


    const version = baseService?.appVersionCode?.() ?? 0;
    const { pageId } = this;

    let storageDataId;
    let storagePageData;
    try {
      if (storageService) {
        // 如果实现了缓存服务
        // 则取出页面数据和id
        const storageData = await storageService.get(pageId);
        if (storageData) {
          storagePageData = storageData.pageLegoData;
          storageDataId = storageData.dataId;
        }
      }
      /**
       * 请求参数 =  dataId + version + pageId
       * 如果dataId与后台数据在当前version下最新的dataId一致，则说明数据无更新，直接使用本地
       * 如果不一致，直接返回当前version下最新的数据，刷新本地数据
       */
      const pageLegoData = await baseService.getPageLegoData?.({
        dataId: storageDataId,
        pageId,
        version,
      });

      if (pageLegoData) {
        const { isUpdate, data, id } = pageLegoData;
        // 更新本地颜色值
        //  LegoHubInstance.configColorList = colourList;

        if (isUpdate) {
          const dataId = id;
          const pageData = data;
          if (dataId && pageData) {
            // 缓存页面数据
            storageService?.set(pageId, { dataId, pageLegoData: pageData });
            this.pageEngine.parsePageLegoData(pageData);
          }
        } else {
          if (storagePageData) {
            this.pageEngine.parsePageLegoData(storagePageData);
          }
        }
      }
    } catch (error) { }
  };

  private registerComponents = () => {
    const componentConfigs = this.shouldRegisteredComponents();
    componentConfigs?.forEach((ConfigCreator) => {
      LegoHubInstance.registerViewConfig(
        ConfigCreator,
      );
    });
  };

  /**
   * 该页面需要注册的组件
   */
  shouldRegisteredComponents: () => {
    new(...args: any): ViewConfig;
  }[] = () => {
    return [];
  };

  /**
   * 页面加载完成 只调用一次
   */
  pageDidMount() { };

  /**
   * 页面即将卸载 只调用一次
   */
  pageWillUnmount() { };

  /**
   * lego数据改变回调
   */
  pageDataDidChange() { };

  render() {
    LegoUtils.legoLog("render page view");
    return renderByData(this.pageEngine.getPageLegoData());
  }
}
