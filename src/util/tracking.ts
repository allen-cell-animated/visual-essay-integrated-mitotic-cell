enum EventAction {
    EXCEPTION = "exception",
}

interface GATag {
    [index: string]: string | number | boolean;
}

type dataLayer = GATag[];

// Per Google Analytics documentation, dataLayer is setup in the head of the document in index.template.html.
// This accomplishes telling TypeScript about it.
declare global {
    interface Window {
        dataLayer: dataLayer;
    }
}

/**
 * Tracking utility for sending events to Google Analytics in production builds.
 *
 * This class exported for testing only, and should be considered private to this module. In calling code, it is
 * preferred to get the rootTracker off of this module's default export, as it is already configured to send to Google
 * Analytics. E.g.:
 * ```
 *  import tracking from "path/to/tracking.ts"
 *
 *  const tracker = tracking.getTracker();
 *
 *  try {
 *      blowUp();
 *  } catch (e) {
 *      tracker.trackException(e);
 *  }
 * ```
 */
export class Tracker {
    private readonly enabled: boolean;
    private readonly googleAnalytics: dataLayer;

    constructor(enabled: boolean, googleAnalytics: dataLayer) {
        this.enabled = enabled;
        this.googleAnalytics = googleAnalytics;
    }

    public trackException(err: Error, fatal: boolean = false) {
        this.sendEvent(EventAction.EXCEPTION, {
            description: err.message,
            fatal,
        });
    }

    private sendEvent(action: EventAction, parameters: GATag) {
        if (this.enabled) {
            this.googleAnalytics.push({ event: action, ...parameters });
        }
    }
}

const rootTracker = new Tracker(process.env.NODE_ENV === "production", window.dataLayer);

export default {
    getTracker() {
        return rootTracker;
    },
};
