import * as classNames from "classnames";
import { without } from "lodash";
import * as React from "react";

import Essay from "../../essay/entity/Essay";

const styles = require("./style.css");

interface ScrollHelperState {
    show: boolean;
}

interface ScrollHelperProps {
    className?: string;
    activePage: Page;
}

export default class ScrollHelper extends React.Component<ScrollHelperProps, ScrollHelperState> {
    constructor(props: ScrollHelperProps) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidUpdate(prevProps: ScrollHelperProps, prevState) {
        const { activePage } = this.props;
        console.log(activePage.id, prevProps.activePage.id);
        if (activePage.id !== prevProps.activePage.id && !activePage.advanceOnExit) {
            this.setState({ show: false });
            if (activePage.media) {
                const delay = activePage.media.endTime - activePage.media.startTime;
                console.log(delay, activePage.media);
                setTimeout(() => {
                    this.setState({ show: true });
                }, delay * 1000);
            }
        }
    }

    render() {
        const { activePage } = this.props;

        // navigate to splash page on title click
        let transition;

        return (
            <div
                className={classNames({
                    [styles.container]: true,
                    [styles.twoColumn]: activePage.layout === "two-column",
                    [styles.oneColumn]: activePage.layout === "one-column",
                    [styles.show]: !activePage.showAllenCellHeader && this.state.show,
                })}
            >
                <div>Scroll to continue</div>
                <svg
                    className={styles.scrollHint}
                    viewBox="0 0 866 1000"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M63 280c0 0 370 356 370 356c0 0 372 -356 372 -356c14.667 -17.333 30.667 -17.333 48 0c17.333 14.667 17.333 30.667 0 48c0 0 -396 392 -396 392c-14.667 14.667 -30.667 14.667 -48 0c0 0 -396 -392 -396 -392c-17.333 -17.333 -17.333 -33.333 0 -48c16 -16 32.667 -16 50 0c0 0 0 0 0 0" />
                </svg>
            </div>
        );
    }
}
