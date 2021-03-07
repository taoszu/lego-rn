import BaseEngine from "../core/page/engine/base-engine";
import ViewBuilder from "../core/view-builder";
import LegoHubInstance from "../global/lego-hub";
import { BaseLegoData } from "../types/type";
import LegoUtils from "../utils/lego-utils";
import { currentPageEngine } from "./page";

export function getViewConfig(viewType:string) {
    return LegoHubInstance.getViewConfig(viewType)
}

export function renderByData(
    viewData?: BaseLegoData
) {
    if (!viewData) {
        return null;
    }
    const { viewType } = viewData;
    return new ViewBuilder()
        .withType(viewType)
        .withData(viewData)
        .render();
}

export function renderByViewId(viewId: string) {
    const pageEngine = currentPageEngine()
    if (!pageEngine) {
        LegoUtils.legoLog('pageEngine is invalid')
        return null;
    }
    const viewData = pageEngine.getLegoData(viewId);
    return renderByData(viewData);
}

export function genViewProps(baseEngine: BaseEngine, viewId: string) {
    if (!baseEngine) {
        LegoUtils.legoLog(`pagEngine is invalid`);
        return null;
    }
    const viewData = baseEngine.getLegoData(viewId);
    if (viewData) {
        const { viewType } = viewData;
        return new ViewBuilder()
            .withType(viewType)
            .withData(viewData)
            .genViewProps();
    }
}

export function getViewComponent(
    viewId: string
) {
    const pageEngine = currentPageEngine()
    if (!pageEngine) {
        LegoUtils.legoLog('pageEngine is invalid')
        return null;
    }
    const viewData = pageEngine.getLegoData(viewId);
    const viewConfig = getViewConfig(viewData ?.viewType ?? "");
    return viewConfig?.component();
}
