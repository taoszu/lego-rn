export interface ServiceType {

}

// 支持的服务类型
export enum ServiceId {
    // 基础
    base = 'base',
    // 网络请求相关
    net = 'net',
    // 存储能力
    storage = "storage",
    // 处理数据能力
    handleData = "handle-data",
    // 出入栈
    navigation = 'navigation',
    // 事件发送
    eventEmiter = 'event-emiter',
    // 视图相关的处理
    handleView = 'handle-view'
}