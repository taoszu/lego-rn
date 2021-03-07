import { ReactNode } from "react";
import { LegoViewProps } from "../../types/type";

export default abstract class ViewConfig {

  /**
   * 组件的唯一ID
   */
  abstract viewType: () => string;

  genWrapProps = (props: LegoViewProps) => {
    let wrapProps: LegoViewProps = props;
    // 添加viewId作为组件的key
    wrapProps = Object.assign(wrapProps, { key: props.viewId });
    return wrapProps;
  };

  wrapRender = (props: LegoViewProps) => {
    const wrapProps = this.genWrapProps(props);
    return this.render(wrapProps);
  };

  component: () => ReactNode | undefined = () => {
    return undefined;
  };

  /**
   * 渲染组件
   */
  abstract render: (props: any) => JSX.Element | null;
}
