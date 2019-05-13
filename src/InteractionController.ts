import { debounce, every, inRange, union } from "lodash";

import { Coordinate, Vector } from "./util";

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
    // If a user swipe is less than 30px in length, it was probably a click. This is a made-up, tunable value.
    private static MINIMUM_SWIPE_DISTANCE = 30;

    // If the direction (in degrees) of a swipe is less than 20, it was probably horizontal. This is a made-up, tunable value.
    private static MAXIMUM_HORIZONTAL_SWIPE_ANGLE = 20;

    private listeners: OnInteractionCallback[];
    private ticking: boolean = false;
    private touchIdentifierToCoordinateMap = new Map<number, Coordinate>();

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
     * Keep track of where on the page the touch(es) started.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onTouchStart(event: Event) {
        const touchEvent = event as TouchEvent;

        Array.from(touchEvent.touches).forEach((touch) => {
            this.touchIdentifierToCoordinateMap.set(
                touch.identifier,
                new Coordinate(touch.pageX, touch.pageY)
            );
        });
    }

    private onTouchMove(event: Event) {
        event.preventDefault();
    }

    /**
     * Determine if touches count as a downward or upward swipe.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onTouchEnd(event: Event) {
        const touchEvent = event as TouchEvent;

        // TouchEvent.changedTouches === touch points that have been removed that triggered this call
        // TouchEvent.touches === remaining touch points as of this call
        const touches = union(touchEvent.changedTouches, touchEvent.touches);

        // Reduce available touch points as of this call to touch vectors
        const vectors = touches.reduce(
            (accum, touch) => {
                const start = this.touchIdentifierToCoordinateMap.get(touch.identifier);

                if (start) {
                    const end = new Coordinate(touch.pageX, touch.pageY);
                    const vector = new Vector(start, end);
                    accum.push(vector);
                }

                return accum;
            },
            [] as Vector[]
        );

        this.touchIdentifierToCoordinateMap.clear();

        if (!vectors.length) {
            return;
        }

        // Heuristic: if the average vector length is shorter than MINIMUM_SWIPE_DISTANCE, it was probably a click, not
        // a swipe
        const sumOfLengths = vectors.reduce((sum, vector) => {
            sum += vector.magnitude;
            return sum;
        }, 0);
        const averageLength = sumOfLengths / vectors.length;
        if (averageLength < InteractionController.MINIMUM_SWIPE_DISTANCE) {
            return;
        }

        const firstTouch = vectors[0];

        // If every touch vector is not pointing in a ~similar~ direction, not a swipe.
        // Similar vector direction is defined here as same sign (all negative, all positive, etc).
        if (!every(vectors, (vector) => vector.direction / firstTouch.direction > 0)) {
            return;
        }

        // Disable horizontal swiping.
        // Heuristic: if swipe was less than about 20deg, it was a horizontal swipe
        const swipeRight = inRange(
            Math.abs(firstTouch.direction),
            0,
            InteractionController.MAXIMUM_HORIZONTAL_SWIPE_ANGLE
        );
        const swipeLeft = inRange(
            Math.abs(firstTouch.direction),
            180,
            180 - InteractionController.MAXIMUM_HORIZONTAL_SWIPE_ANGLE
        );
        if (swipeRight || swipeLeft) {
            return;
        }

        const direction = firstTouch.direction > 0 ? Direction.UP : Direction.DOWN;
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
