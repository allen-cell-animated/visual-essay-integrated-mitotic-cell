import { castArray } from "lodash";
import * as React from "react";

interface VideoProps {
    active: boolean;
    endTime: number;
    loop: boolean;
    source: string;
    startTime: number;
}

export default class Video extends React.Component<VideoProps, {}> {
    static defaultProps = {
        active: false,
        loop: false,
    };

    /**
     * Apply `Number::toFixed` on `float`, return *as number*. Provides default for number of decimals in `Number::toFixed` operation.
     */
    private static toFixed(float: number, numDecimals: number = 1): number {
        return Number.parseFloat(float.toFixed(numDecimals));
    }

    private playing: boolean = false;
    private targetTime: number = 0;
    private video: React.RefObject<HTMLVideoElement>;

    constructor(props: VideoProps) {
        super(props);

        this.targetTime = props.endTime;

        this.video = React.createRef<HTMLVideoElement>();
        this.seekVideo = this.seekVideo.bind(this);
    }

    public componentDidUpdate(prevProps: VideoProps) {
        // TODO: moving backward -- should targetTime be startTime?
        if (prevProps.endTime !== this.props.endTime) {
            this.targetTime = this.props.endTime;
        }

        if (this.props.active && !prevProps.active) {
            this.seekVideo();
        }
    }

    public render(): JSX.Element {
        return (
            <video muted={true} ref={this.video}>
                {castArray(this.props.source).map((src) => {
                    if (Array.isArray(src)) {
                        const [url, contentType] = src;
                        return (
                            <source key={url} src={url} type={contentType} />
                        );
                    }

                    return <source key={src} src={src} />;
                })}
            </video>
        );
    }

    private seekVideo() {
        let prevTimestamp: number;

        const tick = (timestamp: number) => {
            if (!prevTimestamp) {
                prevTimestamp = timestamp;
            }

            if (this.video.current) {
                const diff = this.targetTime - this.video.current.currentTime;

                if (diff >= 0) {
                    // playing forward

                    // we're basically there, so just pause
                    if (diff < 0.1) {
                        this.playing = false;
                        this.video.current.pause();

                        if (this.props.loop) {
                            this.video.current.currentTime = this.props.startTime;
                        } else {
                            this.video.current.currentTime = this.targetTime;
                        }

                        // keep on playing
                    } else {
                        this.video.current.playbackRate = this.getPlaybackRate();

                        if (!this.playing) {
                            this.playing = true;
                            this.video.current.play();
                        }
                    }
                } else {
                    // seeking backward
                    if (this.playing) {
                        this.video.current.pause();
                    }

                    const dt = (timestamp - prevTimestamp) / 1000;
                    const nextTime = Video.toFixed(
                        this.video.current.currentTime -
                            dt * this.getPlaybackRate(),
                        2
                    );

                    if (Math.abs(nextTime - this.targetTime) < 0.1) {
                        this.video.current.currentTime = this.targetTime;
                    } else if (this.video.current.currentTime !== nextTime) {
                        this.video.current.currentTime = nextTime;
                    }
                }
            }

            prevTimestamp = timestamp;
            if (this.props.active) {
                window.requestAnimationFrame(tick);
            }
        };

        window.requestAnimationFrame(tick);
    }

    /**
     * If user jumps ahead, need to speed up video to keep media coordinated with text.
     * Similarly, moving backward quickly should do a fast seek backward.
     *
     * Returns either 1 or 10 (fast!). In the future, this could be more of a scale (quadratic?) based on how far
     * the video needs to seek.
     */
    private getPlaybackRate(): number {
        if (!this.video.current) {
            return 1;
        }

        const diff = this.targetTime - this.video.current.currentTime;
        if (diff >= 0) {
            if (this.video.current.currentTime < this.props.startTime) {
                return 10; // fast forward
            } else {
                return 1; // normal playback
            }
        } else {
            if (this.video.current.currentTime > this.props.endTime) {
                return 10; // fast rewind
            } else {
                return 1; // normal rewind playback
            }
        }
    }
}
