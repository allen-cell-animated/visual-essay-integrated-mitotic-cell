import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import NavigationPoint, { NavPointType } from "./NavigationPoint";
import { getNavPoints, NavPoint } from "./selectors";

const styles = require("./nav-style.css");

interface NavigationProps {
    activePage: Page;
    className?: string;
    onNavigation: (page: Page) => void;
    sections: Section[];
}

// dimensions at which SVG was designed; scale the graphic accordingly
const VIEWBOX_WIDTH = 911;
const VIEWBOX_HEIGHT = 66;

/**
 * Render navigation UI within a responsive container.
 */
export default function Navigation(props: NavigationProps) {
    const pointIsActive = (navPoint: NavPoint) => {
        if (navPoint.type === NavPointType.SECTION) {
            return navPoint.page.chapter.section === props.activePage.chapter.section;
        }

        return navPoint.page.chapter === props.activePage.chapter;
    };

    return (
        <svg
            className={classNames(styles.container, props.className)}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            pointerEvents="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {getNavPoints(props.sections, VIEWBOX_WIDTH, VIEWBOX_HEIGHT).map(
                (navPoint, index, collection) => {
                    const isFirst = index === 0;
                    const isLast = index === collection.length - 1;

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
                }
            )}
        </svg>
    );
}
