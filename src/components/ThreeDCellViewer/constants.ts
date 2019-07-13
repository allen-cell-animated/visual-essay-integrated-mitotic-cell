import { includes, map } from "lodash";
import { GENE_IDS } from "../../constants/cell-viewer-apps";

// Channel setting keys
export const ISO_SURFACE_ENABLED = "isoSurfaceEnabled";
export const VOLUME_ENABLED = "volumeEnabled";
export const FILE_NAME_PREFIX = "COMP_crop";
export const FILE_NAME_PREFIX_MOBILE = "COMP_crop_1k";
export const RAW = "raw";
export const SEG = "seg";

// just run the query once; no need to keep re-evaluating
// match iphone 6/7/8 (not Plus)
export const MOBILE_MEDIA_QUERY = window.matchMedia(
    "only screen and (min-device-width : 375px) and (max-device-width : 667px)"
);

export const MITOTIC_ACTIVITY_NO_CHANGE = "mitoticNoChange";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE = "mitoticReCompartmentalize";
export const MITOTIC_ACTIVITY_REDISTRIBUTE = "mitoticRedistribute";

export const MITOTIC_ACTIVITY_KEYS = [
    MITOTIC_ACTIVITY_NO_CHANGE,
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE,
    MITOTIC_ACTIVITY_REDISTRIBUTE,
];

export const PROTEIN_COLORS: { [index: number]: string } = {
    [GENE_IDS.ACTB]: "#FFEE1E",
    [GENE_IDS.ACTN1]: "#bbcd22",
    [GENE_IDS.CENT2]: "#F07C4C",
    [GENE_IDS.CTNNB1]: "#FD92B6",
    [GENE_IDS.DSP]: "#f0486e",
    [GENE_IDS.FBL]: "#0099ff",
    [GENE_IDS.GJA1]: "#c26cff",
    [GENE_IDS.LAMP1]: "#ffc35c",
    [GENE_IDS.LMNB1]: "#33ffff",
    [GENE_IDS.MYH10]: "#ff6633",
    [GENE_IDS.SEC61B]: "#537eff",
    [GENE_IDS.ST6GAL1]: "#61d900",
    [GENE_IDS.TJP1]: "#ff8ae8",
    [GENE_IDS.TOMM20]: "#FF4d4d",
    [GENE_IDS.TUBA1B]: "#ff9900",
    [GENE_IDS.DNA]: "#aeaeae",
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

export const RAW_CHANNEL_LEVELS: { [index: number]: { window: number; level: number } }[] = [
    {
        [GENE_IDS.DNA]: { window: 0.136, level: 0.806 },
        [GENE_IDS.ACTB]: { window: 0.155, level: 0.428 },
        [GENE_IDS.ACTN1]: { window: 0.202, level: 0.56 },
        [GENE_IDS.CENT2]: { window: 0.07, level: 0.353 },
        [GENE_IDS.CTNNB1]: { window: 0.107, level: 0.447 },
        [GENE_IDS.DSP]: { window: 0.089, level: 0.362 },
        [GENE_IDS.FBL]: { window: 0.287, level: 0.504 },
        [GENE_IDS.GJA1]: { window: 0.032, level: 0.07 },
        [GENE_IDS.LAMP1]: { window: 0.174, level: 0.296 },
        [GENE_IDS.LMNB1]: { window: 0.485, level: 0.504 },
        [GENE_IDS.MYH10]: { window: 0.117, level: 0.306 },
        [GENE_IDS.SEC61B]: { window: 0.277, level: 0.589 },
        [GENE_IDS.ST6GAL1]: { window: 0.089, level: 0.683 },
        [GENE_IDS.TJP1]: { window: 0.07, level: 0.409 },
        [GENE_IDS.TOMM20]: { window: 0.117, level: 0.485 },
        [GENE_IDS.TUBA1B]: { window: 0.419, level: 0.428 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.117, level: 0.645 },
        [GENE_IDS.ACTB]: { window: 0.202, level: 0.504 },
        [GENE_IDS.ACTN1]: { window: 0.145, level: 0.381 },
        [GENE_IDS.CENT2]: { window: 0.145, level: 0.334 },
        [GENE_IDS.CTNNB1]: { window: 0.211, level: 0.475 },
        [GENE_IDS.DSP]: { window: 0.041, level: 0.447 },
        [GENE_IDS.FBL]: { window: 0.504, level: 0.504 },
        [GENE_IDS.GJA1]: { window: 0.06, level: 0.089 },
        [GENE_IDS.LAMP1]: { window: 0.268, level: 0.56 },
        [GENE_IDS.LMNB1]: { window: 0.419, level: 0.532 },
        [GENE_IDS.MYH10]: { window: 0.089, level: 0.202 },
        [GENE_IDS.SEC61B]: { window: 0.211, level: 0.636 },
        [GENE_IDS.ST6GAL1]: { window: 0.079, level: 0.598 },
        [GENE_IDS.TJP1]: { window: 0.155, level: 0.258 },
        [GENE_IDS.TOMM20]: { window: 0.155, level: 0.494 },
        [GENE_IDS.TUBA1B]: { window: 0.23, level: 0.211 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.079, level: 0.674 },
        [GENE_IDS.ACTB]: { window: 0.089, level: 0.353 },
        [GENE_IDS.ACTN1]: { window: 0.06, level: 0.541 },
        [GENE_IDS.CENT2]: { window: 0.051, level: 0.268 },
        [GENE_IDS.CTNNB1]: { window: 0.117, level: 0.419 },
        [GENE_IDS.DSP]: { window: 0.041, level: 0.24 },
        [GENE_IDS.FBL]: { window: 0.117, level: 0.523 },
        [GENE_IDS.GJA1]: { window: 0.079, level: 0.117 },
        [GENE_IDS.LAMP1]: { window: 0.126, level: 0.447 },
        [GENE_IDS.LMNB1]: { window: 0.164, level: 0.475 },
        [GENE_IDS.MYH10]: { window: 0.107, level: 0.287 },
        [GENE_IDS.SEC61B]: { window: 0.117, level: 0.607 },
        [GENE_IDS.ST6GAL1]: { window: 0.06, level: 0.721 },
        [GENE_IDS.TJP1]: { window: 0.032, level: 0.258 },
        [GENE_IDS.TOMM20]: { window: 0.155, level: 0.636 },
        [GENE_IDS.TUBA1B]: { window: 0.117, level: 0.277 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.145, level: 0.607 },
        [GENE_IDS.ACTB]: { window: 0.079, level: 0.523 },
        [GENE_IDS.ACTN1]: { window: 0.079, level: 0.334 },
        [GENE_IDS.CENT2]: { window: 0.07, level: 0.296 },
        [GENE_IDS.CTNNB1]: { window: 0.126, level: 0.494 },
        [GENE_IDS.DSP]: { window: 0.041, level: 0.296 },
        [GENE_IDS.FBL]: { window: 0.107, level: 0.692 },
        [GENE_IDS.GJA1]: { window: 0.089, level: 0.089 },
        [GENE_IDS.LAMP1]: { window: 0.126, level: 0.306 },
        [GENE_IDS.LMNB1]: { window: 0.145, level: 0.73 },
        [GENE_IDS.MYH10]: { window: 0.07, level: 0.428 },
        [GENE_IDS.SEC61B]: { window: 0.107, level: 0.664 },
        [GENE_IDS.ST6GAL1]: { window: 0.089, level: 0.872 },
        [GENE_IDS.TJP1]: { window: 0.089, level: 0.372 },
        [GENE_IDS.TOMM20]: { window: 0.126, level: 0.607 },
        [GENE_IDS.TUBA1B]: { window: 0.164, level: 0.372 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.07, level: 0.664 },
        [GENE_IDS.ACTB]: { window: 0.107, level: 0.485 },
        [GENE_IDS.ACTN1]: { window: 0.079, level: 0.532 },
        [GENE_IDS.CENT2]: { window: 0.032, level: 0.372 },
        [GENE_IDS.CTNNB1]: { window: 0.051, level: 0.447 },
        [GENE_IDS.DSP]: { window: 0.06, level: 0.315 },
        [GENE_IDS.FBL]: { window: 0.126, level: 0.598 },
        [GENE_IDS.GJA1]: { window: 0.06, level: 0.136 },
        [GENE_IDS.LAMP1]: { window: 0.079, level: 0.494 },
        [GENE_IDS.LMNB1]: { window: 0.174, level: 0.541 },
        [GENE_IDS.MYH10]: { window: 0.098, level: 0.4 },
        [GENE_IDS.SEC61B]: { window: 0.117, level: 0.692 },
        [GENE_IDS.ST6GAL1]: { window: 0.051, level: 0.815 },
        [GENE_IDS.TJP1]: { window: 0.098, level: 0.268 },
        [GENE_IDS.TOMM20]: { window: 0.117, level: 0.655 },
        [GENE_IDS.TUBA1B]: { window: 0.107, level: 0.39 },
    },
];

export const RAW_CHANNEL_LEVELS_MOBILE: { [index: number]: { window: number; level: number } }[] = [
    {
        [GENE_IDS.DNA]: { window: 0.136, level: 0.806 },
        [GENE_IDS.ACTB]: { window: 0.155, level: 0.428 },
        [GENE_IDS.ACTN1]: { window: 0.202, level: 0.56 },
        [GENE_IDS.CENT2]: { window: 0.07, level: 0.431 },
        [GENE_IDS.CTNNB1]: { window: 0.107, level: 0.447 },
        [GENE_IDS.DSP]: { window: 0.089, level: 0.362 },
        [GENE_IDS.FBL]: { window: 0.287, level: 0.504 },
        [GENE_IDS.GJA1]: { window: 0.082, level: 0.091 },
        [GENE_IDS.LAMP1]: { window: 0.174, level: 0.296 },
        [GENE_IDS.LMNB1]: { window: 0.485, level: 0.504 },
        [GENE_IDS.MYH10]: { window: 0.117, level: 0.306 },
        [GENE_IDS.SEC61B]: { window: 0.277, level: 0.589 },
        [GENE_IDS.ST6GAL1]: { window: 0.089, level: 0.683 },
        [GENE_IDS.TJP1]: { window: 0.07, level: 0.409 },
        [GENE_IDS.TOMM20]: { window: 0.117, level: 0.485 },
        [GENE_IDS.TUBA1B]: { window: 0.419, level: 0.428 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.117, level: 0.645 },
        [GENE_IDS.ACTB]: { window: 0.202, level: 0.504 },
        [GENE_IDS.ACTN1]: { window: 0.145, level: 0.45 },
        [GENE_IDS.CENT2]: { window: 0.129, level: 0.374 },
        [GENE_IDS.CTNNB1]: { window: 0.211, level: 0.475 },
        [GENE_IDS.DSP]: { window: 0.041, level: 0.447 },
        [GENE_IDS.FBL]: { window: 0.504, level: 0.504 },
        [GENE_IDS.GJA1]: { window: 0.054, level: 0.148 },
        [GENE_IDS.LAMP1]: { window: 0.268, level: 0.56 },
        [GENE_IDS.LMNB1]: { window: 0.419, level: 0.532 },
        [GENE_IDS.MYH10]: { window: 0.089, level: 0.202 },
        [GENE_IDS.SEC61B]: { window: 0.211, level: 0.636 },
        [GENE_IDS.ST6GAL1]: { window: 0.079, level: 0.598 },
        [GENE_IDS.TJP1]: { window: 0.155, level: 0.258 },
        [GENE_IDS.TOMM20]: { window: 0.155, level: 0.494 },
        [GENE_IDS.TUBA1B]: { window: 0.23, level: 0.211 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.079, level: 0.674 },
        [GENE_IDS.ACTB]: { window: 0.129, level: 0.403 },
        [GENE_IDS.ACTN1]: { window: 0.06, level: 0.541 },
        [GENE_IDS.CENT2]: { window: 0.072, level: 0.327 },
        [GENE_IDS.CTNNB1]: { window: 0.117, level: 0.419 },
        [GENE_IDS.DSP]: { window: 0.025, level: 0.252 },
        [GENE_IDS.FBL]: { window: 0.117, level: 0.523 },
        [GENE_IDS.GJA1]: { window: 0.091, level: 0.138 },
        [GENE_IDS.LAMP1]: { window: 0.126, level: 0.447 },
        [GENE_IDS.LMNB1]: { window: 0.164, level: 0.475 },
        [GENE_IDS.MYH10]: { window: 0.107, level: 0.287 },
        [GENE_IDS.SEC61B]: { window: 0.117, level: 0.607 },
        [GENE_IDS.ST6GAL1]: { window: 0.091, level: 0.771 },
        [GENE_IDS.TJP1]: { window: 0.072, level: 0.299 },
        [GENE_IDS.TOMM20]: { window: 0.155, level: 0.636 },
        [GENE_IDS.TUBA1B]: { window: 0.117, level: 0.277 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.145, level: 0.607 },
        [GENE_IDS.ACTB]: { window: 0.079, level: 0.523 },
        [GENE_IDS.ACTN1]: { window: 0.079, level: 0.334 },
        [GENE_IDS.CENT2]: { window: 0.07, level: 0.296 },
        [GENE_IDS.CTNNB1]: { window: 0.126, level: 0.494 },
        [GENE_IDS.DSP]: { window: 0.063, level: 0.346 },
        [GENE_IDS.FBL]: { window: 0.107, level: 0.692 },
        [GENE_IDS.GJA1]: { window: 0.072, level: 0.129 },
        [GENE_IDS.LAMP1]: { window: 0.126, level: 0.306 },
        [GENE_IDS.LMNB1]: { window: 0.145, level: 0.73 },
        [GENE_IDS.MYH10]: { window: 0.07, level: 0.428 },
        [GENE_IDS.SEC61B]: { window: 0.107, level: 0.664 },
        [GENE_IDS.ST6GAL1]: { window: 0.035, level: 0.903 },
        [GENE_IDS.TJP1]: { window: 0.089, level: 0.372 },
        [GENE_IDS.TOMM20]: { window: 0.126, level: 0.607 },
        [GENE_IDS.TUBA1B]: { window: 0.164, level: 0.372 },
    },
    {
        [GENE_IDS.DNA]: { window: 0.07, level: 0.664 },
        [GENE_IDS.ACTB]: { window: 0.107, level: 0.485 },
        [GENE_IDS.ACTN1]: { window: 0.079, level: 0.532 },
        [GENE_IDS.CENT2]: { window: 0.032, level: 0.372 },
        [GENE_IDS.CTNNB1]: { window: 0.051, level: 0.447 },
        [GENE_IDS.DSP]: { window: 0.06, level: 0.315 },
        [GENE_IDS.FBL]: { window: 0.126, level: 0.598 },
        [GENE_IDS.GJA1]: { window: 0.091, level: 0.233 },
        [GENE_IDS.LAMP1]: { window: 0.079, level: 0.494 },
        [GENE_IDS.LMNB1]: { window: 0.174, level: 0.541 },
        [GENE_IDS.MYH10]: { window: 0.098, level: 0.4 },
        [GENE_IDS.SEC61B]: { window: 0.117, level: 0.692 },
        [GENE_IDS.ST6GAL1]: { window: 0.051, level: 0.815 },
        [GENE_IDS.TJP1]: { window: 0.098, level: 0.268 },
        [GENE_IDS.TOMM20]: { window: 0.117, level: 0.655 },
        [GENE_IDS.TUBA1B]: { window: 0.107, level: 0.39 },
    },
];
