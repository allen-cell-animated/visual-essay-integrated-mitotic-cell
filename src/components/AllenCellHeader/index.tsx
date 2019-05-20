import * as classNames from "classnames";
import * as React from "react";
import Essay from "../../essay/entity/Essay";

import links, { Link } from "./links";

const styles = require("./style.css");

interface AllenHeaderProps {
    className?: string;
    essay: Essay;
}

interface HeaderLinkProps {
    link: Link;
}

const HeaderLink: React.FunctionComponent<HeaderLinkProps> = (props: HeaderLinkProps) => {
    return (
        <div className={styles.link}>
            <a href={props.link.href}>{props.link.display}</a>
        </div>
    );
};

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
            <a className={styles.logoContainer} href="https://allencell.org">
                <img
                    className={styles.logo}
                    src="/assets/allencell-header/allencell-logo-white.png"
                    alt="Allen Cell Explorer Home Page"
                />
            </a>
            <div className={styles.linksContainer}>
                {links.map((link) => (
                    <HeaderLink key={link.href} link={link} />
                ))}
            </div>
        </header>
    );
}
