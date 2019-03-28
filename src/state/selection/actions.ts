import {
    CHANGE_MITOTIC_STAGE,
    CHANGE_RAW_SEG,
    DESELECT_FILE,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    ChangeMitoticStageAction,
    ChangeRawSegAction,
    DeselectFileAction,
    SelectFileAction,
    SelectMetadataAction,
} from "./types";

export function selectFile(fileId: string | string[]): SelectFileAction {
    return {
        payload: fileId,
        type: SELECT_FILE,
    };
}

export function deselectFile(fileId: string | string[]): DeselectFileAction {
    return {
        payload: fileId,
        type: DESELECT_FILE,
    };
}

export function selectMetadata(
    key: string,
    payload: string | number
): SelectMetadataAction {
    return {
        key,
        payload,
        type: SELECT_METADATA,
    };
}

export function changeMitoticStage(stage: number): ChangeMitoticStageAction {
    return {
        payload: stage,
        type: CHANGE_MITOTIC_STAGE,
    };
}

export function switchRawSeg(selection: string): ChangeRawSegAction {
    return {
        payload: selection,
        type: CHANGE_RAW_SEG,
    };
}
