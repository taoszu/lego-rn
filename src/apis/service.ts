
import BaseService from '../core/page/service/type/base-service'
import EventEmiterService from '../core/page/service/type/event-emiter-service'
import HandleDataService from '../core/page/service/type/handle-data-service'
import HandleViewService from '../core/page/service/type/handle-view-service'
import { ServiceId } from '../core/page/service/type/service-type'
import StorageService from '../core/page/service/type/storage-service'
import LegoHubInstance from '../global/lego-hub'

export function getBaseService() {
    const currentPageEngine = LegoHubInstance.currentPageEngine
    return currentPageEngine?.getService<BaseService>(ServiceId.base)
}

export function getStorageService() {
    const currentPageEngine = LegoHubInstance.currentPageEngine
    return currentPageEngine?.getService<StorageService>(ServiceId.storage)
}

export function getHandleDataService() {
    const currentPageEngine = LegoHubInstance.currentPageEngine
    return currentPageEngine?.getService<HandleDataService>(ServiceId.handleData)
}

export function getEventEmiterService() {
    const currentPageEngine = LegoHubInstance.currentPageEngine
    return currentPageEngine?.getService<EventEmiterService>(ServiceId.eventEmiter)
}

export function getHandleViewService() {
    const currentPageEngine = LegoHubInstance.currentPageEngine
    return currentPageEngine?.getService<HandleViewService>(ServiceId.handleView)
}