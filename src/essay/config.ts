import * as React from "react";

import { InteractivePageProps } from "../components/InteractiveByPageGroup";

/************************************************************************************
 *
 * This module is for typings describing the essay's JSON (configuration) structure.
 *
 * It also provides some type guard utilities.
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
    title?: string; // title for chapter used in navigation bar; if omitted, chapter will not be included in nav
    pages: (StoryPageConfig | InteractivePageConfig)[];
}

/**
 * Lowest level cohesive unit describing the UI at any given point in time.
 *
 * TODO: Figure out how to get compiler to enforce string literal options.
 */
export interface BasePage {
    pageId: string | number;
    layout: string; // one of "two-column" | "one-column" | "none"
    header?: boolean; // show app header when page is active; defaults to true
    transition?: string; // one of "push" | "fade" | "stack"
}

export interface StoryPageConfig extends BasePage {
    body: PageBody;
    media: ControlledVideoReference | ImageReference;
}

export interface InteractivePageConfig extends BasePage {
    componentId: string; // References a React component
    media?: ControlledVideoReference | ImageReference;
}

/**
 * When the config is transformed into code entities, any normalization will be undone: a reference to a component
 * (e.g., "componentId") will be added to the page configuration.
 */
export interface InteractivePageWithResolvedComponent extends InteractivePageConfig {
    component: React.ComponentClass<InteractivePageProps>;
    media?: ResolvedControlledVideoReference | ResolvedImageReference;
}

/**
 * When the config is transformed into code entities, any normalization will be undone: a reference to media (e.g.,
 * "mediaId") will be replaced with the media configuration itself. This is to avoid any need for lookups.
 */
export interface StoryPageWithResolvedMedia extends StoryPageConfig {
    body: PageBodyWithResolvedMedia;
    media: ResolvedControlledVideoReference | ResolvedImageReference;
}

/**
 * JSON document mapping ids to configuration.
 */
export interface EssayMedia {
    [index: string]: ControlledVideoConfig | ImageConfig;
}

// -------- Media --------
export interface BaseVideoConfig {
    type: string; // "video"
    source: string[][]; // [[url, contentType], [url, contentType]]
}

/**
 * Found within EssayMedia and, after denormalization, within StoryPageWithResolvedMedia
 */
export interface ControlledVideoConfig extends BaseVideoConfig {
    markers: {
        [index: string]: VideoMarker;
    };
}

export type UncontrolledVideoConfig = BaseVideoConfig;

/**
 * Found within EssayMedia and, after denormalization, within StoryPageWithResolvedMedia
 */
export interface VideoMarker {
    startTime: number;
    endTime: number;
}

/**
 * Found within EssayMedia and, after denormalization, within StoryPageWithResolvedMedia
 */
export interface ImageConfig {
    type: string; // "image"
    source: string; // url
}

/**
 * ControlledVideoReference is used in EssayPages as a way of normalizing references to videos to make authoring Pages less
 * repetitive.
 */
export interface ControlledVideoReference {
    advanceOnExit?: boolean;
    caption?: string; // can be rich text; only valid in the context of UncontrolledVideo elements placed in "mixed media" body content
    loop?: boolean;
    marker: string;
    mediaId: string;
}

export interface UncontrolledVideoReference {
    caption?: string; // can be rich text; only valid in the context of UncontrolledVideo elements placed in "mixed media" body content
    loop?: boolean;
    mediaId: string;
}

/**
 * ImageReference is used in EssayPages as a way of normalizing references to images to make authoring Pages less
 * repetitive.
 */
export interface ImageReference {
    caption?: string; // can be rich text
    mediaId: string;
}

/**
 * An StoryPageConfig's reference to a video or image is denormalized into either ResolvedControlledVideoReference or ResolvedImageReference.
 */
export interface ResolvedControlledVideoReference extends ControlledVideoReference {
    reference: ControlledVideoConfig;
    startTime: number;
    endTime: number;
}

export interface ResolvedUncontrolledVideoReference extends UncontrolledVideoReference {
    reference: UncontrolledVideoConfig;
}

export interface ResolvedImageReference extends ImageReference {
    reference: ImageConfig;
}

// -------- BasePage body --------
/**
 * Describes the "secondary" content (usually text) describing or otherwise providing context for the primary media in
 * an StoryPageConfig.
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
type BodyContentResolvedImage = WithType & ResolvedImageReference;

type BodyContentVideo = WithType & UncontrolledVideoReference;
type BodyContentResolvedVideo = WithType & ResolvedUncontrolledVideoReference;

// ------- Type guards -----

export const contentIsText = (
    content: BodyContentText | BodyContentResolvedVideo | BodyContentResolvedImage
): content is BodyContentText => {
    return content.type === "text";
};

export const contentIsVideo = (
    content: BodyContentResolvedVideo | BodyContentResolvedImage
): content is BodyContentResolvedVideo => {
    return content.reference.type === "video";
};

export const mediaConfigIsVideo = (
    config: BaseVideoConfig | ImageConfig
): config is BaseVideoConfig => {
    return config.type === "video";
};

export const videoIsControlledVideo = (
    reference: ControlledVideoReference | UncontrolledVideoReference
): reference is ControlledVideoReference => {
    return reference.hasOwnProperty("marker");
};

export const mediaReferenceIsControlledVideo = (
    media: ResolvedControlledVideoReference | ResolvedImageReference | undefined
): media is ResolvedControlledVideoReference => {
    return media !== undefined && media.reference.type === "video";
};

export const pageConfigIsStoryPageConfig = (
    config: StoryPageConfig | InteractivePageConfig
): config is StoryPageConfig => {
    return config.hasOwnProperty("body") && !config.hasOwnProperty("componentId");
};
