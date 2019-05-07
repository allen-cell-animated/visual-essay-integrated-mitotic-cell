import { GENE_ID_MAP, MITOTIC_STAGES_MAP } from "../../constants/cell-viewer-apps";

export const SLICES_PER_ZSTACK = 58;

export const MITOTIC_PHASES_DIR: { [index: number]: string } = {
    [MITOTIC_STAGES_MAP.Interphase]: "Interphase",
    [MITOTIC_STAGES_MAP["M1-M2"]]: "M1_M2",
    [MITOTIC_STAGES_MAP.M3]: "M3",
    [MITOTIC_STAGES_MAP["M4-M5"]]: "M4_M5",
    [MITOTIC_STAGES_MAP["M6-M7"]]: "M6_M7",
};

export const TAG_COLOR: { [index: number]: string } = {
    [GENE_ID_MAP.ACTB]: "mEGFP",
    [GENE_ID_MAP.ACTN1]: "mEGFP",
    [GENE_ID_MAP.CENT2]: "mTagRFP-T",
    [GENE_ID_MAP.CTNNB1]: "mEGFP",
    [GENE_ID_MAP.DSP]: "mEGFP",
    [GENE_ID_MAP.FBL]: "mEGFP",
    [GENE_ID_MAP.GJA1]: "mEGFP",
    [GENE_ID_MAP.LAMP1]: "mEGFP",
    [GENE_ID_MAP.LMNB1]: "mEGFP",
    [GENE_ID_MAP.MYH10]: "mEGFP",
    [GENE_ID_MAP.SEC61B]: "mEGFP",
    [GENE_ID_MAP.ST6GAL1]: "mEGFP",
    [GENE_ID_MAP.TJP1]: "mEGFP",
    [GENE_ID_MAP.TOMM20]: "mEGFP",
    [GENE_ID_MAP.TUBA1B]: "mEGFP",
};

export const GENE_TO_CELL_LINE: { [index: number]: number[] } = {
    [GENE_ID_MAP.ACTB]: [16],
    [GENE_ID_MAP.CENT2]: [32],
    [GENE_ID_MAP.CTNNB1]: [58],
    [GENE_ID_MAP.DSP]: [17],
    [GENE_ID_MAP.FBL]: [14],
    [GENE_ID_MAP.GJA1]: [53],
    [GENE_ID_MAP.LAMP1]: [22],
    [GENE_ID_MAP.LMNB1]: [13],
    [GENE_ID_MAP.MYH10]: [24],
    [GENE_ID_MAP.SEC61B]: [10],
    [GENE_ID_MAP.ST6GAL1]: [25],
    [GENE_ID_MAP.TJP1]: [23],
    [GENE_ID_MAP.TOMM20]: [11],
    [GENE_ID_MAP.TUBA1B]: [12, 31],
};

export const ZSTACK_IDS: { [index: number]: { [index: number]: string } } = {
    [MITOTIC_STAGES_MAP.Interphase]: {
        [GENE_ID_MAP.ACTB]: "36972",
        [GENE_ID_MAP.ACTN1]: "92320",
        [GENE_ID_MAP.CENT2]: "68018",
        [GENE_ID_MAP.CTNNB1]: "112818",
        [GENE_ID_MAP.DSP]: "26096",
        [GENE_ID_MAP.FBL]: "56186",
        [GENE_ID_MAP.GJA1]: "84867",
        [GENE_ID_MAP.LAMP1]: "8761",
        [GENE_ID_MAP.LMNB1]: "78027",
        [GENE_ID_MAP.MYH10]: "47479",
        [GENE_ID_MAP.SEC61B]: "34690",
        [GENE_ID_MAP.ST6GAL1]: "40381",
        [GENE_ID_MAP.TJP1]: "52374",
        [GENE_ID_MAP.TOMM20]: "16877",
        [GENE_ID_MAP.TUBA1B]: "71126",
    },
    [MITOTIC_STAGES_MAP["M1-M2"]]: {
        [GENE_ID_MAP.ACTB]: "36152",
        [GENE_ID_MAP.ACTN1]: "93340",
        [GENE_ID_MAP.CENT2]: "66089",
        [GENE_ID_MAP.CTNNB1]: "112512",
        [GENE_ID_MAP.DSP]: "22234",
        [GENE_ID_MAP.FBL]: "57673",
        [GENE_ID_MAP.GJA1]: "84547",
        [GENE_ID_MAP.LAMP1]: "4948",
        [GENE_ID_MAP.LMNB1]: "81600",
        [GENE_ID_MAP.MYH10]: "44648",
        [GENE_ID_MAP.SEC61B]: "31703",
        [GENE_ID_MAP.ST6GAL1]: "40899",
        [GENE_ID_MAP.TJP1]: "50874",
        [GENE_ID_MAP.TOMM20]: "15838",
        [GENE_ID_MAP.TUBA1B]: "71535",
    },
    [MITOTIC_STAGES_MAP.M3]: {
        [GENE_ID_MAP.ACTB]: "109970",
        [GENE_ID_MAP.ACTN1]: "88806",
        [GENE_ID_MAP.CENT2]: "67753",
        [GENE_ID_MAP.CTNNB1]: "114159",
        [GENE_ID_MAP.DSP]: "25417",
        [GENE_ID_MAP.FBL]: "52860",
        [GENE_ID_MAP.GJA1]: "105732",
        [GENE_ID_MAP.LAMP1]: "8830",
        [GENE_ID_MAP.LMNB1]: "81623",
        [GENE_ID_MAP.MYH10]: "44125",
        [GENE_ID_MAP.SEC61B]: "31957",
        [GENE_ID_MAP.ST6GAL1]: "40988",
        [GENE_ID_MAP.TJP1]: "52391",
        [GENE_ID_MAP.TOMM20]: "10456",
        [GENE_ID_MAP.TUBA1B]: "70407",
    },
    [MITOTIC_STAGES_MAP["M4-M5"]]: {
        [GENE_ID_MAP.ACTB]: "35865",
        [GENE_ID_MAP.ACTN1]: "109986",
        [GENE_ID_MAP.CENT2]: "64987",
        [GENE_ID_MAP.CTNNB1]: "115111",
        [GENE_ID_MAP.DSP]: "26057",
        [GENE_ID_MAP.FBL]: "58088",
        [GENE_ID_MAP.GJA1]: "85638",
        [GENE_ID_MAP.LAMP1]: "6077",
        [GENE_ID_MAP.LMNB1]: "82718",
        [GENE_ID_MAP.MYH10]: "47581",
        [GENE_ID_MAP.SEC61B]: "33239",
        [GENE_ID_MAP.ST6GAL1]: "41204",
        [GENE_ID_MAP.TJP1]: "48868",
        [GENE_ID_MAP.TOMM20]: "12975",
        [GENE_ID_MAP.TUBA1B]: "71092",
    },
    [MITOTIC_STAGES_MAP["M6-M7"]]: {
        [GENE_ID_MAP.ACTB]: "150386",
        [GENE_ID_MAP.ACTN1]: "89338",
        [GENE_ID_MAP.CENT2]: "68799",
        [GENE_ID_MAP.CTNNB1]: "151687",
        [GENE_ID_MAP.DSP]: "150279",
        [GENE_ID_MAP.FBL]: "150778",
        [GENE_ID_MAP.GJA1]: "105434",
        [GENE_ID_MAP.LAMP1]: "150859",
        [GENE_ID_MAP.LMNB1]: "149910",
        [GENE_ID_MAP.MYH10]: "150568",
        [GENE_ID_MAP.SEC61B]: "150403",
        [GENE_ID_MAP.ST6GAL1]: "150506",
        [GENE_ID_MAP.TJP1]: "49161",
        [GENE_ID_MAP.TOMM20]: "150139",
        [GENE_ID_MAP.TUBA1B]: "149843",
    },
};
