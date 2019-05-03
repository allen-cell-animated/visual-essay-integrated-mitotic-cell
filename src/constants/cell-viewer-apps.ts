import { values, filter } from "lodash";

export enum MITOTIC_STAGES_MAP {
    "Interphase" = 1,
    "M1-M2",
    "M3",
    "M4-M5",
    "M6-M7",
}

export enum MITOTIC_STAGE_NAMES {
    "Interphase" = "Interphase",
    "M1-M2" = "Prophase",
    "M3" = "Prometaphase",
    "M4-M5" = "Metaphase",
    "M6-M7" = "Anaphase",
}

export const MITOTIC_STAGES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];

export enum LABELED_STRUCTURE_NAME_MAP {
    "FBL" = 1,
    "LMNB1",
    "SEC61B",
    "ST6GAL1",
    "CENT2",
    "LAMP1",
    "TUBA1B",
    "TOMM20",
    "ACTB",
    "ACTN1",
    "MYH10",
    "CTNNB1",
    "DSP",
    "GJA1",
    "TJP1",
    "DNA",
}

export const STRUCTURE_NAMES: { [index: number]: string } = {
    [LABELED_STRUCTURE_NAME_MAP.ACTB]: "Actin filaments",
    [LABELED_STRUCTURE_NAME_MAP.ACTN1]: "Actin bundles",
    [LABELED_STRUCTURE_NAME_MAP.CENT2]: "Centrosome",
    [LABELED_STRUCTURE_NAME_MAP.CTNNB1]: "Adherens junctions",
    [LABELED_STRUCTURE_NAME_MAP.DSP]: "Desmosomes",
    [LABELED_STRUCTURE_NAME_MAP.FBL]: "Nucleolus (DF)",
    [LABELED_STRUCTURE_NAME_MAP.GJA1]: "Gap junction",
    [LABELED_STRUCTURE_NAME_MAP.LAMP1]: "Lysosome",
    [LABELED_STRUCTURE_NAME_MAP.LMNB1]: "Nuclear envelope",
    [LABELED_STRUCTURE_NAME_MAP.MYH10]: "Actomyosin bundles",
    [LABELED_STRUCTURE_NAME_MAP.SEC61B]: "ER",
    [LABELED_STRUCTURE_NAME_MAP.ST6GAL1]: "Golgi",
    [LABELED_STRUCTURE_NAME_MAP.TJP1]: "Tight junctions",
    [LABELED_STRUCTURE_NAME_MAP.TOMM20]: "Mitochondria",
    [LABELED_STRUCTURE_NAME_MAP.TUBA1B]: "Microtubules",
    [LABELED_STRUCTURE_NAME_MAP.DNA]: "DNA",
};

export const LABELED_STRUCTURE_NAMES = filter(
    values(LABELED_STRUCTURE_NAME_MAP),
    (ele: number | string) => {
        return typeof ele === "string";
    }
);

export const PROTEIN_NAMES = filter(LABELED_STRUCTURE_NAMES, (name: string) => name !== "DNA");
