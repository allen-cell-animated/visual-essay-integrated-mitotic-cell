import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface RichTextProps {
    className?: string;
    element: string; // "p", "h3", etc
    innerText?: string;
}

export default function RichText(props: RichTextProps) {
    const richText = { __html: props.innerText };
    return React.createElement(props.element, {
        className: classNames(styles.container, props.className),
        dangerouslySetInnerHTML: richText,
    });
}
