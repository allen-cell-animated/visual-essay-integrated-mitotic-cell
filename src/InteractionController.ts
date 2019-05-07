import { debounce, find } from "lodash";

export enum Direction {
    UP = "up",
    DOWN = "down",
}

type OnInteractionCallback = (direction: Direction) => void;

/**
 * An InteractionController coordinates handling user interaction with the application. When it receives a user
 * interaction, it will call all listeners that have registered with the controller. See `bindEvents` for user events
 * handled by this class.
 *
 * Usage:
 * ```
 * const controller = new InteractionController();
 * controller.addListener((direction) => console.log(direction));
 * ```
 */
export default class InteractionController {
    private listeners: OnInteractionCallback[];
    private ticking: boolean = false;
    private touchIdentifier: number | null = 0;
    private touchStartY: number | null = 0;

    constructor(debounceTime: number = 250) {
        this.listeners = [];

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onInteraction = debounce(this.onInteraction.bind(this), debounceTime, {
            leading: true,
            trailing: false,
        });

        this.bindEvents();
    }

    public addListener(onInteractionCb: OnInteractionCallback) {
        this.listeners.push(onInteractionCb);
    }

    private bindEvents() {
        window.document.addEventListener("keyup", this.onKeyUp, { passive: true });
        window.document.addEventListener("touchstart", this.onTouchStart, { passive: true });
        window.document.addEventListener("touchmove", this.onTouchMove, { passive: false });
        window.document.addEventListener("touchend", this.onTouchEnd, { passive: true });
        window.document.addEventListener("wheel", this.onWheel, { passive: true });
    }

    /**
     * If an up or down arrow key, advance/reverse essay accordingly.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onKeyUp(event: Event) {
        const keyboardEvent = event as KeyboardEvent;

        let direction: Direction | undefined;
        switch (keyboardEvent.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                direction = Direction.DOWN;
                break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                direction = Direction.UP;
                break;
        }

        if (direction) {
            this.onInteraction(direction);
        }
    }

    /**
     * Keep initialize tracking variables for where on the page the touch started and which "touch" (e.g., which finger)
     * initiated the touchevent.
     *
     * Only initialize if at least two touchpoints (e.g., fingers) are on the screen.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onTouchStart(event: Event) {
        const touchEvent = event as TouchEvent;

        if (touchEvent.touches.length < 2) {
            return;
        }

        const [firstPointOfContact] = touchEvent.touches;
        this.touchStartY = firstPointOfContact.pageY;
        this.touchIdentifier = firstPointOfContact.identifier;
    }

    private onTouchMove(event: Event) {
        event.preventDefault();
    }

    /**
     * Find which touchpoint (e.g., finger) initiated the touch, figure out which direction to move in, and
     * call this.onInteraction.
     *
     * Reset tracking variables for touchStartY and touchIdentifier.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onTouchEnd(event: Event) {
        const touchEvent = event as TouchEvent;

        const trackedTouch = find(
            touchEvent.changedTouches,
            (touch) => touch.identifier === this.touchIdentifier
        );

        if (!trackedTouch || this.touchStartY === null) {
            return;
        }

        const deltaY = trackedTouch.pageY - this.touchStartY;
        const direction = deltaY > 0 ? Direction.UP : Direction.DOWN;

        this.touchStartY = null;
        this.touchIdentifier = null;
        this.onInteraction(direction);
    }

    /**
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onWheel(event: Event) {
        const direction = (event as WheelEvent).deltaY > 0 ? Direction.DOWN : Direction.UP;
        this.onInteraction(direction);
    }

    /**
     * Primary event handler. Delegates handling to an `onInteractionCb` configured for the element
     * that received the event.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onInteraction(direction: Direction) {
        // prevent doing anything while something else is completing
        if (this.ticking) {
            return;
        }

        this.ticking = true;

        this.listeners.forEach((cb) => cb(direction));

        this.ticking = false;
    }
}
