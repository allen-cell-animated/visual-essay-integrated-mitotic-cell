import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import NavChapter from "./NavChapter";
import NavSection from "./NavSection";
import { getNavPoints } from "./selectors";

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

export default function Navigation(props: NavigationProps) {
    return (
        <svg
            className={classNames(styles.container, props.className)}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            pointerEvents="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {getNavPoints(props.sections).map((navSection) => {
                return (
                    <NavSection
                        active={navSection.section === props.activePage.chapter.section}
                        key={navSection.page.id}
                        height={VIEWBOX_HEIGHT}
                        label={navSection.label}
                        onClick={props.onNavigation}
                        page={navSection.page}
                        translateX={navSection.translateX}
                        width={navSection.width}
                    >
                        {navSection.chapters.map((navChapter) => (
                            <NavChapter
                                chapterIsActive={navChapter.chapter === props.activePage.chapter}
                                key={navChapter.page.id}
                                label={navChapter.label}
                                onClick={props.onNavigation}
                                page={navChapter.page}
                                sectionIsActive={
                                    navSection.section === props.activePage.chapter.section
                                }
                                translateX={navChapter.translateX}
                                translateY={VIEWBOX_HEIGHT / 2}
                            />
                        ))}
                    </NavSection>
                );
            })}
        </svg>
    );
}
