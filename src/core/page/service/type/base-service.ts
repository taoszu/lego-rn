import { FetchNetParams, PageResponse } from "../../../../types/type";
import { ServiceType } from "./service-type";

//基础的能力
export default abstract class BaseService implements ServiceType {
    /**
     * 版本号
     * 一个递增的正整数 数字越大说明版本越新
     * 接入的平台方 需要自行实现
     */
    abstract appVersionCode: () => number;

    // 发起网络请求的钩子函数
    abstract fetchWithNet: (
        params:FetchNetParams
    ) => Promise<any>;

    // 获取页面的数据
    // 通常在这里发起网络请求
    abstract getPageLegoData: (params: {
        dataId?: string;
        version: number;
        pageId: string;
    }) => Promise<
        | PageResponse
        | undefined>


}
