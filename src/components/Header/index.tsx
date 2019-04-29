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
    if (!props.activePage.showHeader) {
        return null;
    }

    return (
        <header className={styles.header}>
            <div className={styles.titleContainer}>
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
