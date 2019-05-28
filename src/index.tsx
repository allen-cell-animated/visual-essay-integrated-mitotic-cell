import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";
import "normalize.css";
import { debounce, last } from "lodash";
import * as log from "loglevel";
import * as React from "react";
import * as ReactDOM from "react-dom";
import URLSearchParams from "@ungap/url-search-params";

import App from "./App";
import { APP_ID } from "./constants";
import essay from "./essay";
import InteractionController, { Direction } from "./InteractionController";

if (process.env.NODE_ENV === "production") {
    // turn off all logging in production
    log.setLevel(log.levels.SILENT);
}

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

// on load, grab page (id) off URLSearchParams
const params = new URLSearchParams(window.location.search);
const page = essay.findPageById(params.get("page"));
if (page) {
    essay.jumpTo(page);
}

// as active page is updated, keep URLSearchParams in sync
essay.subscribe(() => {
    const activePageId = last(essay.activePage.id.split(":"));
    if (activePageId) {
        params.set("page", activePageId);
        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
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

    // always set --viewport-height to keep pinned to window.innerHeight
    // see https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ for why using 100vh is not a feasible
    // cross-platform solution.
    window.document.documentElement.style.setProperty(
        "--viewport-height",
        `${windowInnerHeight}px`
    );

    const actualAspectRatio = windowInnerWidth / windowInnerHeight;
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
