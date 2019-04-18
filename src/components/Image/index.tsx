import * as classNames from "classnames";
import * as React from "react";

const styles = require("./style.css");

interface ImageProps {
    caption?: string;
    className?: string;
    source: string;
}

export default function Image(props: ImageProps) {
    return (
        <figure className={styles.figure}>
            <img
                className={classNames(styles.image, props.className)}
                decoding="async"
                src={props.source}
            />
            {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
    );
}
