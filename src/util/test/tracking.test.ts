import { expect } from "chai";

import { Tracker } from "../tracking";

describe("Tracker", () => {
    describe("trackException", () => {
        it("calls Google Analytics when enabled", () => {
            const mockDataLayer: any[] = [];
            const msg = "Something bad happened";
            const tracker = new Tracker(true, mockDataLayer);

            // before
            expect(mockDataLayer.length).to.equal(0);

            // call
            tracker.trackException(new Error(msg));

            // after
            expect(mockDataLayer.length).to.equal(1);
            expect(mockDataLayer[0]).to.deep.equal({
                event: "exception",
                description: msg,
                fatal: false,
            });
        });

        it("does not call Google Analytics when disabled", () => {
            const mockDataLayer: any[] = [];
            const msg = "Something bad happened";
            const tracker = new Tracker(false, mockDataLayer);

            // before
            expect(mockDataLayer.length).to.equal(0);

            // call
            tracker.trackException(new Error(msg));

            // after
            expect(mockDataLayer.length).to.equal(0);
        });
    });
});
