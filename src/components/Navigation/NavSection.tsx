import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";

const styles = require("./section.css");

interface NavSectionProps {
    active: boolean;
    height: number;
    label: string;
    onClick: (page: Page) => void;
    page: Page;
    translateX: number;
    width: number;
}

export const MARGIN = 8; // in px
const DISTANCE_FROM_LINE = 11; // in px

export default function NavSection(props: React.PropsWithChildren<NavSectionProps>) {
    const { active, height, label, onClick, page, translateX, width } = props;

    return (
        <g className={styles.container} transform={`translate(${translateX})`}>
            {props.children}
            <text
                className={classNames(styles.label, {
                    [styles.labelActive]: active,
                })}
                dx={width / 2}
                dy={height / 2 - DISTANCE_FROM_LINE}
                onClick={() => onClick(page)}
                pointerEvents="all"
            >
                {label}
            </text>
        </g>
    );
}
