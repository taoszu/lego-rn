import { toJS } from "mobx";
import { getViewConfig } from "../apis/view-builder";
import { BaseLegoData } from "../types/type";
import LegoUtils from "../utils/lego-utils";

export default class ViewBuilder {
    private _type = "";
    private _data: BaseLegoData = LegoUtils.genEmptyBaseLegoData();

    get type() {
        return this._type;
    }

    get data() {
        return this._data;
    }

    ViewBuilder() {
    }

    withType(type: string) {
        this._type = type;
        return this;
    }

    withData(data: BaseLegoData) {
        this._data = toJS(data);
        return this;
    }

    private _genViewProps() {
        const { type, data } = this;
        let props = {
            viewId: data.viewId,
        };
        return props
    }

    genViewProps() {
        const { type, data } = this;
        const viewConfig = getViewConfig(type);
        const props = this._genViewProps()
        return viewConfig?.genWrapProps(props);
    }

    render() {
        const { type } = this;
        const viewConfig = getViewConfig(type)
        const props = this._genViewProps()
        return viewConfig?.wrapRender(props);
    }
}