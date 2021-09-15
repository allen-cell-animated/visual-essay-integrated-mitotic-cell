import * as classNames from "classnames";
import * as React from "react";
import Essay from "../../essay/entity/Essay";
import aicsLogo from "../../logos/AICS-logo-full.png";

const styles = require("./style.css");

interface AllenHeaderProps {
    className?: string;
    essay: Essay;
}

/**
 * Simplified version of the allencell.org showAllenCellHeader created in Weebly.
 */
export default function AllenCellHeader(props: AllenHeaderProps) {
    const { essay } = props;

    return (
        <header
            className={classNames(styles.header, {
                [styles.show]: essay.activePage.showAllenCellHeader,
            })}
        >
            <div className={styles.pageHeader}>
                <div>
                    <a href="https://allencell.org" title="Allen Cell Explorer">
                        <img
                            className={styles.logo}
                            src={aicsLogo}
                            alt="Allen Cell Explorer Home Page"
                        />
                    </a>
                    <span className={styles.verticalBar}>|</span>
                    Integrated Mitotic Stem Cell
                </div>
            </div>
        </header>
    );
}
