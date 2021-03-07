import { ServiceType } from "./service-type";

export interface EventParams<T = any> {
   eventName:string;
   //事件发送的额外参数
   params?:T;
}

// 事件发送器服务
export default abstract class EventEmiterService<T = any> implements ServiceType {

   abstract listen<T>(eventName:string, lisenter:(params: EventParams<T>)=>void): void

   abstract unListenAll(eventName:string): void

   abstract emitEvent<T>(params:EventParams<T>):void
}