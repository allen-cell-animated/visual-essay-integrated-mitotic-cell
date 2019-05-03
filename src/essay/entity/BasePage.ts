import Chapter from "./Chapter";
import InteractivePage from "./InteractivePage";
import StoryPage from "./StoryPage";

import {
    InteractivePageWithResolvedComponent,
    ResolvedImageReference,
    ResolvedControlledVideoReference,
    StoryPageWithResolvedMedia,
} from "../config";

export type Page = InteractivePage | StoryPage;

export enum PageType {
    INTERACTIVE = "interactive",
    STORY = "story",
}

/**
 * A BasePage represents the state of the essay at any given point in time, and is the essay's smallest cohesive unit. One
 * or many Pages compose Chapters, which in turn compose Sections. The current state of the UI, however, can be entirely
 * described by a single BasePage, given that it describes what primary (e.g. video) and secondary (e.g. text) content
 * should be in view.
 */
export default abstract class BasePage<
    T extends InteractivePageWithResolvedComponent | StoryPageWithResolvedMedia
> {
    private _chapter: Chapter;
    protected _config: T;
    private readonly _sortOrder: number; // order within essay as a whole, independent of chapter or section

    public constructor(config: T, chapter: Chapter, sortOrder: number) {
        this._config = config;
        this._chapter = chapter;
        this._sortOrder = sortOrder;
    }

    public get chapter(): Chapter {
        return this._chapter;
    }

    /**
     * Return a hash of the content of the page. Used to determine equality of Page content.
     */
    public abstract get contentHash(): string;

    /**
     * Whether or not to show the application header when the page is active. Default to true.
     */
    public get showHeader(): boolean {
        if (this._config.hasOwnProperty("header")) {
            return Boolean(this._config.header);
        }

        return true;
    }

    public get id(): string {
        return `${this._chapter.id}:${this._config.pageId}`;
    }

    public get media(): ResolvedControlledVideoReference | ResolvedImageReference | undefined {
        return this._config.media;
    }

    /**
     * Sort order within entire essay
     */
    public get sortOrder(): number {
        return this._sortOrder;
    }

    public abstract get type(): PageType;

    public get layout(): string {
        return this._config.layout;
    }

    public get transition(): string | undefined {
        return this._config.transition;
    }

    public isStoryPage(): this is StoryPage {
        return this.type === PageType.STORY;
    }

    public isInteractivePage(): this is InteractivePage {
        return this.type === PageType.INTERACTIVE;
    }
}
