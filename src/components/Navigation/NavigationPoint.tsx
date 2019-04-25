import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";

const styles = require("./nav-point-style.css");

/**
 * Used to answer question: does navigation point represent a section or a chapter?
 */
export enum NavPointType {
    SECTION = "section",
    CHAPTER = "chapter",
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

interface NavPointState {
    hovered: boolean;
}

export default class NavigationPoint extends React.Component<NavPointProps, NavPointState> {
    public static defaultProps = {
        active: false,
        isFirst: false,
        isLast: false,
        onClick: () => {}, // noop
        translateX: 0,
    };

    public state: NavPointState = {
        hovered: false,
    };

    private static TYPE_TO_BASELINE_ALIGNMENT_MAP: { [index: string]: "hanging" | "baseline" } = {
        [NavPointType.SECTION]: "baseline",
        [NavPointType.CHAPTER]: "hanging",
    };

    private static TYPE_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [NavPointType.SECTION]: styles.sectionLabel,
        [NavPointType.CHAPTER]: styles.chapterLabel,
    };

    // Used to calculate the radius of the circle: a larger divisor = a smaller circle.
    // See NavigationPoint::getCircleRadius
    private static SECTION_RADIUS_DIVISOR = 15;
    private static CHAPTER_RADIUS_DIVISOR = 19;

    constructor(props: NavPointProps) {
        super(props);

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    public render(): JSX.Element {
        const { translateX } = this.props;

        return (
            <g
                className={styles.container}
                onMouseLeave={this.onMouseLeave}
                pointerEvents="all"
                transform={`translate(${translateX})`}
            >
                {this.renderLine()}
                {this.renderCircle()}
                {this.renderLabel()}
                {this.renderRect()}
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
        const { onClick, height, isLast, isFirst, page, type, width } = this.props;

        let rectWidth = width;

        // account for label spacing needs on the edges
        if (isFirst || isLast) {
            rectWidth = width * 1.5;
        }

        let y = 0;

        if (type === NavPointType.CHAPTER) {
            y = height / 2;
        }

        return (
            <rect
                className={styles.rect}
                height={height / 2}
                fill="black"
                fillOpacity="0"
                onClick={() => onClick(page)}
                onMouseEnter={this.onMouseEnter}
                width={rectWidth}
                y={y}
            />
        );
    }

    /**
     * The primary navigational indicator.
     */
    private renderCircle() {
        const { active, height, width } = this.props;
        const { hovered } = this.state;

        const classname = classNames(styles.dot, {
            [styles.activeDot]: active,
            [styles.hoveredDot]: hovered,
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
        const { active, height, label, onClick, page, type, width } = this.props;
        const { hovered } = this.state;

        const labelClass = classNames(NavigationPoint.TYPE_TO_CLASSNAME_MAP[type], {
            [styles.activeLabel]: active,
            [styles.hoveredLabel]: hovered,
        });
        const baselineTextAlignment =
            NavigationPoint.TYPE_TO_BASELINE_ALIGNMENT_MAP[type] || "baseline";

        const linePosition = height / 2;

        return (
            <text
                alignmentBaseline={baselineTextAlignment}
                className={labelClass}
                dx={width / 2}
                dy={type === NavPointType.CHAPTER ? linePosition + 10.5 : linePosition - 10.5}
                onClick={() => onClick(page)}
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

    private onMouseEnter() {
        this.setState({ hovered: true });
    }

    private onMouseLeave() {
        this.setState({ hovered: false });
    }
}
