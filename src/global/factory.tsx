import ViewConfig from "../core/config/view-config";
import BaseLegoPageDelegate from "../core/page/delegate/base-page-delegate";

export type ViewConfigCreator = new () => ViewConfig;
export type PageDelegateCreator = new () => BaseLegoPageDelegate;

/**
 * lego工厂
 * 负责注入ViewConfig的构造器
 */
export class Factory {
  /**
   * 保存viewType和组件构造器的映射关系
   */
  private _viewConfigs: Map<
    string,
    ViewConfig
  > = new Map();

  private _viewConfigCreatorSet = new Set<ViewConfigCreator>()

  // 保存paegId和页面代理构造器的映射关系
  private _pageDelegateCreatorMap: Map<string, PageDelegateCreator> = new Map();

  /**
   * 注册组件
   * @param viewConfig
   */
  registerViewConfig(Creator: ViewConfigCreator) {
    if(this._viewConfigCreatorSet.has(Creator)) {
      return null
    }  
    this._viewConfigCreatorSet.add(Creator)

    const viewConfig = new Creator();
    const viewType = viewConfig?.viewType?.()
    if (viewConfig?.viewType()) {
      this._viewConfigs.set(viewType, viewConfig);
    }
  }

  getViewConfig(viewType: string) {
    return this._viewConfigs.get(viewType);
  }

  registerPageDelegateCreator(PageDelegateCreator: PageDelegateCreator) {
    const pageDelegate = new PageDelegateCreator();
    if (pageDelegate?.pageId) {
      this._pageDelegateCreatorMap.set(pageDelegate.pageId, PageDelegateCreator);
    }
  }

  genPageDelegate(pageId: string) {
    const Creator = this._pageDelegateCreatorMap.get(pageId);
    return Creator ? new Creator() : null
  }


}
