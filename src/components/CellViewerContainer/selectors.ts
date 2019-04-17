import { includes, isEqual, filter, find, map, reduce } from "lodash";
import {
    MITOTIC_STAGES,
    CHANNEL_INFO,
    VOLUME_ENABLED,
    ISO_SURFACE_ENABLED,
} from "../../constants/index";
import { ChannelSettings } from "../../components/CellViewer/types";
export const getCurrentMitoticStageLabel = (stageIndex: number): string => {
    return MITOTIC_STAGES[stageIndex];
};

export const getCurrentCellId = (stageIndex: number): string => {
    return `COMP_${MITOTIC_STAGES[stageIndex]}`;
};

export const getPreviousCellId = (stageIndex: number): string => {
    const prevNumb = stageIndex - 1 >= 0 ? stageIndex - 1 : MITOTIC_STAGES.length - 1;
    return `COMP_${MITOTIC_STAGES[prevNumb]}`;
};

export const getNextCellId = (stageIndex: number): string => {
    const nextNumb = stageIndex + 1 <= MITOTIC_STAGES.length - 1 ? stageIndex + 1 : 0;
    return `COMP_${MITOTIC_STAGES[nextNumb]}`;
};

export const getStagesArray = (stageIndex: number): string[] => {
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
};

const init: ChannelSettings[] = [];

export const getChannelSettings = (rawOrSeg: string): ChannelSettings[] => {
    const filter = rawOrSeg === "raw" ? "seg" : "raw";
    return reduce(
        CHANNEL_INFO,
        (acc, cur) => {
            if (cur.type != filter) {
                acc.push({
                    name: cur.proteinName,
                    index: cur.index,
                    [VOLUME_ENABLED]: cur.type != filter,
                    [ISO_SURFACE_ENABLED]: false,
                    opacity: 1.0,
                    color: [226, 205, 179], // guard for unexpectedly longer channel list
                    dataReady: false,
                });
            }
            return acc;
        },
        init
    );
};
