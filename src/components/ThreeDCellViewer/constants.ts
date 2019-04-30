import { includes, values, filter, map } from "lodash";

// Channel setting keys
export const ISO_SURFACE_ENABLED = "isoSurfaceEnabled";
export const VOLUME_ENABLED = "volumeEnabled";
export const FILE_NAME_PREFIX = "COMP_crop";
export const RAW = "raw";
export const SEG = "seg";

export const MITOTIC_ACTIVITY_NO_CHANGE = "mitoticNoChange";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE = "mitoticReCompartmentalize";
export const MITOTIC_ACTIVITY_REDISTRIBUTE = "mitoticRedistribute";

export const MITOTIC_ACTIVITY_KEYS = [
    MITOTIC_ACTIVITY_NO_CHANGE,
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE,
    MITOTIC_ACTIVITY_REDISTRIBUTE,
];

export enum MITOTIC_STAGES_NAMES {
    "Interphase" = "Interphase",
    "M1-M2" = "Prophase",
    "M3" = "Prometaphase",
    "M4-M5" = "Metaphase",
    "M6-M7" = "Anaphase",
}

export const MITOTIC_STAGES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];

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
    "ACTB_36972_raw",
    "ACTN1_92320_raw",
    "CENT2_68018_raw",
    "CTNNB1_112818_raw",
    "DSP_26096_raw",
    "FBL_56186_raw",
    "GJA1_84867_raw",
    "LAMP1_8761_raw",
    "LMNB1_78027_raw",
    "MYH10_47479_raw",
    "SEC61B_34690_raw",
    "ST6GAL1_40381_raw",
    "TJP1_52374_raw",
    "TOMM20_16877_raw",
    "TUBA1B_71126_raw",
    "ACTB_36972_seg",
    "ACTN1_92320_seg",
    "CENT2_68018_seg",
    "CTNNB1_112818_seg",
    "DSP_26096_seg",
    "FBL_56186_seg",
    "GJA1_84867_seg",
    "LAMP1_8761_seg",
    "LMNB1_78027_seg",
    "MYH10_47479_seg",
    "SEC61B_34690_seg",
    "ST6GAL1_40381_seg",
    "TJP1_52374_seg",
    "TOMM20_16877_seg",
    "TUBA1B_71126_seg",
];

export const CHANNEL_INFO = map(CHANNELS, (channelName: string, index) => {
    const getType = (name: string): string => {
        if (includes(name, RAW)) {
            return RAW;
        }
        if (includes(name, SEG)) {
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

export const MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP: { [index: string]: string[] } = {
    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE]: ["FBL", "LMNB1", "SEC61B", "ST6GAL1"],
    [MITOTIC_ACTIVITY_NO_CHANGE]: ["MYH10", "TJP1"],
    [MITOTIC_ACTIVITY_REDISTRIBUTE]: ["TOMM20", "TUBA1B"],
};
