import * as React from "react";

interface TextProps {
    element: string; // "p", "h3", etc
    innerText?: string;
}

export default function Text(props: TextProps) {
    const richText = { __html: props.innerText };
    return React.createElement(props.element, { dangerouslySetInnerHTML: richText });
}
