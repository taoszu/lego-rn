import { ServiceType } from "./service-type";

export default abstract class NavigationService implements ServiceType {

   // 入栈
   // 如果入栈的页面为lego类型的页面 则isPageId为true
   abstract pushPage(params: { isPageId: boolean; page: string }): void

   // 出栈
   abstract popPage(params: { pageId: string }): void

}