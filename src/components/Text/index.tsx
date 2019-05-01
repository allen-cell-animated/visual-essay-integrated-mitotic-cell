import * as React from "react";
const styles = require("./style.css");

interface TextProps {
    element: string; // "p", "h3", etc
    innerText?: string;
}

export default function Text(props: TextProps) {
    const richText = { __html: props.innerText };
    return React.createElement(props.element, {
        dangerouslySetInnerHTML: richText,
        className: styles.container,
    });
}
