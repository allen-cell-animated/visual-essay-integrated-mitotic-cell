import * as React from "react";

interface RichTextProps {
    className?: string;
    element: string; // "p", "h3", etc
    innerText?: string;
}

export default function RichText(props: RichTextProps) {
    const richText = { __html: props.innerText };
    return React.createElement(props.element, {
        className: props.className,
        dangerouslySetInnerHTML: richText,
    });
}
