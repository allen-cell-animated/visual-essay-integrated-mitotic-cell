import * as classNames from "classnames";
import * as React from "react";

const styles = require("./chapter.css");

interface NavChapterProps {
    chapterIsActive: boolean;
    label: string;
    onClick: () => void;
    sectionIsActive: boolean;
    translateX: number;
    translateY: number;
}

export const WIDTH = 57; // in px
export const MARGIN = 2; // in px;

const FONT_SIZE = 16;
const DISTANCE_FROM_LINE = 5;

export default function NavChapter(props: NavChapterProps) {
    const { chapterIsActive, label, onClick, sectionIsActive, translateX, translateY } = props;

    return (
        <g className={styles.container} transform={`translate(${translateX}, ${translateY})`}>
            <rect
                className={classNames(styles.chapterRect, {
                    [styles.chapterRectSectionActive]: sectionIsActive,
                    [styles.chapterRectActive]: chapterIsActive,
                })}
                width={WIDTH}
            />
            <text
                className={classNames(styles.label, {
                    [styles.labelActive]: chapterIsActive,
                })}
                dx={WIDTH / 2}
                dy={FONT_SIZE + DISTANCE_FROM_LINE}
            >
                {label}
            </text>
            <rect
                className={styles.hitRect}
                onClick={onClick}
                pointerEvents="all"
                width={WIDTH}
                height={20}
            />
        </g>
    );
}
