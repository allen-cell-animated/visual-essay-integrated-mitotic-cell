import Chapter from "./Chapter";

import {
    EssayPageWithResolvedMedia,
    ResolvedVideoReference,
    ResolvedImageReference,
    PageBodyWithResolvedMedia,
} from "../config";

/**
 * A Page represents the state of the essay at any given point in time, and is the essay's smallest cohesive unit. One
 * or many Pages compose Chapters, which in turn compose Sections. The current state of the UI, however, can be entirely
 * described by a single Page, given that it describes what primary (e.g. video) and secondary (e.g. text) content
 * should be in view.
 */
export default class Page {
    private _chapter: Chapter;
    private _config: EssayPageWithResolvedMedia;
    private readonly _sortOrder: number; // order within essay as a whole, independent of chapter or section

    public constructor(config: EssayPageWithResolvedMedia, chapter: Chapter, sortOrder: number) {
        this._config = config;
        this._chapter = chapter;
        this._sortOrder = sortOrder;
    }

    public get id(): string {
        return `${this._chapter.id}:${this._config.pageId}`;
    }

    /**
     * Sort order within entire essay
     */
    public get sortOrder(): number {
        return this._sortOrder;
    }

    public get layout(): string {
        return this._config.layout;
    }

    public get transition(): string | undefined {
        return this._config.transition;
    }

    public get body(): PageBodyWithResolvedMedia {
        return this._config.body;
    }

    public get media(): ResolvedVideoReference | ResolvedImageReference {
        return this._config.media;
    }
}
