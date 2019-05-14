export interface PrimaryResourceGroup {
    title: string;
    resources: PrimaryResource[];
}

export interface PrimaryResource {
    description: string;
    image: string; // href
    title: string;
}

export interface RelatedResource {
    description: string;
    href: string; // link
    label: string;
}

const exploreDataResources: PrimaryResourceGroup = {
    title: "Explore 3D cell images in our full-featured online volume viewers",
    resources: [
        {
            description: "A 3D gallery with 75 cell images used to create the IMSC model.",
            image: "",
            title: "Cell Feature Explorer",
        },
        {
            description: "A searchable/sortable gallery with all 39,200 cells from our database.",
            image: "",
            title: "3D Cell Viewer",
        },
    ],
};

const educationalResources: PrimaryResourceGroup = {
    title: "Educational resources to teach about the cell cycle",
    resources: [
        {
            description: "Learn more about the biology of stem cells and what we study.",
            image: "",
            title: "Visual Guide to Human Cells",
        },
        {
            description: "How do teachers use allencell.org data and tools in their classrooms?",
            image: "",
            title: "Presentations from Educators",
        },
    ],
};

export const primaryResources = [exploreDataResources, educationalResources];

export const relatedResources: RelatedResource[] = [
    {
        description: "How did we align the 75 cells to create the IMSC model?",
        href: "",
        label: "Methods",
    },
    {
        description: "A tool for enhanced visual comprehension of 3D volumetric images.",
        href: "",
        label: "AGAVE Renderer",
    },
    {
        description: "Obtain cell lines and plasmids for your lab.",
        href: "",
        label: "Cell Catalog",
    },
    {
        description: "Download cell feature or image data for use on your computer",
        href: "",
        label: "Data Downloads",
    },
];
