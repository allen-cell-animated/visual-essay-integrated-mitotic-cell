import * as classNames from "classnames";
import * as React from "react";

const styles = require("./section.css");

interface NavSectionProps {
    active: boolean;
    height: number;
    label: string;
    onClick: () => void;
    translateX: number;
    width: number;
}

export const MARGIN = 8; // in px
const DISTANCE_FROM_LINE = 11; // in px

export default function NavSection(props: React.PropsWithChildren<NavSectionProps>) {
    const { active, height, label, onClick, translateX, width } = props;

    return (
        <g className={styles.container} transform={`translate(${translateX})`}>
            {props.children}
            <text
                className={classNames(styles.label, {
                    [styles.labelActive]: active,
                })}
                dx={width / 2}
                dy={height / 2 - DISTANCE_FROM_LINE}
                onClick={onClick}
                pointerEvents="all"
            >
                {label}
            </text>
        </g>
    );
}
