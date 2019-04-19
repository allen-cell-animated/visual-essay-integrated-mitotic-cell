import { InteractivePageWithResolvedComponent } from "../config";

import BasePage, { PageType } from "./BasePage";

export default class InteractivePage extends BasePage<InteractivePageWithResolvedComponent> {
    public get component() {
        return this._config.component;
    }

    public get componentId() {
        return this._config.componentId;
    }

    public get type() {
        return PageType.INTERACTIVE;
    }
}
