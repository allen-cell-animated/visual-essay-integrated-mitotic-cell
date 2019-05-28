import * as log from "loglevel";
import * as React from "react";

import tracking from "../../util/tracking";

const tracker = tracking.getTracker();

type ErrorBoundaryProps = React.PropsWithChildren<{}>;

/**
 * Simple wrapper component for logging and tracking errors that happen as part of a React Component tree's
 * lifecycle. Per the documentation (https://reactjs.org/docs/error-boundaries.html), this will not catch errors raised
 * by event handlers, async code, or errors thrown within this component.
 *
 * In a future iteration, it can be extended to render specific UI when an error has been caught.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        log.error(error.message, errorInfo.componentStack);
        tracker.trackException(error);
    }

    public render() {
        return this.props.children;
    }
}
