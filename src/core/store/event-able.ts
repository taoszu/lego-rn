import { getEventEmiterService } from "../..";
import { EventParams } from "../page/service/type/event-emiter-service";
import BaseStore from "./store";

export interface IEventAble {

    unListenAll(): void

    emitEvent<T>(params: EventParams<T>): void

    eventName(): string | null | undefined
}

export default class EventManager implements IEventAble {
    store: BaseStore;

    constructor(baseStore: BaseStore) {
        this.store = baseStore;
    }

    emitEvent<T>(params: EventParams<T>) {
        getEventEmiterService()?.emitEvent<T>(params)
    }

    unListenAll() {
        const eventName = this.eventName()
        if (eventName) {
            getEventEmiterService()?.unListenAll(eventName)
        }
    }

    eventName() {
        return this.store.getLegoData()?.eventName
    }
}