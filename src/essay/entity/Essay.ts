import { find, get as _get, sortBy } from "lodash";
import * as memoize from "memoizee";

import { InteractivePageProps } from "../../components/InteractiveByPageGroup";
import Splash from "../../components/Splash";
import ThreeDCellViewer from "../../components/ThreeDCellViewer";
import ZStackCellViewer from "../../components/ZStackCellViewer";

import {
    EssayMedia,
    EssaySection,
    InteractivePageConfig,
    InteractivePageWithResolvedComponent,
    mediaConfigIsVideo,
    mediaReferenceIsVideo,
    pageConfigIsStoryPageConfig,
    StoryPageConfig,
    StoryPageWithResolvedMedia,
} from "../config";

import { Page, PageType } from "./BasePage";
import Chapter from "./Chapter";
import InteractivePage from "./InteractivePage";
import Section from "./Section";
import StoryPage from "./StoryPage";

type SubscriberCallback = () => void;

/**
 * Essay is the primary interface for interacting with and knowing about the configuration of the essay as a whole, as
 * as well as for keeping track of the current state of the essay (e.g., which page the user is viewing).
 */
export default class Essay {
    /**
     * Create bins of _continuous_ (defined by their sort order) pages that share the same property value.
     *
     * For example, if we had an ordered list of resolved Page properties that looked like [1,1,2,2,2,1,1,1,1,2,2]
     * this function should return: [[1,1], [2,2,2], [1,1,1,1], [2,2]].
     *
     * The property getter is used to determine the value the pages are binned by. It can either be a string, in which
     * case it is assumed to be a property (direct or nested) of Page, or it can be a function, in which case it is
     * passed each individual page in turn and is expected to return a value.
     *
     * This method is memoized (see below class declaration).
     */
    public static binPagesBy<T extends Page>(
        pages: Page[],
        getter: (page: Page) => any,
        type: PageType
    ): T[][];
    public static binPagesBy<T extends Page>(pages: Page[], getter: (page: Page) => any): T[][];
    public static binPagesBy<T extends Page>(pages: Page[], getter: string, type: PageType): T[][];
    public static binPagesBy<T extends Page>(pages: Page[], getter: string): T[][];
    public static binPagesBy<T extends Page>(
        pages: Page[],
        getter: string | ((page: Page) => any),
        type?: PageType
    ): T[][] {
        let _getter: (page: Page) => any;

        if (typeof getter === "string") {
            _getter = (page: Page) => _get(page, getter);
        } else {
            _getter = getter;
        }

        const bins: any = [];

        let currentBin: any = [];
        let binSharedValue: any;

        sortBy(pages, "sortOrder")
            .filter((page) => {
                const hasValue = _getter(page) !== undefined;

                if (type) {
                    return page.type === type && hasValue;
                }

                return hasValue;
            })
            .forEach((page) => {
                const val = _getter(page);

                // seed binSharedValue
                if (binSharedValue === undefined) {
                    binSharedValue = val;
                }

                if (val === binSharedValue) {
                    currentBin.push(page);
                } else {
                    // we've reached the end of a continuous run of pages that all share the same value
                    // add bin to retval, and start new bin
                    bins.push(currentBin);
                    binSharedValue = val;
                    currentBin = [page];
                }
            });

        // finally append last bin to retval
        bins.push(currentBin);

        return bins;
    }

    private static COMPONENT_ID_TO_REFERENCE_MAP: {
        [index: string]: React.ComponentClass<InteractivePageProps>;
    } = {
        Splash: Splash,
        ThreeDCellViewer: ThreeDCellViewer,
        ZStackCellViewer: ZStackCellViewer,
    };

    private _activePageIndex: number = 0;
    private _config: EssaySection[];
    private _media: EssayMedia;
    private _pages: Page[] = [];
    private _chapters: Chapter[] = [];
    private _sections: Section[] = [];
    private _subscribers: SubscriberCallback[] = [];

    public constructor(config: EssaySection[], media: EssayMedia) {
        this._config = config;
        this._media = media;

        this.mapConfigToEntities();
    }

    public get activePage(): Page {
        return this._pages[this._activePageIndex];
    }

    public get chapters(): Chapter[] {
        return this._chapters;
    }

    public get pages(): Page[] {
        return this._pages;
    }

    public get sections(): Section[] {
        return this._sections;
    }

    /**
     * Advance active page to the next page in the essay.
     */
    public advance(): void {
        if (this._activePageIndex < this._pages.length - 1) {
            this._activePageIndex += 1;
            this.notifySubscribersOfChange();
        }
    }

    public findChapterById(id: string): Chapter | undefined {
        return find(this._chapters, (chapter: Chapter) => {
            // a Chapter::id is a concatenation of section_id and chapter_id separated by a colon
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, chapterId] = chapter.id.split(":");
            return chapterId === id;
        });
    }

    /**
     * Return active page to the closest previous page that is not configured to "autoscroll".
     */
    public reverse(): void {
        if (this._activePageIndex > 0) {
            this._activePageIndex -= 1;

            const previousSibling = this._pages[this._activePageIndex];
            if (
                mediaReferenceIsVideo(previousSibling.media) &&
                previousSibling.media.advanceOnExit
            ) {
                // recursively reverse until we hit a previous page that is not configured to autoscroll
                this.reverse();
                return;
            }

            this.notifySubscribersOfChange();
        }
    }

    /**
     * Set active page to the provided page.
     */
    public jumpTo(page: Page): void {
        this._activePageIndex = page.sortOrder;

        this.notifySubscribersOfChange();
    }

    /**
     * Add callback to list of callback to be called whenever the active page is changed.
     *
     * Return value is a function that can be called to remove the callback from the list of subscribers.
     */
    public subscribe(callback: SubscriberCallback): () => void {
        this._subscribers.push(callback);

        const unsubscribe = () => {
            this._subscribers = this._subscribers.filter((cb) => cb !== callback);
        };

        return unsubscribe;
    }

    private notifySubscribersOfChange() {
        this._subscribers.forEach((cb) => cb());
    }

    /**
     * Transform JSON configuration of essay into code entities.
     * ! SIDE-EFFECT !: Builds up flat list of pages, and appends them to `this._pages`.
     */
    private mapConfigToEntities() {
        // keep track of the global sort order of the pages within the entire essay
        let globalPageIndex = 0;

        this._config.forEach((sectionConfig) => {
            const section = new Section(sectionConfig);
            this._sections.push(section);

            sectionConfig.chapters.forEach((chapterConfig) => {
                const chapter = new Chapter(chapterConfig, section);
                section.addChapter(chapter);
                this._chapters.push(chapter);

                chapterConfig.pages.forEach((pageConfig) => {
                    // assign global sort order of this page, and after assignment, increment tracking var by 1
                    const sortOrder = globalPageIndex++;
                    let page;

                    if (pageConfigIsStoryPageConfig(pageConfig)) {
                        page = new StoryPage(
                            this.denormalizeStoryPageConfig(pageConfig),
                            chapter,
                            sortOrder
                        );
                    } else {
                        page = new InteractivePage(
                            this.denormalizeInteractivePageConfig(pageConfig),
                            chapter,
                            sortOrder
                        );
                    }

                    chapter.addPage(page);

                    this._pages.push(page);
                });
            });
        });
    }

    private denormalizeInteractivePageConfig(
        page: InteractivePageConfig
    ): InteractivePageWithResolvedComponent {
        const denormalized = {
            ...page,
            component: Essay.COMPONENT_ID_TO_REFERENCE_MAP[page.componentId],
            media: this.enrichWithMediaConfig(page.media),
        };

        return denormalized;
    }

    /**
     * Denormalize references to media (`mediaId`) by enriching with full reference to media's configuration.
     * If the media is a video, further denormalize by enriching with marker's startTime and endTime.
     */
    private denormalizeStoryPageConfig(page: StoryPageConfig): StoryPageWithResolvedMedia {
        return {
            ...page,
            body: {
                ...page.body,
                content: page.body.content.map((content) => {
                    if (content.type === "media") {
                        return this.enrichWithMediaConfig(content);
                    }

                    return content;
                }),
            },
            media: this.enrichWithMediaConfig(page.media),
        };
    }

    private enrichWithMediaConfig(obj: any) {
        if (!obj) {
            return {};
        }

        const mediaConfig = this._media[obj.mediaId];

        let enriched = {
            ...obj,
            reference: mediaConfig,
        };

        if (mediaConfigIsVideo(mediaConfig)) {
            const marker = (mediaConfig.markers || {})[obj.marker];

            if (!marker) {
                throw new Error(`Failed to resolve marker ${obj.marker} on video ${obj.mediaId}`);
            }

            if (obj.loop && obj.advanceOnExit) {
                throw new Error(
                    "A video segment cannot both loop and advanceOnExit -- that makes no sense."
                );
            }

            enriched = {
                ...enriched,
                endTime: marker.endTime,
                loop: obj.loop,
                startTime: marker.startTime,
            };
        }

        return enriched;
    }
}

// Memoize binPagesBy by the identity of its arguments.
// If this is ever removed, update method's docstring.
Essay.binPagesBy = memoize(Essay.binPagesBy);
