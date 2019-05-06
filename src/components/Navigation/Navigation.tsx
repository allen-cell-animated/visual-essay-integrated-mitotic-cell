import * as classNames from "classnames";
import * as React from "react";

import Essay from "../../essay/entity/Essay";

import Arrow, { ArrowDirection } from "./Arrow";
import NavChapter from "./NavChapter";
import NavSection from "./NavSection";
import { getNavConfig } from "./selectors";

const styles = require("./nav-style.css");

interface NavigationProps {
    className?: string;
    essay: Essay;
}

// dimensions at which SVG was designed; scale the graphic accordingly
const SVG_DESIGN_WIDTH = 911;
const SVG_DESIGN_HEIGHT = 66;

export default function Navigation(props: NavigationProps) {
    const { essay } = props;

    return (
        <div className={classNames(styles.container, props.className)}>
            <Arrow
                className={classNames(styles.arrow, styles.left)}
                direction={ArrowDirection.LEFT}
                disabled={essay.activePage.sortOrder === 0}
                onClick={() => essay.reverse()}
            />
            <svg
                className={styles.mainNav}
                viewBox={`0 0 ${SVG_DESIGN_WIDTH} ${SVG_DESIGN_HEIGHT}`}
                pointerEvents="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {getNavConfig(essay.sections).map((navSectionConfig) => {
                    return (
                        <NavSection
                            active={navSectionConfig.section === essay.activePage.chapter.section}
                            key={navSectionConfig.section.id}
                            height={SVG_DESIGN_HEIGHT}
                            label={navSectionConfig.label}
                            onClick={() => essay.jumpTo(navSectionConfig.section.firstPage)}
                            translateX={navSectionConfig.translateX}
                            width={navSectionConfig.width}
                        >
                            {navSectionConfig.chapters.map((navChapterConfig) => (
                                <NavChapter
                                    chapterIsActive={
                                        navChapterConfig.chapter === essay.activePage.chapter
                                    }
                                    key={navChapterConfig.chapter.id}
                                    label={navChapterConfig.label}
                                    onClick={() => essay.jumpTo(navChapterConfig.chapter.firstPage)}
                                    sectionIsActive={
                                        navSectionConfig.section ===
                                        essay.activePage.chapter.section
                                    }
                                    translateX={navChapterConfig.translateX}
                                    translateY={SVG_DESIGN_HEIGHT / 2}
                                />
                            ))}
                        </NavSection>
                    );
                })}
            </svg>
            <Arrow
                className={classNames(styles.arrow, styles.right)}
                direction={ArrowDirection.RIGHT}
                disabled={essay.activePage.sortOrder === essay.pages.length - 1}
                onClick={() => essay.advance()}
            />
        </div>
    );
}
