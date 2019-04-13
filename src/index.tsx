import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";

import * as React from "react";
import { render } from "react-dom";

import { APP_ID } from "./constants";
import App from "./App";

render(<App />, document.getElementById(APP_ID));
