import LegoHubInstance from "../../../global/lego-hub";
import ViewConfig from "../../config/view-config";


export interface IViewConfigFactory {

    getViewConfig: (viewType: string) => ViewConfig | undefined
}

export default class ViewConfigFactory implements IViewConfigFactory {

  getViewConfig = (viewType: string) => {
    let viewConfig = LegoHubInstance.getViewConfig(viewType);
    if (!viewConfig) {
    }
    return viewConfig;
  };

}