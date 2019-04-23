import {
    BodyContentResolvedImage,
    BodyContentResolvedVideo,
    BodyContentText,
    PageBodyWithResolvedMedia,
    ResolvedImageReference,
    ResolvedVideoReference,
    StoryPageWithResolvedMedia,
} from "../config";

import BasePage, { PageType } from "./BasePage";

function contentIsText(
    content: BodyContentText | BodyContentResolvedVideo | BodyContentResolvedImage
): content is BodyContentText {
    return content.type === "text";
}

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

    public get media(): ResolvedVideoReference | ResolvedImageReference {
        return this._config.media;
    }

    public get type() {
        return PageType.STORY;
    }
}
