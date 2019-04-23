export default {
    sectionId: "section-1",
    title: "Section 1",
    chapters: [
        {
            chapterId: "chapter-1",
            title: "Chapter 1",
            pages: [
                {
                    pageId: 1,
                    layout: "two-column",
                    transition: "push",
                    media: {
                        mediaId: "media-1",
                        marker: "zero",
                    },
                    body: {
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "A",
                            },
                        ],
                    },
                },
                {
                    pageId: 2,
                    layout: "two-column",
                    transition: "push",
                    media: {
                        mediaId: "media-1",
                        marker: "one",
                    },
                    body: {
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "A",
                            },
                        ],
                    },
                },
                {
                    pageId: 3,
                    layout: "one-column",
                    media: {
                        mediaId: "media-1",
                        marker: "two",
                    },
                    body: {
                        transition: "push",
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "B",
                            },
                        ],
                    },
                },
                {
                    pageId: 4,
                    layout: "two-column",
                    media: {
                        mediaId: "media-2",
                        marker: "entirety",
                    },
                    body: {
                        transition: "push",
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "C",
                            },
                        ],
                    },
                },
                {
                    pageId: 5,
                    layout: "two-column",
                    media: {
                        mediaId: "media-2",
                        marker: "entirety",
                    },
                    body: {
                        transition: "push",
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "D",
                            },
                            {
                                type: "text",
                                element: "p",
                                text: "E",
                            },
                        ],
                    },
                },
                {
                    pageId: 6,
                    layout: "one-column",
                    media: {
                        mediaId: "media-2",
                        marker: "entirety",
                        transition: "fade",
                    },
                    body: {
                        transition: "fade",
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "F",
                            },
                        ],
                    },
                },
                {
                    pageId: 6,
                    layout: "one-column",
                    media: {
                        mediaId: "media-2",
                        marker: "entirety",
                        transition: "fade",
                    },
                    body: {
                        transition: "fade",
                        content: [
                            {
                                type: "text",
                                element: "p",
                                text: "F",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
