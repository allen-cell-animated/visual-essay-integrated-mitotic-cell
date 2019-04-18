import * as React from "react";

interface UncontrolledVideoProps {
    className?: string;
    controls: boolean; // show native video controls
    loop: boolean;
    source: string[][];
}

/**
 * Renders an HTMLVideoElement, optionally with its native controls and optionally looping.
 *
 */
export default function UncontrolledVideo(props: UncontrolledVideoProps) {
    return (
        <video className={props.className} controls={props.controls} loop={props.loop} muted={true}>
            {props.source.map(([url, contentType]) => (
                <source key={url} src={url} type={contentType} />
            ))}
        </video>
    );
}

UncontrolledVideo.defaultProps = {
    controls: true,
    loop: false,
};
