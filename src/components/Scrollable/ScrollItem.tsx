import * as classNames from "classnames";
import { clamp } from "lodash";
import * as React from "react";

import ScrollEventContext from "./ScrollEventContext";

const styles = require("./style.css");

export enum ScrollDirection {
    "UP" = "up",
    "DOWN" = "down",
    "NONE" = "none", // e.g., the page is not being scrolled
}

/**
 * Interface of object passed to `onEnter`, `onUpdate`, and `onExit` props.
 */
export interface ProgressInfo {
    entry: IntersectionObserverEntry;

    direction: ScrollDirection;

    // The change in window.scrollY since last progress event
    dy: number;

    // A number between 0.0 and 1.0 corresponding to how much of the item has been scrolled through.
    // Defined as how much this item has crossed above the top of the intersection root.
    progress: number;
}

interface ScrollItemProps {
    className?: string;
    debug?: boolean;
    height: number | string;

    // Accept IntersectionObserver class through props for easy testing.
    IntersectionObserver?: typeof IntersectionObserver;

    // If not provided, will default to `null`. A `null` intersectionObserverRoot will make the intersection observer
    // watch for intersections with the root element (i.e., document's viewport).
    intersectionObserverRoot?: HTMLElement | null;
    onEnter?: (progress: ProgressInfo) => void;
    onExit?: (progress: ProgressInfo) => void;
    onUpdate?: (progress: ProgressInfo) => void;
    rootMarginTop?: string;
    rootMarginBottom?: string;
}

/**
 * A ScrollItem is our primary primitive to work with in this scrolly telly framework. It will render its children into
 * a container of height `props.height` and provides hooks for knowing when that container:
 *
 *  1) enters the view (`onEnter`),
 *  2) updates its progress as the user scrolls the container up and down while it's in view (`onUpdate`), and
 *  3) exits the view (`onExit`)
 *
 *  Each of these hooks are called with an object of the interface `ProgressInfo`.
 *
 *  A `ScrollItem` must be a descendant (at any depth) of a `ScrollEventProvider`. If it is not rendered within a
 *  `ScrollEventProvider` tree, its `onUpdate` (if provided) will never be called.
 *
 *  Example usage:
     export default class Thing extends React.Component<{}, { inView: boolean }> {
        constructor(props: {}) {
            super(props);

            this.state = {
                inView: false,
            };

            this.onEnter = this.onEnter.bind(this);
            this.onExit = this.onExit.bind(this);
            this.onUpdate = this.onUpdate.bind(this);
        }

        public onEnter(progress: ProgressInfo) {
            console.log(progress);
            this.setState({
                inView: true,
            });
        }

        public onExit(progress: ProgressInfo) {
            console.log(progress);
            this.setState({
                inView: false,
            });
        }

        public onUpdate(progress: ProgressInfo) {
            console.log(progress);
        }

        public render(): JSX.Element {
            const { inView } = this.state;

            const classes = classNames(styles.box, {
                [styles.transparent]: !inView,
            });

            return (
                <ScrollItem
                    height="100vh"
                    onEnter={this.onEnter}
                    onExit={this.onExit}
                    onUpdate={this.onUpdate}
                >
                    <div className={classes} />
                </ScrollItem>
            );
        }
    }
 *
 */
export default class ScrollItem extends React.Component<ScrollItemProps, {}> {
    static contextType = ScrollEventContext;

    static defaultProps = {
        className: "",
        debug: false,
        intersectionObserverRoot: null,
        onEnter: () => {},
        onExit: () => {},
        onUpdate: () => {},
        rootMarginTop: "-50%",
        rootMarginBottom: "-50%",
    };

    public context!: React.ContextType<typeof ScrollEventContext>;
    public entered: boolean = false;
    public exited: boolean = false;
    public updating: boolean = false;

    private item: React.RefObject<HTMLElement>;
    private observer: IntersectionObserver;
    private entry!: IntersectionObserverEntry;

    private scrollY: number = 0.0;

    public constructor(props: ScrollItemProps) {
        super(props);

        this.item = React.createRef<HTMLElement>();

        this.onIntersection = this.onIntersection.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.progress = this.progress.bind(this);

        const IO = props.IntersectionObserver || IntersectionObserver;

        this.observer = new IO(this.onIntersection, {
            root: props.intersectionObserverRoot,
            rootMargin: `${props.rootMarginTop} 0px ${
                props.rootMarginBottom
            } 0px`,
        });
    }

    /**
     * On mount, register this component to be updated when it is scrolled within view (provided by
     * `ScrollEventProvider`), and setup its IntersectionObserver to observe this component's container.
     */
    public componentDidMount() {
        this.context.subscribeToScrollEvent(this);

        if (this.item.current && this.observer) {
            this.observer.observe(this.item.current);
        }
    }

    /**
     * Before unmounting, unregister from scroll event updates provided by `ScrollEventProvider`, and clean up its
     * IntersectionObserver registration.
     */
    public componentWillUnmount() {
        this.context.unsubscribeToScrollEvent(this);

        if (this.item.current && this.observer) {
            this.observer.unobserve(this.item.current);
        }
    }

    /**
     * This is called by ScrollEventProvider if and only if this ScrollItem is in view and not currently updating.
     *
     * SIDE EFFECT: Sets this.scrollY
     */
    public onScroll() {
        const { onUpdate, debug } = this.props;

        if (debug) {
            console.log("Scrolling");
        }

        if (onUpdate) {
            this.updating = true;
            const prevScrollY = this.scrollY;
            this.scrollY = window.scrollY;

            // Attempt to prevent some jank by doing any real work in the onUpdate callback in an animation frame.
            window.requestAnimationFrame(() => {
                onUpdate(this.progress(prevScrollY));
                this.updating = false;
            });
        }
    }

    public render(): JSX.Element {
        const { className, debug, height } = this.props;
        // A nested div here is the only way that any of the children can be sticky without providing their own heights.
        // Hopefully there is a more correct way to do this.
        return (
            <section
                className={classNames(
                    { [styles.scrollItemDebug]: debug },
                    className
                )}
                ref={this.item}
            >
                <div style={{ height: height }}>{this.props.children}</div>
            </section>
        );
    }

    private progress(prevScrollY = this.scrollY): ProgressInfo {
        // Progress is defined as how much of this item has crossed above the top of the intersection root.
        let progress = 0;

        if (this.item.current && this.entry) {
            // How far top of root intersection rectangle is from top of viewport; if root is the document's viewport and rootMargin is not applied, top should be 0.
            const rootTop = this.entry.rootBounds.top;

            // Top is how far from the viewport. Will be negative if above the viewport (e.g., scrolling out of view).
            const { height, top } = this.item.current.getBoundingClientRect();

            // If top of element has not yet moved above top of root intersection rectangle, interpret as no progress.
            if (top < rootTop) {
                // How far above the top of the item is from the top of the root
                const topDistance = rootTop - top;
                progress = clamp(topDistance / height, 0, 1); // make sure we stay within [0, 1], inclusive
            }
        }

        return {
            entry: this.entry,
            direction: this.direction(prevScrollY),
            dy: this.scrollY - prevScrollY,
            progress,
        };
    }

    private direction(prevScrollY = this.scrollY): ScrollDirection {
        const dy = window.scrollY - prevScrollY;

        if (dy === 0) {
            return ScrollDirection.NONE;
        }

        if (dy > 0) {
            return ScrollDirection.DOWN;
        }

        return ScrollDirection.UP;
    }

    /**
     * SIDE EFFECT: Sets this.scrollY
     */
    private onEnter() {
        if (this.props.debug) {
            console.log("onEnter");
        }

        this.scrollY = window.scrollY;

        const { onEnter } = this.props;
        if (onEnter) {
            onEnter(this.progress());
        }
    }

    /**
     * SIDE EFFECT: Sets this.scrollY
     */
    private onExit() {
        const { debug, onExit } = this.props;

        if (debug) {
            console.log("onExit");
        }

        const prevScrollY = this.scrollY;
        this.scrollY = window.scrollY;

        if (onExit) {
            onExit(this.progress(prevScrollY));
        }
    }

    /**
     * Called every time the intersection status of the ScrollItem changes. If the element is entirely in view but is so tall that scrolling up
     * or down does not change its intersection ratio, this will not fire.
     */
    private onIntersection(entries: IntersectionObserverEntry[]) {
        if (this.props.debug) {
            console.log("Intersection change");
        }

        const [entry] = entries;
        this.entry = entry;

        // ENTERING
        if (entry.isIntersecting && !this.entered) {
            this.entered = true;
            this.exited = false;
            this.onEnter();
            return;
        }

        // EXITING
        if (!entry.isIntersecting && this.entered && !this.exited) {
            this.entered = false;
            this.exited = true;
            this.onExit();
        }
    }
}
