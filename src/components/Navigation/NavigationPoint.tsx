import * as classNames from "classnames";
import * as React from "react";

import Page from "../../essay/entity/Page";

const styles = require("./nav-point-style.css");

/**
 * Does this label a section or a chapter?
 */
export enum NavPointType {
    SECTION = "above",
    CHAPTER = "below",
}

interface NavPointProps {
    active: boolean;
    first: boolean;
    height: number;
    label: string;
    last: boolean;
    onClick: (page: Page) => void;
    page: Page;
    translateX: number;
    type: NavPointType;
    width: number;
}

const TYPE_TO_BASELINE_ALIGNMENT_MAP: { [index: string]: "hanging" | "baseline" } = {
    [NavPointType.SECTION]: "hanging",
    [NavPointType.CHAPTER]: "baseline",
};

const TYPE_TO_CLASSNAME_MAP: { [index: string]: string } = {
    [NavPointType.SECTION]: styles.sectionLabel,
    [NavPointType.CHAPTER]: styles.chapterLabel,
};

const getCircleRadius = (type: NavPointType, width: number, height: number): number => {
    const LARGE_RADIUS_DIVISOR = 7;
    const SMALL_RADIUS_DIVISOR = 10;

    const smallestDimension = Math.min(width, height);

    if (type === NavPointType.SECTION) {
        return smallestDimension / LARGE_RADIUS_DIVISOR;
    }

    return smallestDimension / SMALL_RADIUS_DIVISOR;
};

export default function NavigationPoint(props: NavPointProps) {
    // DOT
    const dotClass = classNames(styles.dot, {
        [styles.activeDot]: props.active,
    });

    // LABEL
    const labelClass = classNames(TYPE_TO_CLASSNAME_MAP[props.type], {
        [styles.activeLabel]: props.active,
    });
    const baselineTextAlignment = TYPE_TO_BASELINE_ALIGNMENT_MAP[props.type] || "baseline";

    const getRectWidth = () => {
        return props.width;
    };

    const getLineStart = () => {
        if (props.first) {
            return props.width / 2;
        }

        return 0;
    };

    const getLineEnd = () => {
        if (props.last) {
            return props.width / 2;
        }

        return getRectWidth();
    };

    const getCx = () => {
        return props.width / 2;
    };

    const getDx = () => {
        return props.width / 2;
    };

    return (
        <g
            className={styles.container}
            onClick={() => props.onClick(props.page)}
            pointerEvents="all"
            transform={`translate(${props.translateX})`}
        >
            <line
                className={styles.line}
                x1={getLineStart()}
                x2={getLineEnd()}
                y1={props.height / 2}
                y2={props.height / 2}
            />
            <rect height={props.height} fill="black" fillOpacity="0" width={getRectWidth()} />
            <circle
                className={dotClass}
                cx={getCx()}
                cy={props.height / 2}
                r={getCircleRadius(props.type, props.width, props.height)}
            />
            <text
                alignmentBaseline={baselineTextAlignment}
                className={labelClass}
                dx={getDx()}
                dy={props.type === NavPointType.CHAPTER ? props.height : 0}
            >
                {props.label}
            </text>
        </g>
    );
}

NavigationPoint.defaultProps = {
    active: false,
    first: false,
    last: false,
    onClick: (page: Page) => {}, // noop
    translateX: 0,
};
