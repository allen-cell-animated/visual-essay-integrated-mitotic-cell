/**
 * GM 3/25/2019
 * N.b.: Tests are written in JavaScript as opposed to TypeScript because in order to test ScrollItem, it is necessary
 * to make use of its private properties and pass it props the compiler would recognize aren't quite right (e.g., spies
 * and mocks). This is done knowing it would, strictly speaking, be "better" to accomplish this in TypeScript, though
 * doing so would be prohibitively time consuming and ultra annoying.
 */

import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import ScrollItem, { ScrollDirection } from "../ScrollItem";
import { IntersectionObserver } from "./mocks";

describe("<ScrollItem />", () => {
    let prevGlobal;

    beforeEach(() => {
        prevGlobal = global;
        // window is provided by JSDOM, injected into the test runtime environment in the mocha configuration
        // requestAnimationFrame doesn't exist in JSDOM; setTimeout is good enough for our purposes here.
        global.requestAnimationFrame = window.requestAnimationFrame = setTimeout;
    });

    afterEach(() => {
        global = prevGlobal;
    });

    describe("onEnter", () => {
        it("calls onEnter with ScrollDirection.NONE, no dy, and no initial progress", () => {
            const onEnter = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onEnter={onEnter}
                />
            );

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            wrapper.instance().observer.triggerIntersection();

            expect(onEnter).to.have.property("callCount", 1);
            const call = onEnter.getCall(0);
            const [progress] = call.args;
            expect(progress).to.include({
                direction: ScrollDirection.NONE,
                dy: 0,
                progress: 0,
            });
        });

        it("calls onEnter with ScrollDirection.NONE, no dy, and initial progress", () => {
            const onEnter = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onEnter={onEnter}
                />
            );

            // HACK: stub getBoundingClientRect to pretend like the item has been scrolled above viewport
            const getBoundingClientRectStub = sinon.stub(
                wrapper.instance().item.current,
                "getBoundingClientRect"
            );
            getBoundingClientRectStub.returns({
                top: -100, // 20% of the height of the rectangle is above viewport
                height: 500,
            });

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            wrapper.instance().observer.triggerIntersection();

            expect(onEnter).to.have.property("callCount", 1);
            const call = onEnter.getCall(0);
            const [progress] = call.args;
            expect(progress).to.include({
                direction: ScrollDirection.NONE,
                dy: 0,
                progress: 0.2,
            });
        });
    });

    describe("onUpdate", () => {
        it("calls onUpdate with ScrollDirection.DOWN when scrolling down, and appropriate dy and progress", (done) => {
            const onUpdate = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onUpdate={onUpdate}
                />
            );

            const scrollItem = wrapper.instance();

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            // Trigger onEnter to initialize private scrollY state and entered state
            scrollItem.observer.triggerIntersection();

            // manually set window.scrollY to fake having scrolled a ways
            window.scrollY = 100;

            // HACK: stub getBoundingClientRect
            const getBoundingClientRectStub = sinon.stub(
                scrollItem.item.current,
                "getBoundingClientRect"
            );
            getBoundingClientRectStub.returns({
                top: -100, // 20% of the height of the rectangle is above viewport
                height: 500,
            });

            // fire a scroll (in the course of the program, actually called by a scroll event)
            scrollItem.onScroll();

            // need to run assertion in a setTimeout because `onScroll` runs calls `onUpdate` in an animation frame
            setTimeout(() => {
                expect(onUpdate).to.have.property("callCount", 1);
                const call = onUpdate.getCall(0);
                const [progress] = call.args;
                expect(progress).to.include({
                    direction: ScrollDirection.DOWN,
                    dy: 100,
                    progress: 0.2,
                });
                done();
            });
        });

        it("calls onUpdate with ScrollDirection.UP when scrolling up, and appropriate dy and progress", (done) => {
            const onUpdate = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onUpdate={onUpdate}
                />
            );

            const scrollItem = wrapper.instance();

            // initialize scrollY to be 100px down the document
            window.scrollY = 100;

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            // Trigger onEnter to initialize private scrollY state and entered state
            scrollItem.observer.triggerIntersection();

            // manually set window.scrollY to fake having scrolled up a ways
            window.scrollY = 50;

            // HACK: stub getBoundingClientRect
            const getBoundingClientRectStub = sinon.stub(
                scrollItem.item.current,
                "getBoundingClientRect"
            );
            getBoundingClientRectStub.returns({
                top: -50, // 10% of the element is above the viewport
                height: 500,
            });

            // fire a scroll (in the course of the program, actually called by a scroll event)
            scrollItem.onScroll();

            // need to run assertion in a setTimeout because `onScroll` runs calls `onUpdate` in an animation frame
            setTimeout(() => {
                expect(onUpdate).to.have.property("callCount", 1);
                const call = onUpdate.getCall(0);
                const [progress] = call.args;
                expect(progress).to.include({
                    direction: ScrollDirection.UP,
                    dy: -50,
                    progress: 0.1,
                });
                done();
            });
        });
    });

    describe("onExit", () => {
        it("calls onExit with 100% progress when exiting by scrolling down", () => {
            const onExit = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onExit={onExit}
                />
            );

            const scrollItem = wrapper.instance();

            // initialize scrollY
            window.scrollY = 400;

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            // Trigger onEnter to initialize private scrollY state and entered state
            scrollItem.observer.triggerIntersection();

            // HACK: stub getBoundingClientRect
            const getBoundingClientRectStub = sinon.stub(
                scrollItem.item.current,
                "getBoundingClientRect"
            );
            getBoundingClientRectStub.returns({
                top: -500, // 100% of the element is above the viewport
                height: 500,
            });

            // manually set window.scrollY to fake having scrolled down a ways
            window.scrollY = 500;

            // retrigger onIntersection
            scrollItem.observer.triggerIntersection(false);

            expect(onExit).to.have.property("callCount", 1);
            const call = onExit.getCall(0);
            const [progress] = call.args;
            expect(progress).to.include({
                direction: ScrollDirection.DOWN,
                dy: 100,
                progress: 1.0,
            });
        });

        it("calls onExit with 0% progress when exiting by scrolling up", () => {
            const onExit = sinon.spy();
            const wrapper = mount(
                <ScrollItem
                    height="500px"
                    IntersectionObserver={IntersectionObserver}
                    onExit={onExit}
                />
            );

            const scrollItem = wrapper.instance();

            // initialize scrollY
            window.scrollY = 200;

            // HACK: use a private field that we know to exist on ScrollItem to get a reference to the instantiated
            // IntersectionObserver
            // Trigger onEnter to initialize private scrollY state and entered state
            scrollItem.observer.triggerIntersection();

            // HACK: stub getBoundingClientRect
            const getBoundingClientRectStub = sinon.stub(
                scrollItem.item.current,
                "getBoundingClientRect"
            );
            getBoundingClientRectStub.returns({
                top: 5, // top of the element is below the top of the viewport
                height: 500,
            });

            // manually set window.scrollY to fake having scrolled up a ways
            window.scrollY = 0;

            // retrigger onIntersection
            scrollItem.observer.triggerIntersection(false);

            expect(onExit).to.have.property("callCount", 1);
            const call = onExit.getCall(0);
            const [progress] = call.args;
            expect(progress).to.include({
                direction: ScrollDirection.UP,
                dy: -200,
                progress: 0,
            });
        });
    });
});
