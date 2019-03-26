/**
 * GM 3/25/19
 * Similar to the ScrollItem component tests, the decision was made to write these mocks in JavaScript out of
 * pragmatism--the effort to provide proper typings for these "least effort" mocks is not worth the time.
 */

/**
 * Least effort mock of IntersectionObserverEntry
 * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
 */
export class IntersectionObserverEntry {
    constructor(element) {
        this.element = element;

        this.isIntersecting = false;
        this.rootBounds = {
            top: 0,
        };
    }
}

/**
 * Least effort mock of IntersectionObserver
 * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 */
export class IntersectionObserver {
    constructor(onIntersection, options) {
        this.onIntersection = onIntersection;
        this.options = options;

        this.entries = [];
    }

    observe(element) {
        this.entries = [
            ...this.entries,
            new IntersectionObserverEntry(element),
        ];
    }

    unobserve(element) {
        this.entries = this.entries.filter(
            (entry) => entry.element !== element
        );
    }

    /**
     * This is not part of the actual IntersectionObserver interface; it is a testing construct specific to this mock.
     */
    triggerIntersection(isIntersecting = true) {
        this.onIntersection(
            this.entries.map((entry) => {
                entry.isIntersecting = isIntersecting;
                return entry;
            })
        );
    }
}
