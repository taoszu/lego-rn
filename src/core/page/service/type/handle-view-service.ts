import { ReactNode } from "react";
import { LegoViewStatus } from "../../../../types/type";
import { ServiceType } from "./service-type";


export interface ViewStatusParams {
   viewId: string
   viewType: string
   viewStatus: LegoViewStatus
}


export default abstract class HandleViewService implements ServiceType {

   // 当视图状态为非normal时的渲染逻辑
   abstract renderWithViewStatus(params: ViewStatusParams): null | ReactNode
}