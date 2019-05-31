import * as classNames from "classnames";
import { without } from "lodash";
import * as React from "react";

import Chapter from "../../essay/entity/Chapter";
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

// dimensions at which SVG was designed (used in viewBox); scale the graphic accordingly
const SVG_DESIGN_WIDTH = 805;
const SVG_DESIGN_HEIGHT = 50;

export default function Navigation(props: NavigationProps) {
    const { essay } = props;

    const [hoveredChapter, setHoveredChapter] = React.useState<Chapter | undefined>(undefined);

    // In SVG, sort order is defined by document render order; an element is higher in the stacking
    // order the lower it is in the document. For a hovered chapter label to appear "on top" of a
    // selected chapter label, the selected chapter must always be rendered before the rest so that
    // it is lowest in the stacking order. That means the section the selected chapter is in must be rendered first
    // among the sections, and within the active section itself, the selected chapter must be rendered first among its
    // sibling chapters.
    const navSectionConfigs = getNavConfig(essay.sections);
    const activeSection = navSectionConfigs.find(
        (s) => s.section === essay.activePage.chapter.section
    );
    const sections =
        activeSection !== undefined
            ? [activeSection, ...without(navSectionConfigs, activeSection)]
            : navSectionConfigs;

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
                pointerEvents="none"
                viewBox={`0 0 ${SVG_DESIGN_WIDTH} ${SVG_DESIGN_HEIGHT}`}
                xmlns="http://www.w3.org/2000/svg"
            >
                {sections.map((navSectionConfig) => {
                    // see note above regarding SVG render order and stacking order
                    const selectedChapter = navSectionConfig.chapters.find(
                        (c) => c.chapter === essay.activePage.chapter
                    );
                    const chapters =
                        selectedChapter !== undefined
                            ? [
                                  selectedChapter,
                                  ...without(navSectionConfig.chapters, selectedChapter),
                              ]
                            : navSectionConfig.chapters;

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
                            {chapters.map((navChapterConfig, index) => (
                                <NavChapter
                                    chapter={navChapterConfig.chapter}
                                    chapterIsSelected={
                                        navChapterConfig.chapter === essay.activePage.chapter
                                    }
                                    key={navChapterConfig.chapter.id}
                                    hoveredChapter={hoveredChapter}
                                    label={navChapterConfig.label}
                                    lastInSection={index === chapters.length - 1}
                                    setSelected={() =>
                                        essay.jumpTo(navChapterConfig.chapter.firstPage)
                                    }
                                    setHovered={() => setHoveredChapter(navChapterConfig.chapter)}
                                    unsetHovered={() => setHoveredChapter(undefined)}
                                    sectionIsSelected={
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
