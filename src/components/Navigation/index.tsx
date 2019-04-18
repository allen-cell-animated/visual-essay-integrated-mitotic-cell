import * as React from "react";
import Page from "../../essay/entity/Page";
import Section from "../../essay/entity/Section";
import Chapter from "../../essay/entity/Chapter";

interface NavigationProps {
    activePage: Page;
    sections: Section[];
    chapters: Chapter[];
}

export default function Navigation(props: NavigationProps) {
    return <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" />;
}
