import { expect } from "chai";

import { getStagesArray, getChannelSettings } from "../selectors";
import { MITOTIC_STAGES, RAW, VOLUME_ENABLED, CHANNEL_INFO } from "../constants";

describe("Cell Viewer selectors", () => {
    describe("getStagesArray", () => {
        it("creates an array where the currently selected array is in the middle", () => {
            MITOTIC_STAGES.forEach((stage, index) => {
                const currentStage = index;
                const stagesArray = getStagesArray(currentStage);
                const middle = Math.floor(MITOTIC_STAGES.length / 2);
                expect(stagesArray).to.be.an("Array");
                expect(stagesArray[middle]).to.equal(MITOTIC_STAGES[currentStage]);
            });
        });
        it("returns original array of stage is out of range", () => {
            const currentStage = 20;
            const stagesArray = getStagesArray(currentStage);
            expect(stagesArray).to.deep.equal(MITOTIC_STAGES);
        });
    });
    describe("getChannelSettings", () => {
        it("creates an array of channel settings based on user selections in App state", () => {
            const rawOrSeg = RAW;
            let selectedChannels = ["DNA"];
            const channelSettings = getChannelSettings(rawOrSeg, selectedChannels);

            const filtered = CHANNEL_INFO.filter((channel) => channel.type !== rawOrSeg);
            const enabled = channelSettings.filter((setting) => setting[VOLUME_ENABLED]);

            expect(enabled.length).to.equal(selectedChannels.length);
            expect(channelSettings.length).to.equal(filtered.length);
        });
    });
});
