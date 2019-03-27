import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { ScrollEventProvider } from "./components/Scrollable";
import { APP_ID } from "./constants";
import Essay from "./containers/Essay";
import Progress from "./containers/Progress";
import { createReduxStore } from "./state";

const styles = require("./style.css");

render(
    <section className={styles.main}>
        <Provider store={createReduxStore()}>
            <ScrollEventProvider>
                <Progress />
                <Essay />
            </ScrollEventProvider>
        </Provider>
    </section>,
    document.getElementById(APP_ID)
);
