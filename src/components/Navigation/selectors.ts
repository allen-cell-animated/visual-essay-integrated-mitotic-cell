import Chapter from "../../essay/entity/Chapter";
import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import { WIDTH as CHAPTER_WIDTH, MARGIN as CHAPTER_MARGIN } from "./NavChapter";
import { MARGIN as SECTION_MARGIN } from "./NavSection";

interface NavChapter {
    chapter: Chapter;
    label: string;
    page: Page;
    translateX: number;
}

interface NavSection {
    chapters: NavChapter[];
    label: string;
    page: Page;
    section: Section;
    translateX: number;
    width: number;
}

/**
 * Transform Sections and Chapters to (extended) NavPoint data structure.
 */
export function getNavPoints(sections: Section[]) {
    return sections.reduce(
        (accum, section: Section, sectionIdx: number) => {
            const chapters = section.chapters.map((chapter: Chapter, chapterIdx: number) => {
                return {
                    chapter,
                    label: chapter.title || "",
                    page: chapter.firstPage,
                    translateX: chapterIdx * (CHAPTER_WIDTH + CHAPTER_MARGIN),
                };
            });

            const sectionWidth =
                chapters.length * CHAPTER_WIDTH + (chapters.length - 1) * CHAPTER_MARGIN;

            let translateX = 0;

            if (sectionIdx > 0) {
                const prevSection = accum[sectionIdx - 1];
                translateX = prevSection.translateX + prevSection.width + SECTION_MARGIN;
            }

            const navSection = {
                chapters,
                label: section.title || "",
                page: section.firstPage,
                section,
                translateX,
                width: sectionWidth,
            };

            return [...accum, navSection];
        },
        [] as NavSection[]
    );
}
