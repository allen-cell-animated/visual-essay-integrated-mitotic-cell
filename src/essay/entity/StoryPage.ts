import {
    PageBodyWithResolvedMedia,
    ResolvedImageReference,
    ResolvedVideoReference,
    StoryPageWithResolvedMedia,
} from "../config";

import BasePage, { PageType } from "./BasePage";

export default class StoryPage extends BasePage<StoryPageWithResolvedMedia> {
    public get body(): PageBodyWithResolvedMedia {
        return this._config.body;
    }

    public get media(): ResolvedVideoReference | ResolvedImageReference {
        return this._config.media;
    }

    public get type() {
        return PageType.STORY;
    }
}
