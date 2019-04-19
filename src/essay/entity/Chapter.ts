import Page from "./Page";
import Section from "./Section";
import { EssayChapter } from "../config";

/**
 * A Chapter is a logical grouping of Pages, and exists primarily for the purposes of navigation.
 */
export default class Chapter {
    private _config: EssayChapter;
    private _pages: Page[] = [];
    private _section: Section;

    public constructor(config: EssayChapter, section: Section) {
        this._config = config;
        this._section = section;
    }

    public get firstPage(): Page {
        return this._pages[0];
    }

    public get id(): string {
        return `${this._section.id}:${this._config.chapterId}`;
    }

    public get pages(): Page[] {
        return this._pages;
    }

    public get title(): string {
        return this._config.title;
    }

    public addPage(page: Page): void {
        this._pages = [...this._pages, page];
    }
}
