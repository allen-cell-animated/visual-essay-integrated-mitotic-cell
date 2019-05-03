import * as classNames from "classnames";
import * as React from "react";

import RichText from "../RichText";

const styles = require("./style.css");

interface ImageProps {
    caption?: string;
    captionClassName?: string;
    containerClassName?: string;
    imgClassName?: string;
    source: string;
}

export default function Image(props: ImageProps) {
    return (
        <figure className={classNames(styles.figure, props.containerClassName)}>
            <img
                className={classNames(styles.image, props.imgClassName)}
                decoding="async"
                src={props.source}
            />
            {props.caption && (
                <RichText
                    className={props.captionClassName}
                    element="figcaption"
                    innerText={props.caption}
                />
            )}
        </figure>
    );
}
