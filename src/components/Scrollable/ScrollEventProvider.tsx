import * as React from "react";

import ScrollItem from "./ScrollItem";
import ScrollEventContext from "./ScrollEventContext";

/**
 * This component provides ScrollEventContext to its subtree. Ideally, this only needs to be rendered once, at the root
 * of the render tree. Any component that renders a ScrollItem, at any depth, will automatically be a consumer of
 * ScrollEventContext.
 *
 * The primary behavior introduced here is to call the `onScroll` method of individual `ScrollItem` components if and
 * only if those items are
 *   1) currently in view (`ScrollItem::entered`), and
 *   2) not currently flushing an update (`ScrollItem::updating`)
 */
export default class ScrollEventProvider extends React.Component<{}, {}> {
    private contextValue: React.ContextType<typeof ScrollEventContext>;
    private scrollItems: ScrollItem[] = [];

    constructor(props: {}) {
        super(props);

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.contextValue = {
            subscribeToScrollEvent: this.subscribe,
            unsubscribeToScrollEvent: this.unsubscribe,
        };
    }

    componentDidMount() {
        // This should be passive to allow advanced browsers to offload handling to the compositing thread. As such,
        // `preventDefault` should NEVER be called in this callback.
        window.addEventListener("scroll", this.onScroll, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    render(): JSX.Element {
        return (
            <ScrollEventContext.Provider value={this.contextValue}>
                {this.props.children}
            </ScrollEventContext.Provider>
        );
    }

    private subscribe(scrollItem: ScrollItem): void {
        this.scrollItems = [...this.scrollItems, scrollItem];
    }

    private unsubscribe(scrollItem: ScrollItem): void {
        this.scrollItems = this.scrollItems.filter(
            (item) => item !== scrollItem
        );
    }

    /**
     * As noted in `componentDidMount`, `preventDefault` should NEVER be called in this method as it is configured as a
     * passive event.
     */
    private onScroll(): void {
        this.scrollItems.forEach((item) => {
            if (item.entered && !item.updating) {
                item.onScroll();
            }
        });
    }
}
