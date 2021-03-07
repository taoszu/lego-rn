import { NetLegoData } from "../../../../types/type";
import { ServiceType } from "./service-type";

export interface StorageData {
    // dataId代表pageLegoData的唯一性
    // 如果pageLegoData变了 dataId也会发生变化
    // 通过dataId可判断pageLegoData是否变更
    // 从而决定持久化存储
    dataId: string;
    pageLegoData: NetLegoData;
}

// 持久化存储能力
export default abstract class StorageService implements ServiceType {
    abstract set(pageId: string, data: StorageData): void;

    abstract get(pageId: string): Promise<StorageData | undefined>;
}
