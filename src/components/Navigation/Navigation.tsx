import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import MeasuredContainer from "../MeasuredContainer";

import NavigationPoint, { NavPointType } from "./NavigationPoint";
import { getNavPoints, NavPoint } from "./selectors";

const styles = require("./nav-style.css");

interface NavigationProps {
    activePage: Page;
    className?: string;
    onNavigation: (page: Page) => void;
    sections: Section[];
}

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
        <MeasuredContainer
            className={classNames(styles.container, props.className)}
            render={({ height, width }) => {
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
                        {getNavPoints(props.sections, width, height).map(
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
            }}
        />
    );
}
