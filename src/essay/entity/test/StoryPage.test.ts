import { expect } from "chai";

import Essay from "../Essay";
import StoryPage from "../StoryPage";

import essayConfig from "./essay";
import mediaConfig from "./media";

describe("StoryPage", () => {
    const mockEssay = new Essay([essayConfig], mediaConfig);

    describe("contentHash", () => {
        it("returns equal hashes for pages with equal content", () => {
            const [page1, page2] = mockEssay.pages;
            expect(page1.contentHash).to.equal(page2.contentHash);
        });

        it("returns unequal hashes for pages with unequal content", () => {
            const [page1, _, page3] = mockEssay.pages;
            expect(page1.contentHash).to.not.equal(page3.contentHash);
        });
    });
});
