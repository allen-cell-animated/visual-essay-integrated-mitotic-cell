import * as classNames from "classnames";
import { flatten } from "lodash";
import * as React from "react";

import Page from "../../essay/entity/Page";
import Section from "../../essay/entity/Section";
import Chapter from "../../essay/entity/Chapter";

import MeasuredContainer from "../MeasuredContainer";

import NavigationPoint, { NavPointType } from "./NavigationPoint";

const styles = require("./nav-style.css");

interface NavigationProps {
    activePage: Page;
    className?: string;
    onNavigation: (page: Page) => void;
    sections: Section[];
}

interface NavPoint {
    chapter?: Chapter;
    label: string;
    page: Page;
    section?: Section;
    type: NavPointType;
}

interface NavPointWithPosition extends NavPoint {
    height: number;
    width: number;
    translateX: number;
}

interface SectionNavPoint extends NavPoint {
    section: Section;
}
type SectionNavPointWithPosition = SectionNavPoint & NavPointWithPosition;

interface ChapterNavPoint extends NavPoint {
    chapter: Chapter;
}
type ChapterNavPointWithPosition = ChapterNavPoint & NavPointWithPosition;

function entityIsSection(entity: Section | Chapter, type: NavPointType): entity is Section {
    return type === NavPointType.SECTION;
}

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

type Callback = (
    navPoint: SectionNavPoint | ChapterNavPoint,
    index: number,
    collection: (SectionNavPoint | ChapterNavPoint)[]
) => SectionNavPointWithPosition | ChapterNavPointWithPosition;
function getNavPointsInOrder(sections: Section[], callback: Callback) {
    const navPoints: (SectionNavPoint | ChapterNavPoint)[][] = [...sections].map(
        (section: Section) => {
            return [
                mapToNavPoint(section, NavPointType.SECTION),
                ...section.chapters.map((chapter) => mapToNavPoint(chapter, NavPointType.CHAPTER)),
            ];
        }
    );

    return flatten(navPoints).map(callback);
}

export default function Navigation(props: NavigationProps) {
    const pointIsActive = (navPoint: NavPointWithPosition) => {
        if (navPoint.type === NavPointType.SECTION) {
            return navPoint.page.chapter.section === props.activePage.chapter.section;
        }

        return navPoint.page.chapter === props.activePage.chapter;
    };

    return (
        <MeasuredContainer
            className={classNames(styles.container, props.className)}
            render={({ height, width }) => {
                const navPoints = getNavPointsInOrder(
                    props.sections,
                    (navPoint, index, collection) => {
                        const pointWidth = width / collection.length - 1;

                        return {
                            ...navPoint,
                            height,
                            width: pointWidth,
                            translateX: pointWidth * index,
                        };
                    }
                );

                if (!width || !height) {
                    return null;
                }

                return (
                    <svg
                        width={String(width)}
                        height={String(height)}
                        pointerEvents="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {navPoints.map((navPoint, index) => {
                            const isFirst = index === 0;
                            const isLast = index === navPoints.length - 1;

                            return (
                                <NavigationPoint
                                    active={pointIsActive(navPoint)}
                                    height={navPoint.height}
                                    isFirst={isFirst}
                                    isLast={isLast}
                                    key={`${navPoint.type}:${navPoint.page.id}`}
                                    label={navPoint.label}
                                    onClick={props.onNavigation}
                                    page={navPoint.page}
                                    translateX={navPoint.translateX}
                                    type={navPoint.type}
                                    width={navPoint.width}
                                />
                            );
                        })}
                    </svg>
                );
            }}
        />
    );
}
