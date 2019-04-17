import * as React from "react";

import VisibilityStateMachine, { Position, Status } from "./VisibilityStateMachine";

interface RenderProps {
    status: Status;
}

interface VisibilityStatusProps {
    onTransitionEnd: () => void;
    position: Position;
    render: (props: RenderProps) => JSX.Element;

    // time in milliseconds between moving from a transitional visibility state (e.g., "entering-up") to a final state
    // (e.g., "entered")
    timeout: number;
}

interface VisibilityStatusState {
    status: Status;
}

/**
 * VisibilityStatus is responsible for tracking visibility state for its children, which it takes as render props.
 *
 * It is essentially a re-implementation of `reactjs/react-transition-group`'s `Transition` component
 * (https://github.com/reactjs/react-transition-group/blob/master/src/Transition.js), with the added feature of
 * tracking transitions between THREE primary states (INITIAL, ENTERED, EXITED), instead of two (ENTERED, EXITED).
 * If `reactjs/react-transition-group` ever supports three states (or an arbitrary number of states), this component
 * can be safely swapped out. As of 4/16/2019, there appears to be no active work or issue tracking towards that
 * feature.
 */
export default class VisibilityStatus extends React.Component<
    VisibilityStatusProps,
    VisibilityStatusState
> {
    public static defaultProps = {
        onTransitionEnd: () => {}, // noop
        timeout: 250,
    };

    /**
     * Position of element relative to element currently in viewport. Example computation:
     * Given list of elements with indices: [0, 1, 2, 3, 4]
     * Let `indexOfInViewportElement` = 2
     * Let `indexOfElementForWhichWeAreDeterminingPosition` = 4
     * position = indexOfInViewportElement - indexOfElementForWhichWeAreDeterminingPosition
     *
     * Here,position will be:
     *  1. negative, in the case that indexOfInViewportElement is less than indexOfElementForWhichWeAreDeterminingPosition,
     *  in which case indexOfElementForWhichWeAreDeterminingPosition is expected to have not yet entered the viewport
     *  (and so be positioned below it)
     *
     *  2. 0, in the case that indexOfInViewportElement and indexOfElementForWhichWeAreDeterminingPosition are equal
     *  in which case indexOfElementForWhichWeAreDeterminingPosition is expected to have entered the viewport
     *
     *  3. positive, in the case that indexOfInViewportElement is greater than indexOfElementForWhichWeAreDeterminingPosition
     *  in which case indexOfElementForWhichWeAreDeterminingPosition is expected to have exited the viewport (and so be
     *  positioned above it)
     *
     *  Props to Basu for figuring out it's this simple.
     */
    public static getPositionRelativeTo(targetIndex: number, relativeToIndex: number): Position {
        const difference = relativeToIndex - targetIndex;
        if (difference < 0) {
            return Position.BELOW_VIEWPORT;
        } else if (difference > 0) {
            return Position.ABOVE_VIEWPORT;
        } else {
            return Position.IN_VIEWPORT;
        }
    }

    public state: VisibilityStatusState;

    public constructor(props: VisibilityStatusProps) {
        super(props);

        this.transitionTo = this.transitionTo.bind(this);

        const [initialStatus] = VisibilityStateMachine.from(props.position).to(props.position);

        this.state = {
            status: initialStatus,
        };
    }

    public componentDidUpdate(prevProps: Readonly<VisibilityStatusProps>): void {
        const { status } = this.state;
        const { onTransitionEnd, position, timeout } = this.props;
        const { position: prevPosition } = prevProps;

        // nothing to do, early return
        if (position === prevPosition) {
            return;
        }

        const [targetStatus, transitionalStatus] = VisibilityStateMachine.from(prevPosition).to(
            position
        );

        if (status !== targetStatus && status !== transitionalStatus) {
            // set status to transitional state, then after some timeout, set status to end state
            this.transitionTo(transitionalStatus, () => {
                setTimeout(() => this.transitionTo(targetStatus, onTransitionEnd), timeout);
            });
        }
    }

    public render(): JSX.Element {
        return this.props.render({ status: this.state.status });
    }

    private transitionTo(state: Status, callback: () => void): void {
        this.setState(
            {
                status: state,
            },
            callback
        );
    }
}
