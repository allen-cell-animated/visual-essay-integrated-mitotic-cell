import * as React from "react";

import Page from "../../essay/entity/Page";

const styles = require("./style.css");

interface NavItemProps {
    active: boolean;
    height: number;
    onClick: (page: Page) => void;
    page: Page;
    width: number;
}

export default function NavItem(props: NavItemProps) {
    return (
        <g>
            <rect height={props.height} fill="black" fillOpacity="0" width={props.width} />
            <circle
                className={props.active ? styles.active : styles.inactive}
                cx={props.width / 2}
                cy={props.height / 2}
            />
            <text />
        </g>
    );
}
