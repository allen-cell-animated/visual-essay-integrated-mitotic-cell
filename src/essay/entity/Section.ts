import { EssaySection } from "../config";

import Chapter from "./Chapter";
import { Page } from "./BasePage";

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

    public get lastPage(): Page {
        return this._chapters[this._chapters.length - 1].lastPage;
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
