import * as classNames from "classnames";
import * as React from "react";

import ControlledVideo from "../ControlledVideo";
import { InteractivePageProps } from "../InteractiveByPageGroup";
import { Position } from "../VisibilityStatus";

const styles = require("./style.css");

export default class Splash extends React.Component<InteractivePageProps> {
    private static MOVIE_SOURCE =
        "https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/IMSC-2019_1920x1080_MainMedia_1.mp4";

    public render(): JSX.Element {
        const { className } = this.props;

        return (
            <>
                {this.renderMovie()}
                <section className={classNames(className, styles.section)}>
                    <div className={styles.container}>
                        {this.renderWhatIsItButton()}
                        {this.render3DViewerButton()}
                        {this.renderTitle()}
                        {this.renderScrollHint()}
                    </div>
                </section>
            </>
        );
    }

    private renderMovie(): JSX.Element {
        const { position } = this.props;

        const inViewport = position === Position.IN_VIEWPORT;

        return (
            <ControlledVideo
                active={inViewport}
                className={classNames(styles.movie, {
                    [styles.entered]: inViewport,
                })}
                endTime={0}
                loop={false}
                source={[[Splash.MOVIE_SOURCE, "video/mp4"]]}
                startTime={0}
            />
        );
    }

    /**
     * Jump user to first page of first chapter of first section
     */
    private renderWhatIsItButton(): JSX.Element {
        return (
            <button className={classNames(styles.button, styles.left)} type="button">
                What is it?
            </button>
        );
    }

    /**
     * Jump user to 3D Viewer
     */
    private render3DViewerButton(): JSX.Element {
        return (
            <button className={classNames(styles.button, styles.right)} type="button">
                3D Viewer
            </button>
        );
    }

    private renderTitle(): JSX.Element {
        return <h1 className={styles.title}>The Integrated Mitotic Stem Cell</h1>;
    }

    /**
     * Let the user know this thing works by "scrolling" the page.
     */
    private renderScrollHint(): JSX.Element {
        return <p className={styles.scrollHint}>Scroll</p>;
    }
}
