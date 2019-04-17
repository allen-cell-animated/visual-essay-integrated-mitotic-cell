export enum Status {
    EXITED = "exited", // primary
    ENTERING_DOWN = "entering_down", // transitional
    EXITING_UP = "exiting_up", // transitional
    ENTERED = "entered", // primary
    ENTERING_UP = "entering_up", // transitional
    EXITING_DOWN = "exiting_down", // transitional
    INITIAL = "initial", // primary
}

export enum Position {
    BELOW_VIEWPORT = -1,
    IN_VIEWPORT = 0,
    ABOVE_VIEWPORT = 1,
}

interface PositionTransition {
    [index: string]: ToPositionTransition;
}

interface ToPositionTransition {
    [index: string]: [Status, Status];
}

const transitions: PositionTransition = {
    [Position.ABOVE_VIEWPORT]: {
        [Position.ABOVE_VIEWPORT]: [Status.EXITED, Status.EXITED],
        [Position.IN_VIEWPORT]: [Status.ENTERED, Status.ENTERING_DOWN],
    },
    [Position.IN_VIEWPORT]: {
        [Position.ABOVE_VIEWPORT]: [Status.EXITED, Status.EXITING_UP],
        [Position.IN_VIEWPORT]: [Status.ENTERED, Status.ENTERED],
        [Position.BELOW_VIEWPORT]: [Status.INITIAL, Status.EXITING_DOWN],
    },
    [Position.BELOW_VIEWPORT]: {
        [Position.IN_VIEWPORT]: [Status.ENTERED, Status.ENTERING_UP],
        [Position.BELOW_VIEWPORT]: [Status.INITIAL, Status.INITIAL],
    },
};

/**
 * Wrapper on top of transitions mapping purely for aesthetics.
 *
 * Usage:
 * const [targetStatus, transitionalStatus] = VisibilityStateMachine.from(prevPosition).to(nextPosition);
 *
 */
export default {
    from: (fromPosition: Position) => ({
        to: (toPosition: Position) => {
            const validNextPositions = transitions[fromPosition];

            const statuses = validNextPositions[toPosition];

            if (!statuses) {
                throw new Error(
                    `Attempted invalid state transition. Cannot transition from ${fromPosition} to ${toPosition}`
                );
            }

            return statuses;
        },
    }),
};
