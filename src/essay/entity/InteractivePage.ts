import { InteractivePageWithResolvedComponent } from "../config";
import { Position } from "../../components/VisibilityStatus/VisibilityStateMachine";
import BasePage, { PageType } from "./BasePage";

export interface InteractivePageProps {
    position?: Position;
}

export default class InteractivePage extends BasePage<InteractivePageWithResolvedComponent> {
    public get component() {
        return this._config.component;
    }

    public get componentId() {
        return this._config.componentId;
    }

    public get contentHash() {
        return this._config.componentId;
    }

    public get type() {
        return PageType.INTERACTIVE;
    }
}
