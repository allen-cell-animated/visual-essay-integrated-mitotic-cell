import { debounce } from "lodash";

type OnInteractionCallback = (deltaY: number) => void;

export enum Direction {
    UP = "up",
    DOWN = "down",
}

/**
 * An InteractionController coordinates handling user interaction with an event target. When it receives a user
 * interaction, it will call the callback configured for that event target. See `listenForInteractions` for user events
 * handled by this class.
 *
 * Usage:
 * ```
 * const controller = new InteractionController();
 * controller.listenForInteractions(el, (deltaY) => console.log(deltaY));
 * ```
 */
export default class InteractionController {
    public static getDirection(deltaY: number): Direction {
        return deltaY > 0 ? Direction.DOWN : Direction.UP;
    }

    private _ticking: boolean = false;
    private _targetToCallbackMap = new Map();

    constructor(debounceTime: number = 250) {
        this.onInteraction = debounce(this.onInteraction.bind(this), debounceTime, {
            leading: true,
            trailing: false,
        });
    }

    public listenForInteractions(target: EventTarget, onInteractionCb: OnInteractionCallback) {
        this._targetToCallbackMap.set(target, onInteractionCb);

        // TODO touch events
        target.addEventListener("wheel", this.onInteraction, { passive: true });
    }

    /**
     * Primary event listener. Delegates handling to an `onInteractionCb` configured for the element
     * that received the event.
     *
     * NEVER call event.preventDefault(). This listener is configured as `passive` to instruct browser to offload to
     * compositing thread.
     */
    private onInteraction(event: Event) {
        // prevent doing anything while something else is completing
        if (this._ticking) {
            return;
        }

        this._ticking = true;

        // callback in an animation frame to attempt to prevent jank
        const callback = this._targetToCallbackMap.get(event.target);
        window.requestAnimationFrame(() => {
            callback((event as WheelEvent).deltaY);
            this._ticking = false;
        });
    }
}
