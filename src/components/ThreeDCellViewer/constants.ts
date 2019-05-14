import { includes, map } from "lodash";
import { GENE_IDS } from "../../constants/cell-viewer-apps";

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

export const PROTEIN_COLORS: { [index: number]: string } = {
    [GENE_IDS.ACTB]: "#d89076",
    [GENE_IDS.ACTN1]: "#da9b2c",
    [GENE_IDS.CENT2]: "#e76e68",
    [GENE_IDS.CTNNB1]: "#cb99c8",
    [GENE_IDS.DSP]: "#eb57a1",
    [GENE_IDS.FBL]: "#3191ed",
    [GENE_IDS.GJA1]: "#c18ddc",
    [GENE_IDS.LAMP1]: "#a1c293",
    [GENE_IDS.LMNB1]: "#3dbde5",
    [GENE_IDS.MYH10]: "#eb6641",
    [GENE_IDS.SEC61B]: "#3ee8e7",
    [GENE_IDS.ST6GAL1]: "#4cd58b",
    [GENE_IDS.TJP1]: "#db81c4",
    [GENE_IDS.TOMM20]: "#f23b65",
    [GENE_IDS.TUBA1B]: "#d09c49",
    [GENE_IDS.DNA]: "#58a3bc",
};

export const CHANNELS = [
    "DNA_raw",
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
    "DNA_seg",
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

export const IMAGE_DENSITY_RAW = 0.06;
export const IMAGE_DENSITY_SEG = 0.4;
export const IMAGE_DENSITY_PT_RAW = 0.7;
export const IMAGE_DENSITY_PT_SEG = 3.0;

export const IMAGE_BRIGHTNESS = 0.8;

export const LUT_MIN_PCT = 0.96;
export const LUT_MAX_PCT = 0.983;
