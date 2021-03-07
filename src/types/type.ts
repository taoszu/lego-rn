import { LegoViewActionType } from "./delegate";

export interface ViewIds {
  [key: string]: ViewId[];
}
  export type ViewId = string;

export interface DataBindingItem  {
  path: string[];
  from?: string;
}

/**
 * 指定数据源绑定逻辑
 * path就是绑定路径
 * 如指定viewId(disjkjqkjdk123)的data为
 * {
 *    "a": { b:{c:"我被绑定了"} }
 * }
 * DataBinding为
 * {
 *  "title": {path: ["a", "b", "c"], from:"disjkjqkjdk123" }
 * }
 * 那么可得到title为"我被绑定了"
 * 如果from为空 那么则从根数据进行数据绑定
 */
export interface DataBinding {
  [key: string]: DataBindingItem;
}

/**
 * 事件分发
 */
export interface DispatchAction {
  viewId: string;
  actionTypes: LegoViewActionType[];
}

/**
 * 网络请求配置
 * value 可以是默认值
 * dataBinding可以进行寻值
 */
export interface NetConfig {
  url: string;
  // 如果组件didmount
  // 自动发起网络请求
  requestAuto: boolean;
  params: {
    key: string;
    value: string | number;
    dataBinding: DataBindingItem;
  }[];
}

/**
 * 最基本的lego数据 写一个新的lego组件时，
 * 需要继承BaseLegoData 并且定义data的数据格式
 * data即为lego组件对外暴露接收的数据
 */
export interface BaseLegoData {
  data: { [key: string]: any };
  dataBinding?: DataBinding;
  viewType: string;
  viewId: ViewId;
  children: ViewId[];
  // 网络请求配置
  netConfig?: NetConfig;
  dispatchAction?: DispatchAction;
  eventName?:string
}

/**
 * 后台返回的lego data
 */
export interface NetLegoData {
  data?: any;
  viewType: string;
  viewId?: ViewId;
  children?: NetLegoData[];
  dataBinding?: DataBinding;
}

/**
 * lego组件的基本属性
 */
export interface LegoViewProps {
  viewId: ViewId;
}

/**
 * lego视图状态
 */
export enum LegoViewStatus {
  // 组件正常状态
  normal = "normal",
  // 组件隐藏状态
  hide = "hide",
  // 组件异常状态
  error = "error",
}

/**
 * 基础的lego数据内容部分
 */
export interface BaseLegoDataContent {
  viewStatus: LegoViewStatus;
  // 异常类型
  errorType?: string;
  // 主题key
  themeKey: string;
}

/**
 * 页面的回包数据格式
 */
export interface PageResponse {
  // 是否更新数据
  isUpdate: boolean;
  // 页面数据的hash id
  // 代表数据的唯一性
  id: string;
  // 页面数据
  data: NetLegoData;
}

/**
 * 请求需要的配置
 * @param url 地址
 * @param params 请求参数
 * @param netOptions 网络请求的参数
 */
export interface FetchNetParams {
  url: string;
  params?: {[key:string]:any}
  netOptions?:{[key:string]:any}
}