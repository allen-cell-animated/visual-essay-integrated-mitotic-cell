import * as React from "react";

interface VideoProps {
    active: boolean;
    endTime: number; // seconds
    loop: boolean;
    source: [string, string][];
    startTime: number; // seconds
}

/**
 * Renders an HTMLVideoElement and encapsulates seek behavior.
 *
 * Given a startTime and an endTime for a segment of the video, this component, while active, will continuously seek forward
 * (or backward, depending on where its currentTime is) to some targetTime. In certain situations we speed up playback speed
 * (essentially fast forward or fast rewind) to "catch up" to where the rest of the essay is.
 */
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

    // Fudge factor within which to consider video currentTime and targetTime equal.
    // This is necessary because as soon as we've checked a playing video's current time, it has already advanced in time.
    private static SEEK_PRECISION = 0.1;

    private static REGULAR_PLAYBACK_SPEED = 1;
    private static FAST_PLAYBACK_SPEED = 10;

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
                {this.props.source.map(([url, contentType]) => (
                    <source key={url} src={url} type={contentType} />
                ))}
            </video>
        );
    }

    /**
     * While video is active, continuously seek forward or backward depending on where video's currentTime is in relation to targetTime.
     * Once video is within SEEK_PRECISION of targetTime, idle until targetTime changes.
     *
     * Algorithm adapated from https://www.nrk.no/vitenskapen-bak-medaljen-_-didrik-tonseth-1.14405976.
     */
    private seekVideo() {
        let prevTimestamp: number;

        const tick = (timestamp: number) => {
            if (!prevTimestamp) {
                prevTimestamp = timestamp;
            }

            if (this.video.current) {
                const targetTimeOffset = this.targetTime - this.video.current.currentTime;

                // playing forward
                if (targetTimeOffset >= 0) {
                    // we're basically there, so just pause
                    if (targetTimeOffset < Video.SEEK_PRECISION) {
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

                    // seeking backward
                } else {
                    if (this.playing) {
                        this.playing = false;
                        this.video.current.pause();
                    }

                    // take how long between ticks into consideration for how far to jump backward
                    const dt = (timestamp - prevTimestamp) / 1000;
                    const nextTime = Video.toFixed(
                        this.video.current.currentTime - dt * this.getPlaybackRate(),
                        2
                    );

                    if (Math.abs(nextTime - this.targetTime) < Video.SEEK_PRECISION) {
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
     * Similarly, moving backward should do a fast seek backward.
     *
     * Returns either 1 or 10 (fast!). In the future, this could be more of a scale (quadratic?) based on how far
     * the video needs to seek.
     */
    private getPlaybackRate(): number {
        if (!this.video.current) {
            return Video.REGULAR_PLAYBACK_SPEED;
        }

        const targetTimeOffset = this.targetTime - this.video.current.currentTime;
        const needsToFastForward =
            targetTimeOffset >= 0 && this.video.current.currentTime < this.props.startTime;
        const needsToFastRewind =
            targetTimeOffset < 0 && this.video.current.currentTime > this.props.endTime;

        if (needsToFastForward || needsToFastRewind) {
            return Video.FAST_PLAYBACK_SPEED;
        }

        return Video.REGULAR_PLAYBACK_SPEED;
    }
}
