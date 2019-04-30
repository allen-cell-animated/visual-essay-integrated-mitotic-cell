import * as classNames from "classnames";
import * as React from "react";

import { InteractivePageProps } from "../InteractiveByPageGroup";

const styles = require("./style.css");

export default class Splash extends React.Component<InteractivePageProps> {
    public render(): JSX.Element {
        const { className } = this.props;

        return (
            <section className={classNames(className, styles.section)}>
                <div className={styles.container}>
                    {this.renderWhatIsItButton()}
                    {this.render3DViewerButton()}
                    {this.renderTitleAndScrollHint()}
                </div>
            </section>
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

    private renderTitleAndScrollHint(): JSX.Element {
        return (
            <header className={styles.heading}>
                <h1 className={styles.title}>The Integrated Mitotic Stem Cell</h1>
                <p className={styles.scrollHint}>Scroll</p>
                <svg
                    className={styles.scrollHint}
                    viewBox="0 0 866 1000"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g fill="#ffffff">
                        <path d="M63 280c0 0 370 356 370 356c0 0 372 -356 372 -356c14.667 -17.333 30.667 -17.333 48 0c17.333 14.667 17.333 30.667 0 48c0 0 -396 392 -396 392c-14.667 14.667 -30.667 14.667 -48 0c0 0 -396 -392 -396 -392c-17.333 -17.333 -17.333 -33.333 0 -48c16 -16 32.667 -16 50 0c0 0 0 0 0 0" />
                    </g>
                </svg>
            </header>
        );
    }
}
