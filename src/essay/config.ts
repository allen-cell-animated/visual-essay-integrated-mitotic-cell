/************************************************************************************
 *
 * This module is for typings describing the essay's JSON (configuration) structure.
 *
 ***********************************************************************************/

// -------- High level constructs --------
/**
 * Sectioning abstraction: container of chapters
 */
export interface EssaySection {
    sectionId: string;
    title: string; // title for section used in navigation bar
    chapters: EssayChapter[];
}

/**
 * Sectioning abstraction: container of pages
 */
export interface EssayChapter {
    chapterId: string;
    title: string; // title for chapter used in navigation bar
    pages: EssayPage[];
}

/**
 * Lowest level cohesive unit describing the UI at any given point in time.
 *
 * TODO: Figure out how to get compiler to enforce string literal options.
 */
export interface EssayPage {
    pageId: string | number;
    layout: string; // one of "two-column" | "one-column"
    transition?: string; // one of "push" | "fade" | "stack"
    media: MediaReference;
    body: PageBody;
}

/**
 * When the config is transformed into code entities, any normalization will be undone: a reference to media (e.g.,
 * "mediaId") will be replaced with the media configuration itself. This is to avoid any need for lookups.
 */
export interface EssayPageWithResolvedMedia {
    pageId: string | number;
    layout: string;
    transition?: string;
    media: ResolvedVideoReference | ResolvedImageReference;
    body: PageBodyWithResolvedMedia;
}

/**
 * JSON document mapping ids to configuration.
 */
export interface EssayMedia {
    [index: string]: VideoConfig | ImageConfig;
}

// -------- Media --------
/**
 * Found within EssayMedia and, after denormalization, within EssayPageWithResolvedMedia
 */
export interface VideoConfig {
    type: string; // "video"
    source: string[][]; // [[url, contentType], [url, contentType]]
    markers: {
        [index: string]: VideoMarker;
    };
}

export interface VideoMarker {
    startTime: number;
    endTime: number;
}

/**
 * Found within EssayMedia and, after denormalization, within EssayPageWithResolvedMedia
 */
export interface ImageConfig {
    type: string; // "image"
    source: string; // url
}

/**
 * MediaReference is nested in EssayPages as a way of normalizing references to make authoring Pages less repetitive.
 */
export interface MediaReference {
    mediaId: string;
    marker: string;
    loop?: boolean;
}

/**
 * An EssayPage's MediaReference is denormalized into either ResolvedVideoReference or ResolvedImageReference.
 */
export interface ResolvedVideoReference extends MediaReference {
    reference: VideoConfig;
    startTime: number;
    endTime: number;
}

export interface ResolvedImageReference extends MediaReference {
    reference: ImageConfig;
}

// -------- Page body --------
/**
 * Describes the "secondary" content (usually text) describing or otherwise providing context for the primary media in
 * an EssayPage.
 */
export interface PageBody {
    transition?: string;
    content: (BodyContentText | BodyContentMedia)[];
}

export interface PageBodyWithResolvedMedia {
    transition?: string;
    content: (BodyContentText | BodyContentResolvedVideo | BodyContentResolvedImage)[];
}

export interface BodyContentText {
    type: string; // "text"
    element: string;
    text: string;
}

export interface BodyContentMedia extends MediaReference {
    type: string; // "media"
}

export interface BodyContentResolvedVideo extends ResolvedVideoReference {
    type: string; // "media"
}

export interface BodyContentResolvedImage extends ResolvedImageReference {
    type: string; // "media"
}
