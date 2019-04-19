import Page from "../../essay/entity/Page";
import Section from "../../essay/entity/Section";

import Navigation from "../Navigation";
import * as React from "react";

const styles = require("./style.css");

interface HeaderProps {
    activePage: Page;
    className?: string;
    sections: Section[];
}

export default function Header(props: HeaderProps) {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Integrated Mitotic Stem Cell</h1>
            <Navigation
                activePage={props.activePage}
                className={styles.nav}
                sections={props.sections}
            />
        </header>
    );
}
