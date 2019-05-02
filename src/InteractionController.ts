import { debounce } from "lodash";

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
    private touchStartY: number = 0;

    constructor(debounceTime: number = 250) {
        this.listeners = [];

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
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
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("touchstart", this.onTouchStart);
        window.addEventListener("touchend", this.onTouchEnd);
        window.addEventListener("wheel", this.onWheel, { passive: true });
    }

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

    private onTouchStart(event: Event) {
        event.preventDefault();

        const touchEvent = event as TouchEvent;
        const [firstPointOfContact] = touchEvent.touches;
        this.touchStartY = firstPointOfContact.pageY;
    }

    private onTouchEnd(event: Event) {
        event.preventDefault();

        const touchEvent = event as TouchEvent;
        const [firstPointOfContact] = touchEvent.touches;
        const deltaY = firstPointOfContact.pageY - this.touchStartY;
        const direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
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
