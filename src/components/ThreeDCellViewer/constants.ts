import { includes, map } from "lodash";
import { GENE_ID_MAP } from "../../constants/cell-viewer-apps";

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
    [GENE_ID_MAP.ACTB]: "#d89076",
    [GENE_ID_MAP.ACTN1]: "#da9b2c",
    [GENE_ID_MAP.CENT2]: "#e76e68",
    [GENE_ID_MAP.CTNNB1]: "#cb99c8",
    [GENE_ID_MAP.DSP]: "#eb57a1",
    [GENE_ID_MAP.FBL]: "#3191ed",
    [GENE_ID_MAP.GJA1]: "#c18ddc",
    [GENE_ID_MAP.LAMP1]: "#a1c293",
    [GENE_ID_MAP.LMNB1]: "#3dbde5",
    [GENE_ID_MAP.MYH10]: "#eb6641",
    [GENE_ID_MAP.SEC61B]: "#3ee8e7",
    [GENE_ID_MAP.ST6GAL1]: "#4cd58b",
    [GENE_ID_MAP.TJP1]: "#db81c4",
    [GENE_ID_MAP.TOMM20]: "#f23b65",
    [GENE_ID_MAP.TUBA1B]: "#d09c49",
    [GENE_ID_MAP.DNA]: "#58a3bc",
};

export const STRUCTURE_NAMES: { [index: number]: string } = {
    [GENE_ID_MAP.ACTB]: "Actin filaments",
    [GENE_ID_MAP.ACTN1]: "Actin bundles",
    [GENE_ID_MAP.CENT2]: "Centrosome",
    [GENE_ID_MAP.CTNNB1]: "Adherens junctions",
    [GENE_ID_MAP.DSP]: "Desmosomes",
    [GENE_ID_MAP.FBL]: "Nucleolus (DF)",
    [GENE_ID_MAP.GJA1]: "Gap junction",
    [GENE_ID_MAP.LAMP1]: "Lysosome",
    [GENE_ID_MAP.LMNB1]: "Nuclear envelope",
    [GENE_ID_MAP.MYH10]: "Actomyosin bundles",
    [GENE_ID_MAP.SEC61B]: "ER",
    [GENE_ID_MAP.ST6GAL1]: "Golgi",
    [GENE_ID_MAP.TJP1]: "Tight junctions",
    [GENE_ID_MAP.TOMM20]: "Mitochondria",
    [GENE_ID_MAP.TUBA1B]: "Microtubules",
    [GENE_ID_MAP.DNA]: "DNA",
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
