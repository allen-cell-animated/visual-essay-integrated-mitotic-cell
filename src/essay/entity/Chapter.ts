import InteractivePage from "./InteractivePage";
import Section from "./Section";
import StoryPage from "./StoryPage";
import { EssayChapter } from "../config";

/**
 * A Chapter is a logical grouping of Pages, and exists primarily for the purposes of navigation.
 */
export default class Chapter {
    private _config: EssayChapter;
    private _pages: (InteractivePage | StoryPage)[] = [];
    private _section: Section;

    public constructor(config: EssayChapter, section: Section) {
        this._config = config;
        this._section = section;
    }

    public get id(): string {
        return `${this._section.id}:${this._config.chapterId}`;
    }

    public addPage(page: InteractivePage | StoryPage): void {
        this._pages = [...this._pages, page];
    }
}
