interface Media {
    mediaId: string;
    marker: string;
    loop?: boolean;
}

interface BodyContentText {
    type: "text";
    element: string;
    text: string;
}

interface BodyContentMedia extends Media {
    type: "media";
}

interface Body {
    transition?: Transition;
    content: (BodyContentText | BodyContentMedia)[];
}

type Transition = "push" | "fade" | "stack";

/**
 * The PageConfig interface represents the intended JSON structure this class will consume
 */
interface PageConfig {
    pageId: string | number;
    layout: "two-column" | "one-column";
    transition?: Transition;
    media: Media;
    body: Body;
}

export default class Page {
    private _chapterId: string;
    private _config: PageConfig;
    private _order: number; // order within essay as a whole, independent of chapter or section
    private _sectionId: string;

    public constructor(
        config: PageConfig,
        chapterId: string,
        sectionId: string,
        order: number
    ) {
        this._config = config;
        this._chapterId = chapterId;
        this._sectionId = sectionId;
        this._order = order;
    }

    public get id(): string {
        return `${this._sectionId}:${this._chapterId}:${this._config.pageId}`;
    }

    public get index(): number {
        return this._order;
    }

    public get layout(): string {
        return this._config.layout;
    }

    public get transition(): string | undefined {
        return this._config.transition;
    }

    public get body(): Body {
        return this._config.body;
    }

    public get media(): Media {
        return this._config.media;
    }
}
