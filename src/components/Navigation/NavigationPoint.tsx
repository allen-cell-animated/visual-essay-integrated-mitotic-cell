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
    height: number;
    isFirst: boolean;
    isLast: boolean;
    label: string;
    onClick: (page: Page) => void;
    page: Page;
    translateX: number;
    type: NavPointType;
    width: number;
}

export default class NavigationPoint extends React.Component<NavPointProps> {
    static defaultProps = {
        active: false,
        first: false,
        last: false,
        onClick: (page: Page) => {}, // noop
        translateX: 0,
    };

    private static TYPE_TO_BASELINE_ALIGNMENT_MAP: { [index: string]: "hanging" | "baseline" } = {
        [NavPointType.SECTION]: "hanging",
        [NavPointType.CHAPTER]: "baseline",
    };

    private static TYPE_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [NavPointType.SECTION]: styles.sectionLabel,
        [NavPointType.CHAPTER]: styles.chapterLabel,
    };

    // Used to calculate the radius of the circle: a larger divisor = a smaller circle.
    // See NavigationPoint::getCircleRadius
    private static SECTION_RADIUS_DIVISOR = 7;
    private static CHAPTER_RADIUS_DIVISOR = 10;

    public render(): JSX.Element {
        const { onClick, page, translateX } = this.props;

        return (
            <g
                className={styles.container}
                onClick={() => onClick(page)}
                pointerEvents="all"
                transform={`translate(${translateX})`}
            >
                {this.renderLine()}
                {this.renderRect()}
                {this.renderCircle()}
                {this.renderLabel()}
            </g>
        );
    }

    /**
     * Lines connect navigational dots. The first dot should not have a line extending to its left, while the last
     * dot should not have a line extending to its right.
     */
    private renderLine() {
        const { height, isFirst, isLast, width } = this.props;

        const lineStart = isFirst ? width / 2 : 0;
        const lineEnd = isLast ? width / 2 : width;

        return (
            <line
                className={styles.line}
                x1={lineStart}
                x2={lineEnd}
                y1={height / 2}
                y2={height / 2}
            />
        );
    }

    /**
     * Render a "hidden" (transparent) rect to increase hit area of navigation point.
     */
    private renderRect() {
        const { height, width } = this.props;

        return <rect height={height} fill="black" fillOpacity="0" width={width} />;
    }

    /**
     * The primary navigational indicator.
     */
    private renderCircle() {
        const { active, height, width } = this.props;

        const classname = classNames(styles.dot, {
            [styles.activeDot]: active,
        });

        return (
            <circle
                className={classname}
                cx={width / 2}
                cy={height / 2}
                r={this.getCircleRadius()}
            />
        );
    }

    /**
     * Section labels are positioned above the dot.
     * Chapter labels are positioned below the dot.
     */
    private renderLabel() {
        const { active, height, label, type, width } = this.props;

        const labelClass = classNames(NavigationPoint.TYPE_TO_CLASSNAME_MAP[type], {
            [styles.activeLabel]: active,
        });
        const baselineTextAlignment =
            NavigationPoint.TYPE_TO_BASELINE_ALIGNMENT_MAP[type] || "baseline";

        return (
            <text
                alignmentBaseline={baselineTextAlignment}
                className={labelClass}
                dx={width / 2}
                dy={type === NavPointType.CHAPTER ? height : 0}
            >
                {label}
            </text>
        );
    }

    /**
     * The radius of the circle element should be larger if it represents a section than if it represents a chapter.
     * Divide the smaller of the a) the available width, b) the available height by a section/chapter-aware divisor.
     * A larger divisor means a smaller circle.
     */
    private getCircleRadius() {
        const { height, type, width } = this.props;

        const smallestDimension = Math.min(width, height);

        if (type === NavPointType.SECTION) {
            return smallestDimension / NavigationPoint.SECTION_RADIUS_DIVISOR;
        }

        return smallestDimension / NavigationPoint.CHAPTER_RADIUS_DIVISOR;
    }
}
