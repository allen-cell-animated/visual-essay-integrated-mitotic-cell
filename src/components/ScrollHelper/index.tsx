import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";
import { ResolvedControlledVideoReference } from "../../essay/config";

const styles = require("./style.css");

interface ScrollHelperState {
    show: boolean;
}

interface ScrollHelperProps {
    className?: string;
    activePage: Page;
}

export default class ScrollHelper extends React.Component<ScrollHelperProps, ScrollHelperState> {
    private showHelperTimeOut: NodeJS.Timeout | null = null;

    constructor(props: ScrollHelperProps) {
        super(props);
        this.state = {
            show: false,
        };
    }

    componentDidUpdate(prevProps: ScrollHelperProps) {
        const { activePage } = this.props;
        const media = activePage.media as ResolvedControlledVideoReference;

        if (activePage.id !== prevProps.activePage.id) {
            // if they scroll before the movie is done
            if (this.showHelperTimeOut) {
                clearTimeout(this.showHelperTimeOut);
            }
            this.setState({ show: false });

            if (media && !media.advanceOnExit) {
                const delay = media.endTime - media.startTime;
                this.showHelperTimeOut = setTimeout(() => {
                    this.setState({ show: true });
                }, delay * 1000);
            }
        }
    }

    render() {
        const { activePage } = this.props;

        return (
            <div
                className={classNames({
                    [styles.container]: true,
                    [styles.show]: !activePage.showAllenCellHeader && this.state.show,
                })}
            >
                <div>scroll</div>
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
