import * as classNames from "classnames";

import { Page } from "../../essay/entity/BasePage";
import Section from "../../essay/entity/Section";

import Navigation from "../Navigation";
import * as React from "react";

const styles = require("./style.css");

interface HeaderProps {
    activePage: Page;
    className?: string;
    onNavigation: (page: Page) => void;
    sections: Section[];
}

export default function Header(props: HeaderProps) {
    // navigate to splash page on title click
    const onTitleClick = () => {
        const firstPage = props.sections[0].firstPage;
        props.onNavigation(firstPage);
    };

    return (
        <header
            className={classNames(styles.header, {
                [styles.show]: props.activePage.showHeader,
            })}
        >
            <div onClick={onTitleClick} className={styles.titleContainer}>
                <h1 className={styles.title}>Integrated Mitotic Stem Cell</h1>
            </div>
            <Navigation
                activePage={props.activePage}
                className={styles.nav}
                onNavigation={props.onNavigation}
                sections={props.sections}
            />
        </header>
    );
}
