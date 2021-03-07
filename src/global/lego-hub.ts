import PageEngine from "../core/page/engine/page-engine";
import { Factory, PageDelegateCreator, ViewConfigCreator } from "./factory";

class LegoHub {

  private factory = new Factory()
  // 当前页面
  private _currentPageEngine: PageEngine | null = null;

  set currentPageEngine(currentPageEngine: PageEngine | null) {
    this._currentPageEngine = currentPageEngine;
  }

  get currentPageEngine() {
    return this._currentPageEngine;
  }

  registerViewConfig(Creator: ViewConfigCreator) {
    this.factory.registerViewConfig(Creator)
  }

  getViewConfig(viewType: string) {
    return this.factory.getViewConfig(viewType)
  }

  registerPageDelegateCreator(PageDelegateCreator: PageDelegateCreator) {
    this.factory.registerPageDelegateCreator(PageDelegateCreator)
  }

  genPageDelegate(pageId: string) {
    return this.factory.genPageDelegate(pageId);
  }

}

const LegoHubInstance = new LegoHub();
export default LegoHubInstance;
