enum EventAction {
    EXCEPTION = "exception",
}

interface EventParameters {
    [index: string]: string | number | boolean;
}

type ga = (type: string, action: string, params: EventParameters) => void;

// Per Google Analytics documentation, gtag is setup in the head of the document in index.template.html.
// This accomplishes telling TypeScript about it.
declare global {
    interface Window {
        gtag: ga;
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
    private static ENABLED: boolean = process.env.NODE_ENV === "production";
    private readonly googleAnalytics: ga;

    constructor(googleAnalytics: ga) {
        this.googleAnalytics = googleAnalytics;
    }

    public trackException(err: Error, fatal: boolean = false) {
        this.sendEvent(EventAction.EXCEPTION, {
            description: err.message,
            fatal,
        });
    }

    private sendEvent(action: EventAction, parameters: EventParameters) {
        if (Tracker.ENABLED) {
            this.googleAnalytics("event", action, parameters);
        }
    }
}

const rootTracker = new Tracker(window.gtag);

export default {
    getTracker() {
        return rootTracker;
    },
};
