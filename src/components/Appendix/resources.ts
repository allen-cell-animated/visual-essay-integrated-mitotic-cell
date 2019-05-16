export interface PrimaryResourceGroup {
    title: string;
    resources: PrimaryResource[];
}

export interface PrimaryResource {
    description: string;
    image: string; // href
    link: string;
    title: string;
}

export interface RelatedResource {
    description: string;
    link: string;
    label: string;
}

const exploreDataResources: PrimaryResourceGroup = {
    title: "Explore 3D cell images in our full-featured online volume viewers",
    resources: [
        {
            description: "A 3D gallery with 75 cell images used to create the IMSC model.",
            image:
                "https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/appendix/icon-CFE.png",
            link: "https://www.allencell.org/cell-feature-explorer.html",
            title: "Cell Feature Explorer",
        },
        {
            description: "A searchable/sortable gallery with all 39,200 cells from our database.",
            image:
                "https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/appendix/icon-3DCV.png",
            link: "https://www.allencell.org/3d-cell-viewer.html",
            title: "3D Cell Viewer",
        },
    ],
};

const educationalResources: PrimaryResourceGroup = {
    title: "Educational resources to teach about the cell cycle",
    resources: [
        {
            description: "Learn more about the biology of stem cells and what we study.",
            image:
                "https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/appendix/icon-VizGuide.png",
            link: "https://allencell.org/visual-guide-to-human-cells.html",
            title: "Visual Guide to Human Cells",
        },
        {
            description: "How do teachers use allencell.org data and tools in their classrooms?",
            image:
                "https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/appendix/icon-EduPrez.png",
            link: "https://www.allencell.org/educational-resources.html#sectionASCB-talks-2018",
            title: "Presentations from Educators",
        },
    ],
};

export const primaryResources = [exploreDataResources, educationalResources];

export const relatedResources: RelatedResource[] = [
    {
        description: "How did we align the 75 cells to create the IMSC model?",
        link:
            "https://www.allencell.org/hips-cells-during-mitosis.html#sectionMethods-for-mitotic-cells",
        label: "Methods",
    },
    {
        description: "A tool for enhanced visual comprehension of 3D volumetric images.",
        link: "https://www.allencell.org/software-and-code.html#agave",
        label: "AGAVE Renderer",
    },
    {
        description: "Obtain cell lines and plasmids for your lab.",
        link: "https://www.allencell.org/cell-catalog.html",
        label: "Cell Catalog",
    },
    {
        description: "Download cell feature or image data for use on your computer",
        link: "https://www.allencell.org/data-downloading.html",
        label: "Data Downloads",
    },
];