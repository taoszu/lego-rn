import { ServiceType } from "./service-type";

export default abstract class HandleDataService implements ServiceType {

   // 处理自定义的数据
   // 如颜色值 尺寸值的特别处理
   // 如果支持处理 则返回true和处理之后的结果 否则返回false
   abstract handleCustomTypeValue(type: string, value: any): {
      support: boolean
      result: any
   }
}