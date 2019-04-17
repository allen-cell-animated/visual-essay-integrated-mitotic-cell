import * as React from "react";

const styles = require("./style.css");

interface ImageProps {
    caption?: string;
    source: string;
}

export default function Image(props: ImageProps) {
    return (
        <figure className={styles.figure}>
            <img className={styles.image} decoding="async" src={props.source} />
            {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
    );
}
