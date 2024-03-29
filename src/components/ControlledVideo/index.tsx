import * as React from "react";

interface ControlledVideoProps {
    active: boolean;
    className?: string;
    endTime: number; // seconds
    loop: boolean;
    onEnd: () => void;
    source: string[][];
    startTime: number; // seconds
}

/**
 * Renders an HTMLVideoElement and encapsulates seek behavior.
 *
 * Given a startTime and an endTime for a segment of the video, this component, while active, will continuously seek forward
 * (or backward, depending on where its currentTime is) to some targetTime. In certain situations we speed up playback speed
 * (essentially fast forward or fast rewind) to "catch up" to where the rest of the essay is.
 */
export default class ControlledVideo extends React.Component<ControlledVideoProps, {}> {
    static defaultProps = {
        active: false,
        controls: false,
        loop: false,
        onEnd: () => {},
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

    private playing: boolean = false;
    private targetTime: number = 0;
    private video: React.RefObject<HTMLVideoElement>;

    constructor(props: ControlledVideoProps) {
        super(props);

        this.targetTime = props.endTime;

        this.video = React.createRef<HTMLVideoElement>();
        this.seekVideo = this.seekVideo.bind(this);
    }

    public componentDidMount() {
        // if mounting from a "deeplink" to somewhere deep in the essay, set currentTime to start time
        if (this.video.current && this.video.current.currentTime !== this.props.startTime) {
            this.video.current.currentTime = this.props.startTime;
        }

        if (this.props.active) {
            this.seekVideo();
        }
    }

    public componentDidUpdate(prevProps: ControlledVideoProps) {
        if (prevProps.endTime !== this.props.endTime) {
            if (this.video.current) {
                this.pause();

                if (this.props.startTime > prevProps.startTime) {
                    // ensure at the proper start time if advancing forward
                    this.video.current.currentTime = this.props.startTime;
                } else if (this.video.current.currentTime > this.props.endTime) {
                    // if moving backward, set current time to endTIme
                    this.video.current.currentTime = this.props.endTime;
                }
            }

            // marker has changed, so update targetTime
            this.targetTime = this.props.endTime;
        }

        if (this.props.active && !prevProps.active) {
            this.seekVideo();
        }
    }

    public render(): JSX.Element {
        return (
            <video
                className={this.props.className}
                muted
                playsInline
                preload="auto"
                ref={this.video}
            >
                {this.props.source.map(([url, contentType]) => (
                    <source key={url} src={url} type={contentType} />
                ))}
            </video>
        );
    }

    private play(): void {
        if (this.video.current && !this.playing) {
            const promiseToPlay = this.video.current.play();

            // Older browsers (and Edge) will not return a promise
            // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#Return_value
            if (promiseToPlay !== undefined) {
                promiseToPlay.then(() => (this.playing = true));
            } else {
                this.playing = true;
            }
        }
    }

    private pause(): void {
        // Checking if video is playing before attempting to pause avoids throwing an exception that can occur when
        // cancelling a "play request" before playing has actually begun.
        if (this.video.current && this.playing) {
            this.playing = false;
            this.video.current.pause();
        }
    }

    /**
     * While video is active, continuously seek forward or backward depending on where video's currentTime is in relation to targetTime.
     * Once video is within SEEK_PRECISION of targetTime, idle until targetTime changes.
     *
     * Algorithm adapated from https://www.nrk.no/vitenskapen-bak-medaljen-_-didrik-tonseth-1.14405976.
     */
    private seekVideo() {
        const tick = () => {
            if (this.video.current) {
                const targetTimeOffset = this.targetTime - this.video.current.currentTime;

                if (targetTimeOffset >= 0) {
                    // playing forward

                    if (targetTimeOffset < ControlledVideo.SEEK_PRECISION) {
                        // we're basically there, so just pause
                        this.pause();

                        if (this.props.loop) {
                            this.video.current.currentTime = this.props.startTime;
                        } else {
                            this.video.current.currentTime = this.targetTime;
                            this.props.onEnd();
                        }
                    } else {
                        // keep on playing
                        this.play();
                    }
                } else {
                    // moving backward. don't rewind, just stop the video if it is playing.
                    this.pause();

                    // ensure we're at the endTime of the current marker; important in the case that the user has
                    // navigated to another tab (or any other time rAF doesn't fire) and the video has played beyond
                    // targetTime
                    this.video.current.currentTime = this.targetTime;
                }
            }

            if (this.props.active) {
                window.requestAnimationFrame(tick);
            } else {
                this.pause();
            }
        };

        window.requestAnimationFrame(tick);
    }
}
