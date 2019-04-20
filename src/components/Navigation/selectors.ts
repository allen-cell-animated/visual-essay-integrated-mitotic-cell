import { flatten } from "lodash";

import Chapter from "../../essay/entity/Chapter";
import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import { NavPointType } from "./NavigationPoint";

/**
 * NavPoint and its extensions represent intermediate data structures between Section/Chapter/Page
 * entities and <NavigationPoint /> components: they aggregate useful data to make the UI mapping operation
 * straightforward.
 */
export interface NavPoint {
    chapter?: Chapter;
    label: string;
    page: Page;
    section?: Section;
    type: NavPointType;
}

interface SectionNavPoint extends NavPoint {
    section: Section;
}

interface ChapterNavPoint extends NavPoint {
    chapter: Chapter;
}

function entityIsSection(entity: Section | Chapter, type: NavPointType): entity is Section {
    return type === NavPointType.SECTION;
}

/**
 * Given either a Section or Chapter entity, map it to a NavPoint extension intermediate data structure.
 */
function mapToNavPoint(
    entity: Section | Chapter,
    type: NavPointType
): SectionNavPoint | ChapterNavPoint {
    const base = {
        label: entity.title,
        page: entity.firstPage,
        type,
    };

    if (entityIsSection(entity, type)) {
        return {
            ...base,
            section: entity,
        };
    }

    return {
        ...base,
        chapter: entity,
    };
}

/**
 * Transform Sections and Chapters to (extended) NavPoint data structure.
 */
export function getNavPoints(sections: Section[], width: number, height: number) {
    const enrichNavPointWithLayout = (
        navPoint: SectionNavPoint | ChapterNavPoint,
        idx: number,
        collectionLength: number
    ) => {
        const pointWidth = width / collectionLength - 1;
        return {
            ...navPoint,
            height,
            width: pointWidth,
            translateX: pointWidth * idx,
        };
    };

    const navPoints: (SectionNavPoint | ChapterNavPoint)[][] = [...sections].map(
        (section: Section) => {
            return [
                mapToNavPoint(section, NavPointType.SECTION),
                ...section.chapters.map((chapter) => mapToNavPoint(chapter, NavPointType.CHAPTER)),
            ];
        }
    );

    return flatten(navPoints).map((navPoint, idx, collection) =>
        enrichNavPointWithLayout(navPoint, idx, collection.length)
    );
}
