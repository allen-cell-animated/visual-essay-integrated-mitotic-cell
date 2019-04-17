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

export const PROTEIN_NAMES = [
    "MEMB",
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
];

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

export const defaultVolumesOn = ["LAMP1", "TOMM20", "TUBA1B", "ACTN1", "MYH10", "MEMB", "DNA"];
// export const INIT_CHANNEL_SETTINGS = channelNames.map((channel, index) => {
//         return {
//             name: channel,
//             [VOLUME_ENABLED]: includes(defaultVolumesOn, channel),
//             [ISO_SURFACE_ENABLED]: false,
//             isovalue: 188,
//             opacity: 1.0,
//             color: channelColors[index] ? channelColors[index].slice() : [226, 205, 179], // guard for unexpectedly longer channel list
//             dataReady: false,
//         };
//     });
// }

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
