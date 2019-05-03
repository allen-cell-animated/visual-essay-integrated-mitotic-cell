import * as classNames from "classnames";
import * as React from "react";

import RichText from "../RichText";

interface UncontrolledVideoProps {
    caption?: string;
    captionClassName?: string;
    containerClassName?: string;
    controls: boolean; // show native video controls
    loop: boolean;
    source: string[][];
    videoClassName?: string;
}

/**
 * Renders an HTMLVideoElement, optionally with its native controls and optionally looping.
 *
 */
export default function UncontrolledVideo(props: UncontrolledVideoProps) {
    return (
        <figure className={classNames(props.containerClassName)}>
            <video
                className={props.videoClassName}
                controls={props.controls}
                loop={props.loop}
                muted={true}
            >
                {props.source.map(([url, contentType]) => (
                    <source key={url} src={url} type={contentType} />
                ))}
            </video>
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

UncontrolledVideo.defaultProps = {
    controls: true,
    loop: false,
};
