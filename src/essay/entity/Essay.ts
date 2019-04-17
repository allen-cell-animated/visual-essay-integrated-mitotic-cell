import { get as _get, sortBy } from "lodash";

import Chapter from "./Chapter";
import Page from "./Page";
import Section from "./Section";

import {
    EssayMedia,
    EssayPage,
    EssayPageWithResolvedMedia,
    EssaySection,
    ImageConfig,
    VideoConfig,
} from "../config";

function mediaIsVideo(
    config: VideoConfig | ImageConfig
): config is VideoConfig {
    return config.type === "video";
}

/**
 * Essay is the primary interface for interacting with and knowing about the configuration of the essay as a whole, as
 * as well as for keeping track of the current state of the essay (e.g., which page the user is viewing).
 */
export default class Essay {
    private _activePageIndex: number = 0;
    private _config: EssaySection[];
    private _media: EssayMedia;
    private _pages: Page[] = [];

    public constructor(config: EssaySection[], media: EssayMedia) {
        this._config = config;
        this._media = media;

        this.mapConfigToEntities();
    }

    public get activePage(): Page {
        return this._pages[this._activePageIndex];
    }

    public get pages(): Page[] {
        return this._pages;
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

    public pagesBinnedByLayout(): Page[][] {
        return this.binPagesBy("layout");
    }

    public pagesBinnedByMedia(): Page[][] {
        return this.binPagesBy("media.mediaId");
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

            sectionConfig.chapters.forEach((chapterConfig) => {
                const chapter = new Chapter(chapterConfig, section);
                section.addChapter(chapter);

                chapterConfig.pages.forEach((pageConfig) => {
                    // assign global sort order of this page, and after assignment, increment tracking var by 1
                    const sortOrder = globalPageIndex++;
                    const page = new Page(
                        this.denormalizeMediaReferences(pageConfig),
                        chapter,
                        sortOrder
                    );
                    chapter.addPage(page);

                    this._pages.push(page);
                });
            });
        });
    }

    /**
     * Denormalize references to media (`mediaId`) by enriching with full reference to media's configuration.
     * If the media is a video, further denormalize by enriching with marker's startTime and endTime.
     */
    private denormalizeMediaReferences(
        page: EssayPage
    ): EssayPageWithResolvedMedia {
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
            const marker = mediaConfig.markers[obj.marker];
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
    private binPagesBy(getter: string): Page[][] {
        const bins: Page[][] = [];

        let currentBin: Page[] = [];
        let binSharedValue = _get(this._pages[0], getter);

        sortBy(this._pages, "sortOrder").forEach((page) => {
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
        });

        // finally append last bin to retval
        bins.push(currentBin);

        return bins;
    }
}
