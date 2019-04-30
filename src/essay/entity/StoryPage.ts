import { contentIsText, PageBodyWithResolvedMedia, StoryPageWithResolvedMedia } from "../config";

import BasePage, { PageType } from "./BasePage";

export default class StoryPage extends BasePage<StoryPageWithResolvedMedia> {
    public get body(): PageBodyWithResolvedMedia {
        return this._config.body;
    }

    public get contentHash(): string {
        const list = this._config.body.content.reduce((accum: string[], content) => {
            if (contentIsText(content)) {
                return [...accum, `${content.element}:${content.text}`];
            } else {
                return [...accum, content.mediaId];
            }
        }, []);

        return list.join("_");
    }

    public get type() {
        return PageType.STORY;
    }
}
