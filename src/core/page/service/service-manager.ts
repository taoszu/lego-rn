export interface ServiceType {}

/**
 * 拓展页面的各类能力
 * 1. 存储能力
 * 2. 页面请求能力
 * 等
 */
export default abstract class ServiceManager {
  abstract registerService: <S extends ServiceType>(
    serviceId: string,
    Service: new () => S
  ) => void;

  abstract getService: <S extends ServiceType>(serviceId: string) => S | null;
}
