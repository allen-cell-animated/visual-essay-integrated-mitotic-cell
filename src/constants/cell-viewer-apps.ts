import { values, filter } from "lodash";

export enum MITOTIC_STAGE_IDS {
    "Interphase" = 1,
    "M1-M2",
    "M3",
    "M4-M5",
    "M6-M7",
}

export enum MITOTIC_STAGE_NAMES {
    "Interphase" = "Interphase",
    "M1-M2" = "Prophase",
    "M3" = "Early prometaphase",
    "M4-M5" = "Metaphase",
    "M6-M7" = "Anaphase",
}

export const MITOTIC_STAGES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];

export enum GENE_IDS {
    "DNA" = 1,
    "FBL",
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
}

export const GENE_IDS_TO_PROTEIN_NAME_MAP: { [index: number]: string } = {
    [GENE_IDS.ACTB]: "beta-actin",
    [GENE_IDS.ACTN1]: "actin",
    [GENE_IDS.CENT2]: "centrin-2",
    [GENE_IDS.CTNNB1]: "beta-catenin",
    [GENE_IDS.DSP]: "desmoplakin",
    [GENE_IDS.FBL]: "fibrillarin",
    [GENE_IDS.GJA1]: "connexin-43",
    [GENE_IDS.LAMP1]: "LAMP-1",
    [GENE_IDS.LMNB1]: "lamin B1",
    [GENE_IDS.MYH10]: "myosin heavy chain IIB",
    [GENE_IDS.SEC61B]: "sec61-beta",
    [GENE_IDS.ST6GAL1]: "sialyltransferase 1",
    [GENE_IDS.TJP1]: "tight junction protein ZO1",
    [GENE_IDS.TOMM20]: "TOM20",
    [GENE_IDS.TUBA1B]: "alpha tubulin",
};

export const GENE_IDS_TO_STRUCTURE_NAMES_MAP: { [index: number]: string } = {
    [GENE_IDS.ACTB]: "Actin filaments",
    [GENE_IDS.ACTN1]: "Actin bundles",
    [GENE_IDS.CENT2]: "Centrosome",
    [GENE_IDS.CTNNB1]: "Adherens junctions",
    [GENE_IDS.DSP]: "Desmosomes",
    [GENE_IDS.FBL]: "Nucleolus (DF)",
    [GENE_IDS.GJA1]: "Gap junction",
    [GENE_IDS.LAMP1]: "Lysosome",
    [GENE_IDS.LMNB1]: "Nuclear envelope",
    [GENE_IDS.MYH10]: "Actomyosin bundles",
    [GENE_IDS.SEC61B]: "Endoplasmic reticulum",
    [GENE_IDS.ST6GAL1]: "Golgi",
    [GENE_IDS.TJP1]: "Tight junctions",
    [GENE_IDS.TOMM20]: "Mitochondria",
    [GENE_IDS.TUBA1B]: "Microtubules",
};

export const LABELED_STRUCTURE_NAMES = filter(values(GENE_IDS), (ele: number | string) => {
    return typeof ele === "string";
});

export const LABELED_GENES_ARRAY = filter(
    LABELED_STRUCTURE_NAMES,
    (name: string) => name !== "DNA"
);
