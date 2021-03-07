import objectPath from "object-path";
import { getBaseService } from "../..";
import { DataBindingItem, FetchNetParams } from "../../types/type";
import ArrayUtils from "../../utils/array-utils";
import BaseStore from "./store";

  
  /** 
   * 网络请求的能力
   */
  export interface INetAble {
    /**
     * 发起网络请求的钩子
     * 接入lego的平台方 需要自行实现
     */
    fetch: (
      params: FetchNetParams
    ) => Promise<any> | undefined;

    /**
     * 获取网络配置
     * 包括接口url 参数params
     */
    getNetFetchConfig: () =>
      | undefined
      | { url: string; params: { [key: string]: any } };

    /**
     * 使用网络配置发出请求
     * 包括url，参数绑定
     */
    fetchWithConfig: (callBack?:{
      successCallBack?: (res:any)=>void,
      failedCallBack?: (e:any) => void
    }, netOptions?:any) => any;
  }

  export default class NetManager implements INetAble {
    store: BaseStore;

    constructor(baseStore: BaseStore) {
      this.store = baseStore;
    }

    fetch(params: FetchNetParams) {
      return getBaseService()?.fetchWithNet(params)
    };

    /**
     * 取出绑定来源的数据
     * @param dataBindingItem
     */
    private getDataBindingData = (dataBindingItem: DataBindingItem) => {
      if (ArrayUtils.isNotEmptyList(dataBindingItem?.path)) {
        const from = dataBindingItem.from;
        const pageEngine = this.store.pageEngine
        let fromLegoData;
        // 如果没有指定来源
        // 默认取根数据
        if (from) {
          fromLegoData = pageEngine.getLegoData(from)?.data;
        } else {
          fromLegoData = pageEngine.getPageLegoData()?.data;
        }
        return fromLegoData;
      }
    };

    /**
     * 网络请求的参数配置
     * 支持两种模式
     * 1. 直接配置key-value
     * 2. 配置数据绑定路径 value从指定数据源获取
     */
    getNetFetchConfig = () => { 
      const netConfig = this.store.getLegoData()?.netConfig;
      if (netConfig) { 
        let fetchParams = {};

        const url = netConfig.url;
        const params = netConfig.params;
        params.forEach((item) => {
          const fromLegoData = this.getDataBindingData(item.dataBinding);
          let value: any;
          if (fromLegoData) {
            value = objectPath.get(fromLegoData, item.dataBinding.path);
          } else {
            value = item.value
          }
          Object.assign(fetchParams, {
            [item.key]: value,
          });
        });
        return { url, params: fetchParams };
      }
    };

    /**
     * 通过网络配置发出网络请求
     * @param params 
     * @param netOptions 
     */
    fetchWithConfig = async (params?:{
      successCallBack?: (res:any)=>void,
      failedCallBack?: (e?:any) => void
    }, netOptions?:any) => {
      const {successCallBack, failedCallBack} = params ?? {}
      const netConfig = this.getNetFetchConfig();
      if (netConfig) {
        const { params, url } = netConfig;
        try {
          const netResponse = await this.fetch({url, params, netOptions});
          if (netResponse) {
            this.store.changeLegoDataContent(netResponse);
            successCallBack?.(netResponse);
            return netResponse;
          } else {
            failedCallBack?.()
          }
        } catch (error) {
          failedCallBack?.(error)
        }
      }
    };

  }
