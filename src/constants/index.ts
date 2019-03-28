export const APP_ID = "imsc-visual-essay";
export const API_VERSION = "v1";
export const BASE_API_URL = `/imsc-visual-essay/api/${API_VERSION}`;

export const MITOTIC_ACTIVITY_NO_CHANGE = "mitoticNoChange";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE = "mitoticReCompartmentalize";
export const MITOTIC_ACTIVITY_REDISTRIBUTE = "mitoticRedistribute";


export const MITOTIC_ACTIVITY_NO_CHANGE_SEG = "mitoticNoChange_seg";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_SEG =
    "mitoticReCompartmentalize_seg";
export const MITOTIC_ACTIVITY_REDISTRIBUTE_SEG = "mitoticRedistribute_seg";
export const MITOTIC_ACTIVITY_NO_CHANGE_RAW = "mitoticNoChange_raw";
export const MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_RAW =
    "mitoticReCompartmentalize_raw";
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

    [MITOTIC_ACTIVITY_NO_CHANGE_SEG]: [],
    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_SEG]: [],
    [MITOTIC_ACTIVITY_REDISTRIBUTE_SEG]: [],
    [MITOTIC_ACTIVITY_NO_CHANGE_RAW]: [],
    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_RAW]: [],
    [MITOTIC_ACTIVITY_REDISTRIBUTE_RAW]: [],
};

export const MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP = {
    [MITOTIC_ACTIVITY_NO_CHANGE]: [
        "DSP_seg",
        "ACTN1_seg",
        "ACTB_seg",
        "MYH10_seg",
        "TJP1_seg",
        "CTNNB1_seg",
        "GJA1_seg",
    ],

    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_SEG]: [
        "LMNB1_seg",
        "SEC61B_seg",
        "NPM1_seg",
        "FBL_seg",
        "ST6GAL1_seg",
    ],

    [MITOTIC_ACTIVITY_REDISTRIBUTE_SEG]: [
        "TUBA1B_seg",
        "ACTN1_seg",
        "CENT2_seg",
        "ACTB_seg",
        "TOMM20_seg",
        "MYH10_seg",
    ],

    [MITOTIC_ACTIVITY_NO_CHANGE_RAW]: [
        "DSP_raw",
        "ACTN1_raw",
        "ACTB_raw",
        "MYH10_raw",
        "TJP1_raw",
        "CTNNB1_raw",
        "GJA1_raw",
    ],
    [MITOTIC_ACTIVITY_RECOMPARTMENTALIZE_RAW]: [
        "LMNB1_raw",
        "SEC61B_raw",
        "NPM1_raw",
        "FBL_raw",
        "ST6GAL1_raw",
    ],
    [MITOTIC_ACTIVITY_REDISTRIBUTE_RAW]: [
        "TUBA1B_raw",
        "ACTN1_raw",
        "CENT2_raw",
        "ACTB_raw",
        "TOMM20_raw",
        "MYH10_raw",
    ],
};

export const CELL_VIEWER_CONFIG = {
    AutoRotateButton: true,
    AxisClipSliders: false,
    ColorPicker: true,
    AlphaMask: false,
    BrightnessSlider: false,
    DensitySlider: false,
    LevelsSliders: false,
    ColorPresetsDropdown: false,
};

export enum MesoStructure {
    NuclearEnvelope = 1,
    Chromatin = 3,
    Nucleolus = 4,
    EndoplasmicReticulum = 5,
    ActinFilament = 6,
    Centrosome = 7,
    IntermediateFilament = 8,
    Microtubules = 9,
    Mitochondria = 10,
    GolgiApparatus = 11,
    Lysosome = 12,
    Cytoplasm = 13,
    Peroxisomes = 14,
    Membrane = 15,
    TightJunction = 16,
    Desmosomes = 17,
    ActomyosinBundles = 18,
    GapJunctions = 19,
    Endosomes = 20,
    ActinBundles = 21,
}

export const MesoStructureColors: { [index: number]: string } = {
    [MesoStructure.ActinFilament]: "#FDDB02",
    [MesoStructure.ActinBundles]: "#F7DB78",
    [MesoStructure.ActomyosinBundles]: "#FF6200",
    [MesoStructure.Centrosome]: "#F9A558",
    [MesoStructure.Chromatin]: "#DAD6EB",
    [MesoStructure.Cytoplasm]: "#F5F5F5",
    [MesoStructure.Desmosomes]: "#FF05DE",
    [MesoStructure.EndoplasmicReticulum]: "#24BCFA",
    [MesoStructure.GapJunctions]: "#dbaff0",
    [MesoStructure.GolgiApparatus]: "#6fba11",
    [MesoStructure.Lysosome]: "#A79777",
    [MesoStructure.Membrane]: "#CFC6CF",
    [MesoStructure.Microtubules]: "#F9A558",
    [MesoStructure.Mitochondria]: "#F75543",
    [MesoStructure.NuclearEnvelope]: "#8DA3C0",
    [MesoStructure.Nucleolus]: "#98B0D6",
    [MesoStructure.Peroxisomes]: "#11A89A",
    [MesoStructure.TightJunction]: "#9600F4",
};

export const MesoStructureLightColors: { [index: number]: string } = {
    [MesoStructure.ActinFilament]: "#f5f1cb",
    [MesoStructure.ActinBundles]: "#E7DCBE",
    [MesoStructure.ActomyosinBundles]: "#E2CDB3",
    [MesoStructure.Centrosome]: "#ebd5d2",
    [MesoStructure.Chromatin]: "#e3f4f5",
    [MesoStructure.Cytoplasm]: "#FBF0FA",
    [MesoStructure.Desmosomes]: "#F0ECDD",
    [MesoStructure.EndoplasmicReticulum]: "#dbe8d1",
    [MesoStructure.GapJunctions]: "#EEE8F7",
    [MesoStructure.GolgiApparatus]: "#e0e3d1",
    [MesoStructure.Lysosome]: "#DED5C1",
    [MesoStructure.Membrane]: "#888888",
    [MesoStructure.Microtubules]: "#f0e0d3",
    [MesoStructure.Mitochondria]: "#F4D4D7",
    [MesoStructure.NuclearEnvelope]: "#F7FAFC",
    [MesoStructure.Nucleolus]: "#D5DEF0",
    [MesoStructure.Peroxisomes]: "#57F9EB",
    [MesoStructure.TightJunction]: "#DD9BF5",
};

export enum MolecularStructure {
    Lipids = 1,
    LaminB1,
    DNA,
    GActin,
    Centrin2,
    BetaTubulin,
    Keratin,
    LAMP1,
    Ribosomes,
    Desmokplakin,
    Histones,
    Fibrillarin,
    rRNA,
    Sec61,
    ACTB,
    Kinesins,
    Dynein,
    Tom20,
    Peroxidases,
    Receptors,
    Pumps,
    Channels,
    Proteases,
    Myosin,
    BakAndBax,
    DeathReceptors,
    Kinesin,
    TUBA1B,
    Siayltransferase1,
}
