import { expect } from "chai";
import { flatten } from "lodash";
import { spy } from "sinon";

import { Page, PageType } from "../BasePage";
import Essay from "../Essay";
import StoryPage from "../StoryPage";

import essayConfig from "./essay";
import mediaConfig from "./media";
import InteractivePage from "../InteractivePage";
import { ResolvedVideoReference } from "../../config";

describe("Essay", () => {
    let mockEssay: Essay;

    beforeEach(() => {
        mockEssay = new Essay([essayConfig], mediaConfig);
    });

    describe("binPagesBy", () => {
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

        it("includes pages of any type if not given type limiter", () => {
            const binned = Essay.binPagesBy(mockEssay.pages, "layout");

            const flattened = flatten(binned);
            const setOfTypes = new Set();
            flattened.forEach((page: Page) => {
                setOfTypes.add(page.type);
            });

            expect(setOfTypes.has(PageType.STORY)).to.equal(true);
            expect(setOfTypes.has(PageType.INTERACTIVE)).to.equal(true);
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

    describe("reverse", () => {
        it("makes the previous sibling of the current page active", () => {
            // set the second page to be active
            mockEssay.jumpTo(mockEssay.pages[1]);

            expect(mockEssay.activePage).to.equal(mockEssay.pages[1]);

            // reverse
            mockEssay.reverse();

            expect(mockEssay.activePage).to.equal(mockEssay.pages[0]);
        });

        it("jumps over any pages that have media configured with 'advanceOnExit'", () => {
            // modify the second page to have its media "advanceOnExit" (a.k.a., "autoscroll" when video is finished)
            (mockEssay.pages[1].media as ResolvedVideoReference).advanceOnExit = true;

            // set the third page to be active
            mockEssay.jumpTo(mockEssay.pages[2]);

            expect(mockEssay.activePage).to.equal(mockEssay.pages[2]);

            // reverse
            mockEssay.reverse();

            // expect the second page to be skipped
            expect(mockEssay.activePage).to.equal(mockEssay.pages[0]);
        });

        it("does nothing if already at the beginning", () => {
            expect(mockEssay.activePage).to.equal(mockEssay.pages[0]);

            // reverse
            mockEssay.reverse();

            expect(mockEssay.activePage).to.equal(mockEssay.pages[0]);
        });
    });

    describe("subscribing to active page change", () => {
        it("adds a callback that is called when the essay is advanced", () => {
            const subscriber = spy();
            expect(subscriber.called).to.equal(false);

            mockEssay.subscribe(subscriber);
            mockEssay.advance();

            expect(subscriber.calledOnce).to.equal(true);
        });

        it("adds a callback that is called when the essay is reversed", () => {
            const subscriber = spy();
            expect(subscriber.called).to.equal(false);

            // get to a place where we can meaningfully reverse
            mockEssay.jumpTo(mockEssay.pages[3]);

            mockEssay.subscribe(subscriber);
            mockEssay.reverse();

            expect(subscriber.calledOnce).to.equal(true);
        });

        it("adds a callback that is called when jumping to a page", () => {
            const subscriber = spy();
            expect(subscriber.called).to.equal(false);

            mockEssay.subscribe(subscriber);
            mockEssay.jumpTo(mockEssay.pages[3]);

            expect(subscriber.calledOnce).to.equal(true);
        });

        it("returns a callback that can be used to remove subscriber from list", () => {
            const subscriber = spy();
            expect(subscriber.called).to.equal(false);

            // set up subscription
            const unsubscribe = mockEssay.subscribe(subscriber);

            // immediately unsubscribe
            unsubscribe();

            // do something that would otherwise trigger subscribers being notified
            mockEssay.advance();

            expect(subscriber.called).to.equal(false);
        });
    });
});
