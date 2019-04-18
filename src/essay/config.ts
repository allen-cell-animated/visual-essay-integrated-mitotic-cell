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
    media: VideoReference | ImageReference;
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

/**
 * Found within EssayMedia and, after denormalization, within EssayPageWithResolvedMedia
 */
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
 * VideoReference is used in EssayPages as a way of normalizing references to videos to make authoring Pages less
 * repetitive.
 */
export interface VideoReference {
    mediaId: string;
    marker?: string;
    loop?: boolean;
}

/**
 * ImageReference is used in EssayPages as a way of normalizing references to images to make authoring Pages less
 * repetitive.
 */
export interface ImageReference {
    mediaId: string;
}

/**
 * An EssayPage's reference to a video or image is denormalized into either ResolvedVideoReference or ResolvedImageReference.
 */
export interface ResolvedVideoReference extends VideoReference {
    reference: VideoConfig;
    startTime: number;
    endTime: number;
}

export interface ResolvedImageReference extends ImageReference {
    reference: ImageConfig;
}

// -------- Page body --------
/**
 * Describes the "secondary" content (usually text) describing or otherwise providing context for the primary media in
 * an EssayPage.
 */
export interface PageBody {
    transition?: string;
    content: (BodyContentText | BodyContentVideo | BodyContentImage)[];
}

export interface PageBodyWithResolvedMedia {
    transition?: string;
    content: (BodyContentText | BodyContentResolvedVideo | BodyContentResolvedImage)[];
}

interface WithType {
    type: string; // one of "text" or "media"
}

export interface BodyContentText extends WithType {
    element: string;
    text: string;
}

type BodyContentImage = WithType & ImageReference;
type BodyContentVideo = WithType & VideoReference;

export interface BodyContentResolvedVideo extends ResolvedVideoReference {
    type: string; // "media"
}

export interface BodyContentResolvedImage extends ResolvedImageReference {
    type: string; // "media"
}
