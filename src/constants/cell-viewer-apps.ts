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

export enum GENE_ID_MAP {
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

export const PROTEIN_NAMES: { [index: number]: string } = {
    [GENE_ID_MAP.ACTB]: "Beta actin",
    [GENE_ID_MAP.ACTN1]: "Actin",
    [GENE_ID_MAP.CENT2]: "Centrin-2",
    [GENE_ID_MAP.CTNNB1]: "Beta catenin",
    [GENE_ID_MAP.DSP]: "Desmoplakin",
    [GENE_ID_MAP.FBL]: "Fibrillarin",
    [GENE_ID_MAP.GJA1]: "Connexin-43",
    [GENE_ID_MAP.LAMP1]: "LAMP-1",
    [GENE_ID_MAP.LMNB1]: "Lamin B1",
    [GENE_ID_MAP.MYH10]: "Non-muscle myosin heavy chain IIB",
    [GENE_ID_MAP.SEC61B]: "Sec61-beta",
    [GENE_ID_MAP.ST6GAL1]: "Sialyltransferase 1",
    [GENE_ID_MAP.TJP1]: "Tight junction protein ZO1",
    [GENE_ID_MAP.TOMM20]: "TOM20",
    [GENE_ID_MAP.TUBA1B]: "Alpha tubulin",
    [GENE_ID_MAP.DNA]: "DNA",
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

export const LABELED_STRUCTURE_NAMES = filter(values(GENE_ID_MAP), (ele: number | string) => {
    return typeof ele === "string";
});

export const LABELED_GENES_ARRAY = filter(
    LABELED_STRUCTURE_NAMES,
    (name: string) => name !== "DNA"
);
