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
    if (type === NavPointType.SECTION) {
        return true;
    }

    return false;
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
    return (
        <MeasuredContainer
            className={classNames(styles.container, props.className)}
            render={({ height, width }) => {
                const navPoints = getNavPointsInOrder(
                    props.sections,
                    (navPoint, index, collection) => {
                        const isFirst = index === 0;
                        const isLast = index === collection.length - 1;

                        const fullPointWidth = width / collection.length;
                        const halfPointWidth = fullPointWidth / 2;

                        const pointWidth = isFirst || isLast ? halfPointWidth : fullPointWidth;

                        // TODO, need to know width of the last one? translateX of the last one? both?
                        return {
                            ...navPoint,
                            height,
                            width: pointWidth,
                            translateX: fullPointWidth * index,
                        };
                    }
                );

                return (
                    <svg
                        width={String(width)}
                        height={String(height)}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {navPoints.map((navPoint, index) => {
                            const isFirst = index === 0;
                            const isLast = index === navPoints.length - 1;

                            return (
                                <NavigationPoint
                                    active={props.activePage === navPoint.page}
                                    first={isFirst}
                                    height={navPoint.height}
                                    key={`${navPoint.type}:${navPoint.page.id}`}
                                    label={navPoint.label}
                                    last={isLast}
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
