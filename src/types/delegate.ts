import { ReactNode } from "react";

/**
 * 页面事件的定义
 * type 事件类型
 * viewId 组件id
 * viewType 组件类型
 * params  事件传递的参数
 */
export interface LegoViewAction {
  type: LegoViewActionType;
  viewId: string;
  viewType: string;
  params?: any;
}

export enum LegoViewActionType {
  // 点击
  click = "Click",
  // 长按
  longPress = "LongPress",
  // 完成渲染
  didMount = "DidMount",
  // 组件卸载
  willUnmount = "WillUnmount",

  /**
   * 组件网络请求的处理
   * @see NetRequestHandler
   */
  netRequestHandle = "NetRequestHandle",

  // 组件额外属性
  extra = "Extra",
}

/**
 * 网络请求处理的钩子定义
 */
export interface NetRequestHandler {
  genParams: () => any;
  handleResponse: (netResponse: any) => { [key: string]: any };
  handleError: (e: any) => any
}

export interface InterceptResult {
  intercept: boolean
  render?: () => ReactNode | null
}
