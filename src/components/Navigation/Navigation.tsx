import * as classNames from "classnames";
import * as React from "react";

import Essay from "../../essay/entity/Essay";

import Arrow, { ArrowDirection } from "./Arrow";
import NavChapter from "./NavChapter";
import NavSection from "./NavSection";
import { getNavPoints } from "./selectors";

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
            />
            <svg
                className={styles.mainNav}
                viewBox={`0 0 ${SVG_DESIGN_WIDTH} ${SVG_DESIGN_HEIGHT}`}
                pointerEvents="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {getNavPoints(essay.sections).map((navSection) => {
                    return (
                        <NavSection
                            active={navSection.section === essay.activePage.chapter.section}
                            key={navSection.section.id}
                            height={SVG_DESIGN_HEIGHT}
                            label={navSection.label}
                            onClick={() => essay.jumpTo(navSection.section.firstPage)}
                            translateX={navSection.translateX}
                            width={navSection.width}
                        >
                            {navSection.chapters.map((navChapter) => (
                                <NavChapter
                                    chapterIsActive={
                                        navChapter.chapter === essay.activePage.chapter
                                    }
                                    key={navChapter.chapter.id}
                                    label={navChapter.label}
                                    onClick={() => essay.jumpTo(navChapter.chapter.firstPage)}
                                    sectionIsActive={
                                        navSection.section === essay.activePage.chapter.section
                                    }
                                    translateX={navChapter.translateX}
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
            />
        </div>
    );
}
