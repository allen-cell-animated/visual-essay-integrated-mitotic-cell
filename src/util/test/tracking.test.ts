import { expect } from "chai";
import * as sinon from "sinon";

import { Tracker } from "../tracking";

describe("Tracker", () => {
    describe("trackException", () => {
        it("calls Google Analytics when enabled", () => {
            const gaSpy = sinon.spy();
            const msg = "Something bad happened";
            const tracker = new Tracker(true, gaSpy);

            // before
            expect(gaSpy.called).to.equal(false);

            // call
            tracker.trackException(new Error(msg));

            // after
            expect(gaSpy.called).to.equal(true);
        });

        it("does not call Google Analytics when disabled", () => {
            const gaSpy = sinon.spy();
            const msg = "Something bad happened";
            const tracker = new Tracker(false, gaSpy);

            // before
            expect(gaSpy.called).to.equal(false);

            // call
            tracker.trackException(new Error(msg));

            // after
            expect(gaSpy.called).to.equal(false);
        });
    });
});
