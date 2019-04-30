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
                    {this.renderTitle()}
                    {this.renderScrollHint()}
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
