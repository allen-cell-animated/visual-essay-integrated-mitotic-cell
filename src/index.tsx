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

// kick it off
setVideoHeight();
window.addEventListener("resize", setVideoHeight);
render();
