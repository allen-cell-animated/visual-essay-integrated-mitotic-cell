import { castArray, without } from "lodash";
import { AnyAction } from "redux";

import { TypeToDescriptionMap } from "../types";
import { makeReducer } from "../util";

import {
    CHANGE_MITOTIC_STAGE,
    CHANGE_RAW_SEG,
    DESELECT_FILE,
    SELECT_FILE,
    SELECT_METADATA,
} from "./constants";
import {
    ChangeMitoticStageAction,
    ChangeRawSegSelection,
    DeselectFileAction,
    SelectFileAction,
    SelectionStateBranch,
    SelectMetadataAction,
} from "./types";

export const initialState = {
    files: [],
    currentMitoticStage: 1,
    rawOrSeg: "_raw",
};

const actionToConfigMap: TypeToDescriptionMap = {
    [DESELECT_FILE]: {
        accepts: (action: AnyAction): action is DeselectFileAction =>
            action.type === DESELECT_FILE,
        perform: (state: SelectionStateBranch, action: DeselectFileAction) => ({
            ...state,
            files: without(state.files, ...castArray(action.payload)),
        }),
    },
    [SELECT_FILE]: {
        accepts: (action: AnyAction): action is SelectFileAction =>
            action.type === SELECT_FILE,
        perform: (state: SelectionStateBranch, action: SelectFileAction) => ({
            ...state,
            files: [...state.files, ...castArray(action.payload)],
        }),
    },
    [SELECT_METADATA]: {
        accepts: (action: AnyAction): action is SelectMetadataAction =>
            action.type === SELECT_METADATA,
        perform: (
            state: SelectionStateBranch,
            action: SelectMetadataAction
        ) => ({
            ...state,
            [action.key]: action.payload,
        }),
    },
    [CHANGE_MITOTIC_STAGE]: {
        accepts: (action: AnyAction): action is ChangeMitoticStageAction =>
            action.type === CHANGE_MITOTIC_STAGE,
        perform: (
            state: SelectionStateBranch,
            action: ChangeMitoticStageAction
        ) => ({
            ...state,
            currentMitoticStage: action.payload,
        }),
    },
    [CHANGE_RAW_SEG]: {
        accepts: (action: AnyAction): action is ChangeRawSegSelection =>
            action.type === CHANGE_RAW_SEG,
        perform: (
            state: SelectionStateBranch,
            action: ChangeRawSegSelection
        ) => ({
            ...state,
            rawOrSeg: action.payload,
        }),
    },
};

export default makeReducer<SelectionStateBranch>(
    actionToConfigMap,
    initialState
);
