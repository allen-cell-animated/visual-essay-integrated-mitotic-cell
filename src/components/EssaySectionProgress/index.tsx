import * as React from "react";
import * as classNames from "classnames";

const styles = require("./style.css");

interface EssaySectionProgress {
    percentComplete: number;
    progressMeterClassName?: string;
    relativeLength: number;
    title: string;
}

export default function EssaySectionProgress({
    percentComplete,
    progressMeterClassName,
    relativeLength,
    title,
}: EssaySectionProgress) {
    const trackClassNames = classNames(styles.track, {
        [styles.rounded]: percentComplete < 1,
    });
    const trackStyles = { width: `${percentComplete * 100}%` };

    return (
        <div
            className={styles.container}
            style={{ flex: `${relativeLength} 0 auto` }}
        >
            <div
                className={classNames(
                    styles.progressMeter,
                    progressMeterClassName
                )}
            >
                <div className={trackClassNames} style={trackStyles} />
            </div>
            <h4>{title}</h4>
        </div>
    );
}
