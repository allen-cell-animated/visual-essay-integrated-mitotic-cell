import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import { APP_ID } from "./constants";
import essay from "./essay";
import InteractionController from "./InteractionController";

const appRoot = document.getElementById(APP_ID);

if (!appRoot) {
    throw new Error(
        `The DOM is missing the element expected to contain the application: #${APP_ID}`
    );
}

function render() {
    ReactDOM.render(
        <App
            activePage={essay.activePage}
            pagesBinnedByLayout={essay.pagesBinnedByLayout()}
            pagesBinnedByMedia={essay.pagesBinnedByMedia()}
            sections={essay.sections}
        />,
        appRoot
    );
}

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
render();
