import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";
import "normalize.css";
import { debounce } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import { APP_ID } from "./constants";
import essay from "./essay";
import InteractionController, { Direction } from "./InteractionController";

const appRoot = document.getElementById(APP_ID);

if (!appRoot) {
    throw new Error(
        `The DOM is missing the element expected to contain the application: #${APP_ID}`
    );
}

const render = () => {
    ReactDOM.render(<App essay={essay} />, appRoot);
};

// when the active page changes, call render
essay.subscribe(render);

const controller = new InteractionController();
controller.addListener((direction: Direction) => {
    if (direction === Direction.DOWN) {
        essay.advance();
    } else {
        essay.reverse();
    }
});

/**
 * Sets:
 *  --viewport-height: pin to window.innerHeight, which takes the browser's interface (e.g., address bar) into account.
 *  --video-height: make certain video size always matches 16:9 aspect ratio
 *  --video-width: make certain video size always matches 16:9 aspect ratio
 */
const setCSSCustomProperties = () => {
    const intendedAspectRatio = 16 / 9;
    const windowInnerHeight = window.innerHeight;
    const windowInnerWidth = window.innerWidth;

    const actualAspectRatio = windowInnerWidth / windowInnerHeight;
    window.document.documentElement.style.setProperty(
        "--viewport-height",
        `${windowInnerHeight}px`
    );

    if (actualAspectRatio > intendedAspectRatio) {
        const videoWidth = Math.min(intendedAspectRatio * windowInnerHeight, windowInnerWidth);
        window.document.documentElement.style.setProperty(
            "--video-height",
            `${windowInnerHeight}px`
        );
        window.document.documentElement.style.setProperty("--video-width", `${videoWidth}px`);
    } else {
        const videoHeight = Math.min((9 / 16) * windowInnerWidth, windowInnerHeight);
        window.document.documentElement.style.setProperty("--video-height", `${videoHeight}px`);
        window.document.documentElement.style.setProperty("--video-width", `${windowInnerWidth}px`);
    }
};

/**
 * On iOS in landscape mode, the address bar will sit on top of the app and never go away. This solution,
 * taken from https://davidwalsh.name/hide-address-bar, does not in fact accomplish what the article claims it
 * accomplishes (hiding the address bar itself), but it does functionally address our needs. It is extremely unclear why
 * this works, but it has the effect of pushing the (correctly sized) page below the address bar.
 *
 * Note that this fix only seems to work on orientation change, so if the app is loaded in landscape mode,
 * the user must flip to portrait and then back to landscape.
 */
const positionBelowiOSAddressBar = () => {
    if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
    }
};

/**
 * Composition of functions that should be run on resize/orientation change
 */
const onResize = () => {
    setCSSCustomProperties();
    positionBelowiOSAddressBar();
};

// kick it off
onResize();
window.addEventListener(
    "resize",
    debounce(onResize, 250, {
        leading: true,
        trailing: true,
    })
);

render();
