import { makeConstant } from "../util";

export const DESELECT_FILE = makeConstant("selection", "deselect-file");
export const SELECT_FILE = makeConstant("selection", "select-file");
export const SELECT_METADATA = makeConstant("selection", "select_metadata");
export const CHANGE_MITOTIC_STAGE = makeConstant(
    "selection",
    "change-mitotic-stage"
);

export const CHANGE_RAW_SEG = makeConstant("selection", "change-raw-seg");
