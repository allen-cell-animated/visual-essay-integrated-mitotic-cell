import { EssaySection } from "../config";

import Chapter from "./Chapter";
import Page from "./Page";

/**
 * A Section is a logical grouping of Chapters, and exists largely for navigational purposes.
 */
export default class Section {
    private _config: EssaySection;
    private _chapters: Chapter[] = [];

    public constructor(config: EssaySection) {
        this._config = config;
    }

    public get chapters(): Chapter[] {
        return this._chapters;
    }

    public get firstPage(): Page {
        return this._chapters[0].firstPage;
    }

    public get id(): string {
        return this._config.sectionId;
    }

    public get title(): string {
        return this._config.title;
    }

    public addChapter(chapter: Chapter): void {
        this._chapters = [...this._chapters, chapter];
    }
}
