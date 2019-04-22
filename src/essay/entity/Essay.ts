import { find, get as _get, sortBy } from "lodash";

import ThreeDCellViewer from "../../components/ThreeDCellViewer";

import {
    EssayMedia,
    EssaySection,
    ImageConfig,
    InteractivePageConfig,
    InteractivePageWithResolvedComponent,
    StoryPageConfig,
    StoryPageWithResolvedMedia,
    VideoConfig,
} from "../config";

import { Page, PageType } from "./BasePage";
import Chapter from "./Chapter";
import InteractivePage from "./InteractivePage";
import Section from "./Section";
import StoryPage from "./StoryPage";

function mediaIsVideo(config: VideoConfig | ImageConfig): config is VideoConfig {
    return config.type === "video";
}

function configIsStoryPageConfig(
    config: StoryPageConfig | InteractivePageConfig
): config is StoryPageConfig {
    return config.hasOwnProperty("media") && config.hasOwnProperty("body");
}

/**
 * Essay is the primary interface for interacting with and knowing about the configuration of the essay as a whole, as
 * as well as for keeping track of the current state of the essay (e.g., which page the user is viewing).
 */
export default class Essay {
    private static COMPONENT_ID_TO_REFERENCE_MAP: { [index: string]: React.ComponentClass } = {
        ThreeDCellViewer: ThreeDCellViewer,
    };

    private _activePageIndex: number = 0;
    private _config: EssaySection[];
    private _media: EssayMedia;
    private _pages: Page[] = [];
    private _chapters: Chapter[] = [];
    private _sections: Section[] = [];

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
        }
    }

    /**
     * Return active page to the previous page in the essay.
     */
    public goBack(): void {
        if (this._activePageIndex > 0) {
            this._activePageIndex -= 1;
        }
    }

    /**
     * Set active page to the provided page.
     */
    public jumpTo(page: Page): void {
        this._activePageIndex = page.sortOrder;
    }

    public pagesBinnedByLayout(): StoryPage[][] {
        return this.binPagesBy("layout", PageType.STORY);
    }

    public pagesBinnedByMedia(): StoryPage[][] {
        return this.binPagesBy("media.mediaId", PageType.STORY);
    }

    public pagesBinnedByInteractive(): InteractivePage[][] {
        return this.binPagesBy("componentId", PageType.INTERACTIVE);
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

                    if (configIsStoryPageConfig(pageConfig)) {
                        page = new StoryPage(
                            this.denormalizeMediaReferences(pageConfig),
                            chapter,
                            sortOrder
                        );
                    } else {
                        page = new InteractivePage(
                            this.denormalizeComponentReference(pageConfig),
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

    private denormalizeComponentReference(
        page: InteractivePageConfig
    ): InteractivePageWithResolvedComponent {
        return {
            ...page,
            component: Essay.COMPONENT_ID_TO_REFERENCE_MAP[page.componentId],
        };
    }

    /**
     * Denormalize references to media (`mediaId`) by enriching with full reference to media's configuration.
     * If the media is a video, further denormalize by enriching with marker's startTime and endTime.
     */
    private denormalizeMediaReferences(page: StoryPageConfig): StoryPageWithResolvedMedia {
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
        const mediaConfig = this._media[obj.mediaId];

        let enriched = {
            ...obj,
            reference: mediaConfig,
        };

        if (mediaIsVideo(mediaConfig)) {
            const marker = (mediaConfig.markers || {})[obj.marker];

            if (!marker) {
                throw new Error(`Failed to resolve marker ${obj.marker} on video ${obj.mediaId}`);
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

    /**
     * Create bins of _continuous_ (defined by their sort order) pages that share the same property value.
     *
     * For example, if we had an ordered list of resolved Page properties that looked like [1,1,2,2,2,1,1,1,1,2,2]
     * this function should return: [[1,1], [2,2,2], [1,1,1,1], [2,2]].
     *
     * @param getter - A property getter on a Page. Passed directly to lodash::get.
     */
    private binPagesBy(getter: string, type: PageType) {
        const bins: any = [];

        let currentBin: any = [];
        const firstPageWithValueForGetter = find(
            this._pages,
            (page: Page) => _get(page, getter) !== undefined
        );
        let binSharedValue = _get(firstPageWithValueForGetter, getter);

        sortBy(this._pages, "sortOrder").forEach((page) => {
            if (page.type === type) {
                const val = _get(page, getter);

                if (val === binSharedValue) {
                    currentBin.push(page);
                } else {
                    // we've reached the end of a continuous run of pages that all share the same value
                    // add bin to retval, and start new bin
                    bins.push(currentBin);
                    binSharedValue = val;
                    currentBin = [page];
                }
            }
        });

        // finally append last bin to retval
        bins.push(currentBin);

        return bins;
    }
}
