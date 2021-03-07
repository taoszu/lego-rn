import { autorun, IReactionDisposer, toJS } from "mobx";
import objectPath from "object-path";
import React, { ReactNode } from "react";
import { getHandleViewService } from "../..";
import { currentPageDelegate } from "../../apis/page";
import { LegoViewActionType } from "../../types/delegate";
import { BaseLegoData, DataBinding, DataBindingItem, LegoViewProps, LegoViewStatus } from "../../types/type";
import ArrayUtils from "../../utils/array-utils";
import LegoUtils from "../../utils/lego-utils";
import ObjectUtils from "../../utils/object-utils";
import BaseStore from "../store/store";

/**
 * lego的view基类
 *
 *  ⚠️ 不能重写以下函数
 *
 *  render
 *  componentWillUnmount
 *  componentDidMount
 */
export default abstract class BaseStoreView<
  L extends BaseLegoData,
  S extends BaseStore<L>
  > extends React.Component<LegoViewProps> {
  store: S;

  selfLegoDisposer?: IReactionDisposer;
  dataBindingLegoDisposer?: IReactionDisposer;

  constructor(props: LegoViewProps, StoreType: { new(...args: any): S }) {
    super(props);
    this.store = new StoreType(props);

    const pageDelegate = currentPageDelegate()
    // 保存store的引用到页面代理
    pageDelegate?.storeMap.set(this.store.viewId, this.store);
  }

  /**
   * 取出数据绑定的对应值
   * @param dataBindingItem
   */
  private getValueFromDataBinding = (dataBindingItem: DataBindingItem) => {
    if (ArrayUtils.isNotEmptyList(dataBindingItem?.path)) {
      const from = dataBindingItem.from;
      let fromLegoData;
      // 如果没有指定来源
      // 默认取根数据
      if (from) {
        fromLegoData = this.store.pageEngine.getLegoData(from)?.data;
      } else {
        fromLegoData = this.store.pageEngine.getPageLegoData()?.data;
      }
      return fromLegoData;
    }
  };

  async componentDidMount() {
    /**
     * 监听指定数据变化
     * 如果数据变化
     * 则从绑定路径进行取值
     * 进行数据刷新
     */
    const refreshByDataBinding = (dataBinding?: DataBinding) => {
      if (dataBinding) {
        Object.keys(dataBinding).forEach((key) => {
          const dataBindingValue = dataBinding[key];
          let fromLegoData = this.getValueFromDataBinding(dataBindingValue);
          if (fromLegoData) {
            let value = objectPath.get(
              toJS(fromLegoData),
              dataBindingValue.path
            );
            if (value) {
              this.store.changeLegoDataContent({ [key]: value });
            }
          }
        });
      }
    };

    const dataBinding = this.store.getLegoDataBinding();
    if (ObjectUtils.isNotEmpty(dataBinding)) {
      // 加载成功
      // 先进行一次数据绑定
      refreshByDataBinding(dataBinding);
      this.dataBindingLegoDisposer = autorun(() => {
        refreshByDataBinding(dataBinding);
      });
    }

    this.selfLegoDisposer = autorun(() => {
      // 持有被观察的变量
      // 将变量和视图绑定
      const legoData = this.store.getLegoData();
      if (legoData) {
        // 强制刷新
        this.setState({}, () => {
          LegoUtils.safeCallFunc(this.legoDataDidChange);
        });
      }
    });

    const legoData = this.store.getLegoData();
    this.dispatchDidMountAction();
    // didmount回调
    LegoUtils.safeCallFunc(this.legoDidMount);

    const netConfig = legoData?.netConfig;
    if (netConfig?.requestAuto) {
      /**
       * 如果启用自动发起网络请求
       * 在didmount自动发起请求
       */
      this.store.fetchWithConfig({
        successCallBack: () => {
          this.setState({}, () => {
            LegoUtils.safeCallFunc(this.legoDataDidChange);
          });
        },
      });
    }
  }

  private dispatchDidMountAction = () => {
    this.store.dispatchAction({
      actionType: LegoViewActionType.didMount,
    });
  };

  private dispatchWillUnMountAction = () => {
    this.store.dispatchAction({
      actionType: LegoViewActionType.willUnmount,
    });
  };

  componentWillUnmount() {
    // 移除数据变化监听
    this.selfLegoDisposer && this.selfLegoDisposer();
    this.dataBindingLegoDisposer && this.dataBindingLegoDisposer();

    // 发送组件卸载事件
    this.dispatchWillUnMountAction();
    LegoUtils.safeCallFunc(this.legoWillUnmount);

    const store = this.store
    store.unListenAll()
    // 移除store的引用
    store.pageDelegate?.storeMap.delete(store.viewId);
  }

  /**
   * 页面加载完成 只调用一次
   */
  legoDidMount() { };

  /**
   * 页面即将卸载 只调用一次
   */
  legoWillUnmount() { };

  /**
   * lego数据改变回调
   */
  legoDataDidChange(){ };

  /**
   * 每个lego组件需要重写这个渲染函数
   */
  abstract renderLego(): ReactNode | null;

  render() {
    const store = this.store
    const { viewType, viewId } = store
    const { viewStatus } = store.getLegoDataContent();
    LegoUtils.legoLog(
      `render ${viewType},id is ${viewId}, viewStatus is ${viewStatus}`
    );
    if (!viewStatus || viewStatus === LegoViewStatus.normal) {
      return this.renderLego();
    } else {
      const pageEngine = store.pageEngine
      const handleViewService = getHandleViewService()
      const pageDelegate = pageEngine?.pageDelegate

      // 优先使用页面代理的视图拦截
      // 之后再尝试通用的视图处理服务
      const inteceptResult = pageDelegate?.interceptViewStatus({ viewId, viewType, viewStatus })
      if (inteceptResult?.intercept) {
        return inteceptResult?.render?.() ?? null
      } else {
        return handleViewService?.renderWithViewStatus({ viewId, viewType, viewStatus }) ?? null
      }
    }

  }
}
