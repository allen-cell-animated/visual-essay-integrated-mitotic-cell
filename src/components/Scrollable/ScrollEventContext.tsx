import * as React from "react";

import ScrollItem from "./ScrollItem";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stub = (item: ScrollItem) => {};

/**
 * These default functions will only ever be applied if ScrollEventContext consumers are rendered without a ScrollEventContext provider in the render tree (e.g., in testing).
 * The actual implementations can be found in ScrollEventProvider.
 */
const ScrollEventContext = React.createContext({
    subscribeToScrollEvent: stub,
    unsubscribeToScrollEvent: stub,
});

export default ScrollEventContext;
