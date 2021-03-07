import LegoHubInstance from "../../../global/lego-hub";
import BaseEngine from "./base-engine";

export default class PageEngine extends BaseEngine {
  constructor({ pageId, pageParams }: { pageId: string; pageParams?:any }) {
    super({ pageId, pageParams });
    LegoHubInstance.currentPageEngine = this;
  }

  destroy() {
    super.destroy();
    LegoHubInstance.currentPageEngine = null;
  };
}
