import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import { APP_ID } from "./constants";
import essay from "./essay";
import { Page } from "./essay/entity/BasePage";
import InteractionController from "./InteractionController";

const appRoot = document.getElementById(APP_ID);

if (!appRoot) {
    throw new Error(
        `The DOM is missing the element expected to contain the application: #${APP_ID}`
    );
}

/**
 * Make certain video height (which most layout is calculated relative to) always
 * ensures a 16:9 aspect ratio
 */
const setVideoHeight = () => {
    const { height, width } = appRoot.getBoundingClientRect();

    const intendedAspectRatio = 16 / 9;
    const actualAspectRatio = width / height;

    if (actualAspectRatio > intendedAspectRatio) {
        const videoWidth = intendedAspectRatio * height;
        window.document.documentElement.style.setProperty("--video-height", `${height}px`);
        window.document.documentElement.style.setProperty("--video-width", `${videoWidth}px`);
    } else {
        // fallback to default; configured directly in index.html style declaration
        window.document.documentElement.style.removeProperty("--video-height");
        window.document.documentElement.style.removeProperty("--video-width");
    }
};

const render = () => {
    function onNavigation(page: Page) {
        essay.jumpTo(page);
        render();
    }

    ReactDOM.render(
        <App
            activePage={essay.activePage}
            onNavigation={onNavigation}
            pagesBinnedByInteractive={essay.pagesBinnedByInteractive()}
            pagesBinnedByLayout={essay.pagesBinnedByLayout()}
            pagesBinnedByMedia={essay.pagesBinnedByMedia()}
            sections={essay.sections}
        />,
        appRoot
    );
};

const controller = new InteractionController();
controller.listenForInteractions(appRoot, (deltaY: number) => {
    if (deltaY > 0) {
        // moving down
        essay.advance();
    } else {
        // moving up
        essay.goBack();
    }

    render();
});

// kick it off
setVideoHeight();
window.addEventListener("resize", setVideoHeight);
render();
