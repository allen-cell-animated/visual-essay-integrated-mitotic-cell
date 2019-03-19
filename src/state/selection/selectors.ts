import { State } from "../types";
import { createSelector } from "reselect";

import { MITOTIC_STAGES } from "../../constants";
// BASIC SELECTORS
export const getSelections = (state: State) => state.selection;
export const getSelectedFiles = (state: State) => state.selection.files;
export const getCurrentMitoticStage = (state: State) =>
    state.selection.currentMitoticStage;

export const getCurrentMitoticStageLabel = createSelector(
    [getCurrentMitoticStage],
    (stageIndex) => {
        console.log(MITOTIC_STAGES);
        return MITOTIC_STAGES[stageIndex];
    }
);

export const getCurrentCellId = createSelector(
    [getCurrentMitoticStage],
    (stageIndex) => {
        return `COMP_${MITOTIC_STAGES[stageIndex]}`;
    }
);

export const getPreviousCellId = createSelector(
    [getCurrentMitoticStage],
    (stageIndex) => {
        const prevNumb =
            stageIndex - 1 >= 0 ? stageIndex - 1 : MITOTIC_STAGES.length - 1;
        return `COMP_${MITOTIC_STAGES[prevNumb]}`;
    }
);

export const getNextCellId = createSelector(
    [getCurrentMitoticStage],
    (stageIndex) => {
        const nextNumb =
            stageIndex + 1 <= MITOTIC_STAGES.length - 1 ? stageIndex + 1 : 0;
        return `COMP_${MITOTIC_STAGES[nextNumb]}`;
    }
);

export const getStagesArray = createSelector(
    [getCurrentMitoticStage],
    (stageIndex): string[] => {
        const newArray = [...MITOTIC_STAGES];
        const middle = Math.floor(MITOTIC_STAGES.length / 2);
        const selectedStage = MITOTIC_STAGES[stageIndex];
        let currentPos = stageIndex;
        if (stageIndex > middle) {
            while (currentPos > middle) {
                const newEnd = newArray.shift();
                if (newEnd) {
                    newArray.push(newEnd);
                }
                currentPos = newArray.indexOf(selectedStage);
            }
        } else if (currentPos < middle) {
            while (currentPos < middle) {
                const newStart = newArray.pop();
                if (newStart) {
                    newArray.unshift(newStart);
                }

                currentPos = newArray.indexOf(selectedStage);
            }
        }
        return newArray;
    }
);
