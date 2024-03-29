import Chapter from "../../essay/entity/Chapter";
import Section from "../../essay/entity/Section";

import { WIDTH as CHAPTER_WIDTH, MARGIN as CHAPTER_MARGIN } from "./NavChapter";
import { MARGIN as SECTION_MARGIN } from "./NavSection";

interface NavChapterConfig {
    chapter: Chapter;
    label: string;
    translateX: number;
}

interface NavSectionConfig {
    chapters: NavChapterConfig[];
    label: string;
    section: Section;
    translateX: number;
    width: number;
}

const PADDING_LEFT = 10; // fudge factor; leave room for the first chapter label

/**
 * Transform Sections and Chapters to an intermediate, enriched data structure with all info needed to render
 * NavSection and NavChapter components.
 */
export function getNavConfig(sections: Section[]) {
    return sections.reduce(
        (accum, section: Section, sectionIdx: number) => {
            const chapters = section.chapters
                .filter((chapter: Chapter) => chapter.title) // filter down to only those chapters with truthy titles
                .map((chapter: Chapter, chapterIdx: number) => {
                    return {
                        chapter,
                        label: chapter.title || "",
                        translateX: chapterIdx * (CHAPTER_WIDTH + CHAPTER_MARGIN),
                    };
                });

            const sectionWidth =
                chapters.length * CHAPTER_WIDTH + (chapters.length - 1) * CHAPTER_MARGIN;

            let translateX = PADDING_LEFT;

            if (sectionIdx > 0) {
                const prevSection = accum[sectionIdx - 1];
                translateX = prevSection.translateX + prevSection.width + SECTION_MARGIN;
            }

            const navSection = {
                chapters,
                label: section.title || "",
                section,
                translateX,
                width: sectionWidth,
            };

            return [...accum, navSection];
        },
        [] as NavSectionConfig[]
    );
}
