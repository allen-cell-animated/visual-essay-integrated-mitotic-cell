import * as classNames from "classnames";
import * as React from "react";

const styles = require("./arrow.css");

export enum ArrowDirection {
    LEFT = "left",
    RIGHT = "right",
}

interface ArrowProps {
    className?: string;
    direction: ArrowDirection;
    disabled: boolean;
    onClick: () => void;
}

// dimensions at which SVG was designed; scale the graphic accordingly
const SVG_DESIGN_WIDTH = 400;
const SVG_DESIGN_HEIGHT = 1000;

const DIRECTION_TO_TRANSFORM_MAP = {
    [ArrowDirection.LEFT]: "rotate(0)", // no translation, raw SVG is already a left-pointing arrow
    [ArrowDirection.RIGHT]: `rotate(180, ${SVG_DESIGN_WIDTH / 2}, ${SVG_DESIGN_HEIGHT / 2})`, // rotate about the center of the viewbox
};

/**
 * Arrow pictogram by Daniel Bruce (www.entypo.com)
 * License: https://creativecommons.org/licenses/by-sa/4.0/.
 */
export default function Arrow(props: ArrowProps) {
    const { className, direction, disabled, onClick } = props;

    const buttonClasses = classNames(
        styles.button,
        {
            [styles.disabled]: disabled,
        },
        className
    );

    return (
        <button className={buttonClasses} disabled={disabled} onClick={onClick} type="button">
            <svg
                width="16px"
                height="19px"
                viewBox={`0 0 ${SVG_DESIGN_WIDTH} ${SVG_DESIGN_HEIGHT}`}
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
