import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import VisibilityStatus from "../";
import { Position, Status } from "../VisibilityStateMachine";

describe("<VisibilityStatus />", () => {
    const spec = [
        // entering from below viewport
        {
            fromPosition: Position.BELOW_VIEWPORT,
            toPosition: Position.IN_VIEWPORT,
            fromStatus: Status.INITIAL,
            transitionalStatus: Status.ENTERING_UP,
            toStatus: Status.ENTERED,
        },

        // in view, then scroll back upward
        {
            fromPosition: Position.IN_VIEWPORT,
            toPosition: Position.BELOW_VIEWPORT,
            fromStatus: Status.ENTERED,
            transitionalStatus: Status.EXITING_DOWN,
            toStatus: Status.INITIAL,
        },

        // in view, then scroll further down
        {
            fromPosition: Position.IN_VIEWPORT,
            toPosition: Position.ABOVE_VIEWPORT,
            fromStatus: Status.ENTERED,
            transitionalStatus: Status.EXITING_UP,
            toStatus: Status.EXITED,
        },

        // above view, then scroll back upward
        {
            fromPosition: Position.ABOVE_VIEWPORT,
            toPosition: Position.IN_VIEWPORT,
            fromStatus: Status.EXITED,
            transitionalStatus: Status.ENTERING_DOWN,
            toStatus: Status.ENTERED,
        },
    ];

    spec.forEach((test) =>
        it(`transitions from ${test.fromStatus} to ${
            test.transitionalStatus
        } to ${test.toStatus}`, (done) => {
            const renderFunc = spy(() => <div />);

            const wrapper = mount(
                <VisibilityStatus
                    onTransitionEnd={() => {
                        expect(renderFunc.callCount).to.equal(4);

                        // mount
                        const firstRender = renderFunc.getCall(0);
                        expect(firstRender.args[0]).to.haveOwnProperty(
                            "status",
                            test.fromStatus
                        );

                        // updated props, componentDidUpdate has not yet run
                        const secondRender = renderFunc.getCall(1);
                        expect(secondRender.args[0]).to.haveOwnProperty(
                            "status",
                            test.fromStatus
                        );

                        // transitional state
                        const thirdRender = renderFunc.getCall(2);
                        expect(thirdRender.args[0]).to.haveOwnProperty(
                            "status",
                            test.transitionalStatus
                        );

                        // final state
                        const fourthRender = renderFunc.getCall(3);
                        expect(fourthRender.args[0]).to.haveOwnProperty(
                            "status",
                            test.toStatus
                        );

                        done();
                    }}
                    render={renderFunc}
                    position={test.fromPosition}
                />
            );

            wrapper.setProps({ position: test.toPosition });
        })
    );

    it("doesn't trigger a transition if position hasn't changed", () => {
        const renderFunc = spy(() => <div />);

        const wrapper = mount(
            <VisibilityStatus
                render={renderFunc}
                position={Position.BELOW_VIEWPORT}
            />
        );

        wrapper.setProps({ position: Position.BELOW_VIEWPORT });

        // NOTE: `onTransitionEnd` is not called in this situation because no transition was triggered, so assertions
        // can be made directly after setting props.

        expect(renderFunc.callCount).to.equal(2);

        // mount
        const firstRender = renderFunc.getCall(0);
        expect(firstRender.args[0]).to.haveOwnProperty(
            "status",
            Status.INITIAL
        );

        // render called, but status should not have changed
        const secondRender = renderFunc.getCall(1);
        expect(secondRender.args[0]).to.haveOwnProperty(
            "status",
            Status.INITIAL
        );
    });

    it("throws an error if trying to make an invalid state transition", () => {
        const wrapper = mount(
            <VisibilityStatus
                render={() => <div />}
                position={Position.BELOW_VIEWPORT}
            />
        );

        expect(() =>
            wrapper.setProps({ position: Position.ABOVE_VIEWPORT })
        ).to.throw();
    });

    describe("getPositionRelativeTo", () => {
        it(`returns ${
            Position.BELOW_VIEWPORT
        } if target is after current`, () => {
            expect(VisibilityStatus.getPositionRelativeTo(3, 2)).to.equal(
                Position.BELOW_VIEWPORT
            );
        });

        it(`returns ${
            Position.ABOVE_VIEWPORT
        } if target is before current`, () => {
            expect(VisibilityStatus.getPositionRelativeTo(0, 2)).to.equal(
                Position.ABOVE_VIEWPORT
            );
        });

        it(`returns ${Position.IN_VIEWPORT} if target is current`, () => {
            expect(VisibilityStatus.getPositionRelativeTo(3, 3)).to.equal(
                Position.IN_VIEWPORT
            );
        });
    });
});
