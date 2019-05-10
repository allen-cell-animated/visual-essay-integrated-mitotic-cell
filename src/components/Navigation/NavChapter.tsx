import * as classNames from "classnames";
import * as React from "react";

import Chapter from "../../essay/entity/Chapter";

const styles = require("./chapter.css");

interface NavChapterProps {
    chapter: Chapter;
    chapterIsSelected: boolean;
    hoveredChapter: Chapter | undefined;
    label: string;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    sectionIsSelected: boolean;
    translateX: number;
    translateY: number;
}

const HEIGHT = 2;
const HEIGHT_SELECTED = 4;
export const WIDTH = 57;
export const MARGIN = 2;

const FONT_SIZE = 16;
const DISTANCE_FROM_LINE = 5;

export default function NavChapter(props: NavChapterProps) {
    const {
        chapter,
        chapterIsSelected,
        hoveredChapter,
        label,
        onClick,
        onMouseEnter,
        onMouseLeave,
        sectionIsSelected,
        translateX,
        translateY,
    } = props;

    const chapterIsHovered = chapter === hoveredChapter;
    const selectedButNotFocused =
        hoveredChapter !== undefined && chapterIsSelected && !chapterIsHovered;

    return (
        <g className={styles.container} transform={`translate(${translateX}, ${translateY})`}>
            <rect
                className={classNames(styles.chapterRect, {
                    [styles.sectionSelected]: sectionIsSelected,
                    [styles.chapterHovered]: chapterIsHovered,
                    [styles.chapterSelected]: chapterIsSelected,
                })}
                height={chapterIsSelected || chapterIsHovered ? HEIGHT_SELECTED : HEIGHT}
                width={WIDTH}
            />
            <text
                className={classNames(styles.label, {
                    [styles.labelHovered]: chapterIsHovered,
                    [styles.labelActive]: chapterIsSelected,
                    [styles.labelSelectedButNotFocused]: selectedButNotFocused,
                })}
                dx={WIDTH / 2}
                dy={FONT_SIZE + DISTANCE_FROM_LINE}
            >
                {label}
            </text>
            <rect
                className={styles.hitRect}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                pointerEvents="all"
                width={WIDTH}
                height={20}
            />
        </g>
    );
}
