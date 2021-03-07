import LegoHubInstance from "../global/lego-hub";

export function currentPageEngine() {
    return LegoHubInstance.currentPageEngine;
}

export function currentPageDelegate() {
    return currentPageEngine()?.pageDelegate;
}
