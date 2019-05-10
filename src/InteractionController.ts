import { debounce, every, inRange, union } from "lodash";

export enum Direction {
    UP = "up",
    DOWN = "down",
}

type OnInteractionCallback = (direction: Direction) => void;

class Coordinate {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public subtract(vector: Coordinate): Coordinate {
        return new Coordinate(this.x - vector.x, this.y - vector.y);
    }
}

class Vector {
    private readonly _start: Coordinate;
    private readonly _end: Coordinate;

    constructor(start: Coordinate, end: Coordinate) {
        this._start = start;
        this._end = end;
    }

    public get start() {
        return this._start;
    }

    public get end() {
        return this._end;
    }

    /**
     * Direction of the vector; inverse tangent of (y2 - y1) / (x2 - x1).
     */
    public get direction(): number {
        const vector = this.end.subtract(this.start);
        return Math.atan2(vector.y, vector.x);
    }

    /**
     * Length of the vector; euclidean distance.
     */
    public get magnitude(): number {
        const vector = this.end.subtract(this.start);
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    }

    public toString(): string {
        return `<Vector
            direction: ${this.direction}
            magnitude: ${this.magnitude}
        >`;
    }
}

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

        // changedTouches = touch points that have been removed that triggered this call
        // touches = remaining touch points as of this call
        const touches = union(touchEvent.changedTouches, touchEvent.touches);
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

        // if the average vector length is short that about 50, it was probably a click, not a swipe
        const sumOfLengths = vectors.reduce((sum, vector) => {
            sum += vector.magnitude;
            return sum;
        }, 0);
        const averageLength = sumOfLengths / vectors.length;
        if (averageLength < 50) {
            return;
        }

        const firstTouch = vectors[0];

        // if every touch vector is not pointing in a ~similar~ direction, not a swipe
        // similar vector direction is defined here same sign (all negative, all positive, etc)
        if (!every(vectors, (vector) => vector.direction / firstTouch.direction > 0)) {
            return;
        }

        // disable horizontal swiping
        // heuristic: if swipe was less than about 20degrees, it was a horizontal swipe
        const directionInDegrees = Math.abs(firstTouch.direction * (180 / Math.PI));
        if (inRange(directionInDegrees, -20, 20) || inRange(directionInDegrees, 160, 200)) {
            // probably horizontal
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
