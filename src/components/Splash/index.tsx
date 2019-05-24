import * as classNames from "classnames";
import * as React from "react";

import { InteractivePageProps } from "../InteractiveByPageGroup";

const styles = require("./style.css");

export default class Splash extends React.Component<InteractivePageProps> {
    constructor(props: InteractivePageProps) {
        super(props);

        this.onWhatIsItClick = this.onWhatIsItClick.bind(this);
        this.on3DViewerClick = this.on3DViewerClick.bind(this);
    }

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
            <button
                className={classNames(styles.button, styles.left)}
                onClick={this.onWhatIsItClick}
                type="button"
            >
                What is it?
            </button>
        );
    }

    private onWhatIsItClick(): void {
        const { essay } = this.props;

        const whatIsItChapter = essay.findChapterById("what-is-it");

        if (!whatIsItChapter) {
            throw new Error("Cannot jump to page: 'what-is-it' chapter could not be found");
        }

        essay.jumpTo(whatIsItChapter.firstPage);
    }

    /**
     * Jump user to 3D Viewer
     */
    private render3DViewerButton(): JSX.Element {
        return (
            <button
                className={classNames(styles.button, styles.right)}
                onClick={this.on3DViewerClick}
                type="button"
            >
                3D Viewer
            </button>
        );
    }

    private on3DViewerClick(): void {
        const { essay } = this.props;

        const threeDViewerChapter = essay.findChapterById("3d-viewer");

        if (!threeDViewerChapter) {
            throw new Error("Cannot jump to page: '3d-viewer' chapter could not be found");
        }

        essay.jumpTo(threeDViewerChapter.firstPage);
    }

    /**
     * Pictogram by Daniel Bruce (www.entypo.com)
     * License: https://creativecommons.org/licenses/by-sa/4.0/.
     */
    private renderTitleAndScrollHint(): JSX.Element {
        return (
            <header className={styles.heading}>
                <h1 className={styles.title}>The Integrated Mitotic Stem Cell</h1>
                <button className={styles.scrollHintContainer} onClick={this.onWhatIsItClick}>
                    <p className={styles.scrollHint}>Begin exploring</p>
                    <svg
                        className={styles.scrollHint}
                        viewBox="0 0 866 1000"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M63 280c0 0 370 356 370 356c0 0 372 -356 372 -356c14.667 -17.333 30.667 -17.333 48 0c17.333 14.667 17.333 30.667 0 48c0 0 -396 392 -396 392c-14.667 14.667 -30.667 14.667 -48 0c0 0 -396 -392 -396 -392c-17.333 -17.333 -17.333 -33.333 0 -48c16 -16 32.667 -16 50 0c0 0 0 0 0 0" />
                    </svg>
                </button>
            </header>
        );
    }
}
