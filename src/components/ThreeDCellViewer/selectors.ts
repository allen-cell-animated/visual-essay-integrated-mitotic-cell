import { includes, reduce } from "lodash";
import {
    CHANNEL_INFO,
    VOLUME_ENABLED,
    ISO_SURFACE_ENABLED,
    RAW,
    SEG,
    PROTEIN_COLORS,
    STRUCTURE_NAMES,
    FILE_NAME_PREFIX,
} from "./constants";

import { ChannelSettings } from "./CellViewer/types";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { hexToRgb } from "../../util";
import { MITOTIC_STAGES, GENE_ID_MAP } from "../../constants/cell-viewer-apps";

export const getCurrentMitoticStageLabel = (stageIndex: number): string => {
    return MITOTIC_STAGES[stageIndex];
};

export const getCurrentCellId = (stageIndex: number): string => {
    return `${FILE_NAME_PREFIX}_${MITOTIC_STAGES[stageIndex]}`;
};

export const getPreviousCellId = (stageIndex: number): string => {
    const prevNumb = stageIndex - 1 >= 0 ? stageIndex - 1 : MITOTIC_STAGES.length - 1;
    return `${FILE_NAME_PREFIX}_${MITOTIC_STAGES[prevNumb]}`;
};

export const getNextCellId = (stageIndex: number): string => {
    const nextNumb = stageIndex + 1 <= MITOTIC_STAGES.length - 1 ? stageIndex + 1 : 0;
    return `${FILE_NAME_PREFIX}_${MITOTIC_STAGES[nextNumb]}`;
};

/*
 * Creates an array of mitotic stages were the currently selected stage is in the center of the array.
 */
export const getStagesArray = (stageIndex: number): string[] => {
    const newArray = [...MITOTIC_STAGES];
    const middle = Math.floor(MITOTIC_STAGES.length / 2);
    const selectedStage = MITOTIC_STAGES[stageIndex];
    if (!selectedStage) {
        return newArray;
    }
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

export const getHexColorForChannel = (proteinName: string): string => {
    // typescript needed this.
    const nameCheck = proteinName as keyof typeof GENE_ID_MAP;
    return PROTEIN_COLORS[GENE_ID_MAP[nameCheck]];
};

export const getStructureName = (proteinName: string): string => {
    // typescript needed this.
    const nameCheck = proteinName as keyof typeof GENE_ID_MAP;
    return STRUCTURE_NAMES[GENE_ID_MAP[nameCheck]];
};

export const getRgbColorForChannel = (proteinName: string): number[] => {
    const hex = getHexColorForChannel(proteinName);
    return hexToRgb(hex);
};

/*
    Creates an array of channels settings based on the user selections 
*/
export const getChannelSettings = (
    rawOrSeg: string,
    selectedChannels: CheckboxValueType[]
): ChannelSettings[] => {
    const init: ChannelSettings[] = [];
    const filter = rawOrSeg === RAW ? SEG : RAW;
    return reduce(
        CHANNEL_INFO,
        (acc, cur) => {
            if (cur.type !== filter) {
                acc.push({
                    name: cur.proteinName,
                    index: cur.index,
                    [VOLUME_ENABLED]: includes(selectedChannels, cur.proteinName),
                    [ISO_SURFACE_ENABLED]: false,
                    opacity: 1.0,
                    color: getRgbColorForChannel(cur.proteinName) || [226, 205, 179], // guard for unexpectedly longer channel list
                    dataReady: false,
                });
            }
            return acc;
        },
        init
    );
};
