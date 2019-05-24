enum EventAction {
    EXCEPTION = "exception",
}

interface EventParameters {
    [index: string]: string | number | boolean;
}

type ga = (type: string, action: string, params: EventParameters) => void;

class Tracker {
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
