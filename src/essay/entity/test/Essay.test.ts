import { expect } from "chai";
import { flatten } from "lodash";

import { PageType } from "../BasePage";
import Essay from "../Essay";
import StoryPage from "../StoryPage";

import essayConfig from "./essay";
import mediaConfig from "./media";
import InteractivePage from "../InteractivePage";

describe("Essay", () => {
    describe("binPagesBy", () => {
        const mockEssay = new Essay([essayConfig], mediaConfig);

        it("bins pages by some getter", () => {
            const binnedByLayout = Essay.binPagesBy<StoryPage>(
                mockEssay.pages,
                "layout",
                PageType.STORY
            );

            expect(binnedByLayout).to.have.length(4);

            // for each bin, expect each page within the bin to have the same value for layout
            binnedByLayout.forEach((bin: StoryPage[]) => {
                const expectedLayout = bin[0].layout;
                bin.forEach((page) => {
                    expect(page.layout).to.equal(expectedLayout);
                });
            });
        });

        // potentially overkill given typings, but nice to have for refactoring
        it("only includes pages of the specified type", () => {
            const binned = Essay.binPagesBy<StoryPage>(
                mockEssay.pages,
                "media.mediaId",
                PageType.STORY
            );

            const flattened = flatten<StoryPage>(binned);
            flattened.forEach((page: StoryPage) => {
                expect(page.type).to.equal(PageType.STORY);
            });
        });

        it("bins pages in order", () => {
            const binned = Essay.binPagesBy<StoryPage>(mockEssay.pages, "layout", PageType.STORY);

            binned.forEach((bin: StoryPage[]) => {
                bin.forEach((page, index) => {
                    if (index !== 0) {
                        expect(page.sortOrder).to.greaterThan(bin[index - 1].sortOrder);
                    }
                });
            });
        });

        it("works with a callback as a property getter", () => {
            const binnedByStringGetter = Essay.binPagesBy<StoryPage>(
                mockEssay.pages,
                "layout",
                PageType.STORY
            );
            const binnedByCallback = Essay.binPagesBy<StoryPage>(
                mockEssay.pages,
                (page) => page.layout,
                PageType.STORY
            );

            expect(binnedByCallback).to.deep.equal(binnedByStringGetter);
        });

        it("seeds the first bin with a value from a page of the proper type", () => {
            const binned = Essay.binPagesBy<InteractivePage>(
                mockEssay.pages,
                "layout", // all pages have this
                PageType.INTERACTIVE
            );

            expect(binned).to.have.length(1);
            expect(binned[0][0].componentId).to.equal("Splash");
        });
    });
});
