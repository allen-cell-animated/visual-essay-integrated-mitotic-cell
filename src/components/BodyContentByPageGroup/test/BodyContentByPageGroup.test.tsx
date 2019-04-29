import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { PageType } from "../../../essay/entity/BasePage";
import Essay from "../../../essay/entity/Essay";
import StoryPage from "../../../essay/entity/StoryPage";

import BodyContentByPageGroup from "../";
const styles = require("../style.css");

// mocks
import essayConfig from "./essay";
import mediaConfig from "./media";

describe("<BodyContentByPageGroup />", () => {
    const essay = new Essay(essayConfig, mediaConfig);
    const [bin] = Essay.binPagesBy<StoryPage>(essay.pages, "layout", PageType.STORY);

    describe("transitions", () => {
        const getTransitionClassForPageContent = (page: StoryPage) => {
            return page.body.transition || "";
        };

        it("adds the transition class specified by an item's next sibling on exit", () => {
            // the third page in the bin is active, so the first and second are exited
            const wrapper = mount(<BodyContentByPageGroup activePage={bin[2]} pageGroup={bin} />);

            const content = wrapper.find(`article.${styles.content}`);
            const firstPageTransition = getTransitionClassForPageContent(bin[0]);
            const secondPageTransition = getTransitionClassForPageContent(bin[1]);
            const thirdPageTransition = getTransitionClassForPageContent(bin[2]);

            // expect the first page to have the transition class specified by the second
            expect(content.at(0).hasClass(firstPageTransition)).to.equal(false);
            expect(content.at(0).hasClass(secondPageTransition)).to.equal(true);

            // expect the second page to have the transition class specified by the third
            expect(content.at(1).hasClass(secondPageTransition)).to.equal(false);
            expect(content.at(1).hasClass(thirdPageTransition)).to.equal(true);
        });

        it("adds the transition class specified by the item itself when entered", () => {
            const wrapper = mount(<BodyContentByPageGroup activePage={bin[0]} pageGroup={bin} />);

            const content = wrapper.find(`article.${styles.content}`);
            const firstPageTransition = getTransitionClassForPageContent(bin[0]);

            expect(content.at(0).hasClass(firstPageTransition)).to.equal(true);
        });

        it("adds the transition class specified by the item itself when initially positioned", () => {
            const wrapper = mount(<BodyContentByPageGroup activePage={bin[0]} pageGroup={bin} />);

            const content = wrapper.find(`article.${styles.content}`);
            const secondPageTransition = getTransitionClassForPageContent(bin[1]);

            expect(content.at(1).hasClass(secondPageTransition)).to.equal(true);
        });

        it("notifies an item when its next sibling is in view", () => {
            const wrapper = mount(<BodyContentByPageGroup activePage={bin[1]} pageGroup={bin} />);

            const content = wrapper.find(`article.${styles.content}`);
            expect(content.at(0).hasClass(styles.nextSiblingInView)).to.equal(true);
        });

        it("notifies an item when its previous sibling is in view", () => {
            const wrapper = mount(<BodyContentByPageGroup activePage={bin[1]} pageGroup={bin} />);

            const content = wrapper.find(`article.${styles.content}`);
            expect(content.at(2).hasClass(styles.prevSiblingInView)).to.equal(true);
        });
    });
});
