import * as classNames from "classnames";
import * as React from "react";

import Essay from "../../essay/entity/Essay";

import Navigation from "../Navigation";

const styles = require("./style.css");

interface HeaderProps {
    className?: string;
    essay: Essay;
}

/**
 * Header specific to the IMSC application. Renders primary application title and navigation UI.
 */
export default function IMSCHeader(props: HeaderProps) {
    const { essay } = props;

    // navigate to splash page on title click
    const onTitleClick = () => {
        const firstPage = essay.sections[0].firstPage;
        essay.jumpTo(firstPage);
    };

    return (
        <header
            className={classNames(styles.header, {
                [styles.show]: !essay.activePage.showAllenCellHeader, // only show if allencell header is hidden
            })}
        >
            <div onClick={onTitleClick} className={styles.titleContainer}>
                <h1 className={styles.title}>Integrated Mitotic Stem Cell</h1>
            </div>
            <Navigation className={styles.nav} essay={essay} />
        </header>
    );
}
