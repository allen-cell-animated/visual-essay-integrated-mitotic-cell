import * as React from "react";

import EssaySectionProgress from "../../components/EssaySectionProgress";

const styles = require("./style.css");

/**
 * This is a stub for the progress meter that will live at the top of the web page. `EssaySectionProgress`s will be
 * dynamically created out of application state, and this container will be connected to the Redux store.
 */
export default function Progress() {
    return (
        <nav className={styles.nav}>
            <EssaySectionProgress
                percentComplete={1}
                relativeLength={0.1}
                title="Introduction"
            />
            <EssaySectionProgress
                percentComplete={1}
                relativeLength={0.3}
                title="How we made the integrated mitotic stem cell"
            />
            <EssaySectionProgress
                percentComplete={0.4}
                relativeLength={0.4}
                title="Our observations"
            />
            <EssaySectionProgress
                percentComplete={0}
                relativeLength={0.1}
                title="Explore the data"
            />
            <EssaySectionProgress
                percentComplete={0}
                progressMeterClassName={styles.noBorderRight}
                relativeLength={0.1}
                title="Appendix"
            />
        </nav>
    );
}
