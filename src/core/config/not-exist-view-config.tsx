import ViewConfig from "./view-config";
import React from "react";
import { Text } from "react-native";

export const notExistViewType = "not-exist-view";

export abstract class NotExistViewConfig extends ViewConfig {
    viewType = () => notExistViewType;

    private _notFoundViewType: string = "";

    get notFoundViewType() {
        return this._notFoundViewType;
    }

    set notFoundViewType(notFoundViewType: string) {
        this._notFoundViewType = notFoundViewType;
    }
}

/**
 * 默认的处理不存在的viewType的配置项
 */
export default class DefaultNotExistViewConfig extends NotExistViewConfig {
    render = (props: any) => {
        /**
         * 如果找不到对应的组件
         * 在 DEV 环境下会返回一个缺省组件
         * 生产环境则不渲染视图
         */
        return __DEV__ ? (
            <Text
                style={{
                    color: "#E6497D",
                    fontSize: 18,
                    marginVertical: 12,
                }}
            >{`未找到type为${this.notFoundViewType}的组件`}</Text>
        ) : null;
    };
}
