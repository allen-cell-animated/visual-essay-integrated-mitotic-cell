import Chapter from "./Chapter";
import { EssaySection } from "../config";

/**
 * A Section is a logical grouping of Chapters, and exists largely for navigational purposes.
 */
export default class Section {
    private _config: EssaySection;
    private _chapters: Chapter[] = [];

    public constructor(config: EssaySection) {
        this._config = config;
    }

    public get id(): string {
        return this._config.sectionId;
    }

    public addChapter(chapter: Chapter): void {
        this._chapters = [...this._chapters, chapter];
    }
}
