import * as classNames from "classnames";
import * as React from "react";

const styles = require("./arrow.css");

export enum ArrowDirection {
    LEFT = "left",
    RIGHT = "right",
}

interface ArrowProps {
    direction: ArrowDirection;
    disabled: boolean;
    onClick: () => void;
}

const DIRECTION_TO_TRANSFORM_MAP = {
    [ArrowDirection.LEFT]: "rotate(0)", // no translation, raw SVG is already a left-pointing arrow
    [ArrowDirection.RIGHT]: "rotate(180)",
};

/**
 * Arrow pictogram by Daniel Bruce (www.entypo.com)
 * License: https://creativecommons.org/licenses/by-sa/4.0/.
 */
export default function Arrow(props: ArrowProps) {
    const { direction, disabled, onClick } = props;

    const buttonClasses = classNames(styles.button, {
        [styles.disabled]: disabled,
    });

    return (
        <button className={buttonClasses} disabled={disabled} onClick={onClick} type="button">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 1000"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform={DIRECTION_TO_TRANSFORM_MAP[direction]}>
                    <path d="M400 270c0 0 0 460 0 460c0 0 -400 -230 -400 -230c0 0 400 -230 400 -230" />
                </g>
            </svg>
        </button>
    );
}

Arrow.defaultProps = {
    disabled: false,
    onClick: () => {
        /* noop*/
    },
};
