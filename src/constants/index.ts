import { includes, values, isEqual, filter, find, map } from "lodash";

export const APP_ID = "imsc-visual-essay";
export const API_VERSION = "v1";
export const BASE_API_URL = `/imsc-visual-essay/api/${API_VERSION}`;

export const MITOTIC_ACTIVITY_NO_CHANGE = "mitoticNoChange";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE = "mitoticReCompartmentalize";
export const MITOTIC_ACTIVITY_REDISTRIBUTE = "mitoticRedistribute";


export const MITOTIC_ACTIVITY_NO_CHANGE_SEG = "mitoticNoChange_seg";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_SEG = "mitoticReCompartmentalize_seg";
export const MITOTIC_ACTIVITY_REDISTRIBUTE_SEG = "mitoticRedistribute_seg";
export const MITOTIC_ACTIVITY_NO_CHANGE_RAW = "mitoticNoChange_raw";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_RAW = "mitoticReCompartmentalize_raw";
export const MITOTIC_ACTIVITY_REDISTRIBUTE_RAW = "mitoticRedistribute_raw";

export const MITOTIC_ACTIVITY_KEYS = [
    MITOTIC_ACTIVITY_NO_CHANGE_RAW,
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_RAW,
    MITOTIC_ACTIVITY_REDISTRIBUTE_RAW,
    MITOTIC_ACTIVITY_NO_CHANGE_SEG,
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_SEG,
    MITOTIC_ACTIVITY_REDISTRIBUTE_SEG,
];

export const MITOTIC_STAGES = ["MO", "M1-M2", "M3", "M4-M5", "M6-M7"];

export const MITOTIC_GROUP_INIT_ACC = {

export enum PROTEIN_NAME_MAP {
    "MEMB" = 1,
    "DNA",
    "ACTB",
    "ACTN1",
    "CENT2",
    "CTNNB1",
    "DSP",
    "FBL",
    "GJA1",
    "LAMP1",
    "LMNB1",
    "MYH10",
    "NPM1",
    "SEC61B",
    "ST6GAL1",
    "TJP1",
    "TOMM20",
    "TUBA1B",
}

export const PROTEIN_COLORS: { [index: number]: string } = {
    [PROTEIN_NAME_MAP.ACTB]: "#d89076",
    [PROTEIN_NAME_MAP.ACTN1]: "#da9b2c",
    [PROTEIN_NAME_MAP.CENT2]: "#e76e68",
    [PROTEIN_NAME_MAP.CTNNB1]: "#cb99c8",
    [PROTEIN_NAME_MAP.DSP]: "#eb57a1",
    [PROTEIN_NAME_MAP.FBL]: "#3191ed",
    [PROTEIN_NAME_MAP.GJA1]: "#c18ddc",
    [PROTEIN_NAME_MAP.LAMP1]: "#a1c293",
    [PROTEIN_NAME_MAP.LMNB1]: "#3dbde5",
    [PROTEIN_NAME_MAP.MYH10]: "#eb6641",
    [PROTEIN_NAME_MAP.SEC61B]: "#3ee8e7",
    [PROTEIN_NAME_MAP.ST6GAL1]: "#4cd58b",
    [PROTEIN_NAME_MAP.TJP1]: "#db81c4",
    [PROTEIN_NAME_MAP.TOMM20]: "#f23b65",
    [PROTEIN_NAME_MAP.TUBA1B]: "#d09c49",
    [PROTEIN_NAME_MAP.DNA]: "#58a3bc",
    [PROTEIN_NAME_MAP.MEMB]: "#bfa0d0",
};

export const STRUCTURE_NAMES: { [index: number]: string } = {
    [PROTEIN_NAME_MAP.ACTB]: "Actin filaments",
    [PROTEIN_NAME_MAP.ACTN1]: "Actin bundles",
    [PROTEIN_NAME_MAP.CENT2]: "Centrosome",
    [PROTEIN_NAME_MAP.CTNNB1]: "Adherens junctions",
    [PROTEIN_NAME_MAP.DSP]: "Desmosomes",
    [PROTEIN_NAME_MAP.FBL]: "Nucleolus (DF)",
    [PROTEIN_NAME_MAP.GJA1]: "Gap junction",
    [PROTEIN_NAME_MAP.LAMP1]: "Lysosome",
    [PROTEIN_NAME_MAP.LMNB1]: "Nuclear envelope",
    [PROTEIN_NAME_MAP.MYH10]: "Actomyosin bundles",
    [PROTEIN_NAME_MAP.SEC61B]: "ER",
    [PROTEIN_NAME_MAP.ST6GAL1]: "Golgi",
    [PROTEIN_NAME_MAP.TJP1]: "Tight junctions",
    [PROTEIN_NAME_MAP.TOMM20]: "Mitochondria",
    [PROTEIN_NAME_MAP.TUBA1B]: "Microtubules",
    [PROTEIN_NAME_MAP.DNA]: "DNA",
    [PROTEIN_NAME_MAP.MEMB]: "Membrane",
};
export const PROTEIN_NAMES = filter(values(PROTEIN_NAME_MAP), (ele: number) => {
    return isNaN(ele);
});

export const CHANNELS = [
    "MEMB",
    "DNA",
    "ACTB_raw",
    "ACTB_seg",
    "ACTN1_raw",
    "ACTN1_seg",
    "CENT2_raw",
    "CENT2_seg",
    "CTNNB1_raw",
    "CTNNB1_seg",
    "DSP_raw",
    "DSP_seg",
    "FBL_raw",
    "FBL_seg",
    "GJA1_raw",
    "GJA1_seg",
    "LAMP1_raw",
    "LAMP1_seg",
    "LMNB1_raw",
    "LMNB1_seg",
    "MYH10_raw",
    "MYH10_seg",
    "NPM1_raw",
    "NPM1_seg",
    "SEC61B_raw",
    "SEC61B_seg",
    "ST6GAL1_raw",
    "ST6GAL1_seg",
    "TJP1_raw",
    "TJP1_seg",
    "TOMM20_raw",
    "TOMM20_seg",
    "TUBA1B_raw",
    "TUBA1B_seg",
];

export const CHANNEL_INFO = map(CHANNELS, (channelName, index) => {
    const getType = (name: string): string => {
        if (includes(name, "_raw")) {
            return RAW;
        }
        if (includes(name, "_seg")) {
            return SEG;
        }
        return "obs";
    };
    return {
        type: getType(channelName),
        proteinName: channelName.split("_")[0],
        index,
    };
});

export const MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP = {
    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE]: ["FBL", "LMNB1", "SEC61B", "ST6GAL1"],

    [MITOTIC_ACTIVITY_NO_CHANGE]: ["ACTB", "ACTN1", "MYH10", "CTNNB1", "DSP", "GJA1", "TJP1"],
    [MITOTIC_ACTIVITY_REDISTRIBUTE]: [
        "ST6GAL1",
        "CENT2",
        "LAMP1",
        "TOMM20",
        "TUBA1B",
        "ACTB",
        "ACTN1",
        "MYH10",
    ],
};
