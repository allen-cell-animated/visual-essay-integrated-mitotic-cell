import * as classNames from "classnames";
import * as React from "react";

import { Page, PageType } from "../../essay/entity/BasePage";
import {
    BodyContentResolvedImage,
    BodyContentResolvedVideo,
    BodyContentText,
} from "../../essay/config";
import Essay from "../../essay/entity/Essay";
import StoryPage from "../../essay/entity/StoryPage";

import Image from "../Image";
import Text from "../Text";
import UncontrolledVideo from "../UncontrolledVideo";
import VisibilityStatus, { Status } from "../VisibilityStatus";

const styles = require("./style.css");

interface BodyContentByPageGroupProps {
    activePage: Page;
    pageGroup: StoryPage[];
}

function contentIsText(
    content: BodyContentText | BodyContentResolvedVideo | BodyContentResolvedImage
): content is BodyContentText {
    return content.type === "text";
}

function contentIsVideo(
    content: BodyContentResolvedVideo | BodyContentResolvedImage
): content is BodyContentResolvedVideo {
    return content.reference.type === "video";
}

/**
 * BodyContentByPageGroup renders the "mixed media" content (primarily text) belonging to a grouping of continous Pages.
 * Those pages are grouped by shared layout. This component is responsible for positioning the media in and out of the
 * viewport as necessary.
 */
export default class BodyContentByPageGroup extends React.Component<
    BodyContentByPageGroupProps,
    {}
> {
    private static STATUS_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [Status.EXITED]: styles.exited,
        [Status.INITIAL]: styles.initial,
    };

    private static LAYOUT_TO_CLASSNAME_MAP: { [index: string]: string } = {
        "two-column": styles.twoColumnLayout,
        "one-column": styles.oneColumnLayout,
    };

    public render(): JSX.Element {
        const { activePage, pageGroup } = this.props;

        const startPageIndex = pageGroup[0].sortOrder;
        const endPageIndex = pageGroup[pageGroup.length - 1].sortOrder;

        return (
            <VisibilityStatus
                position={VisibilityStatus.getRangePositionRelativeTo(
                    [startPageIndex, endPageIndex],
                    activePage.sortOrder
                )}
                render={({ status }) => {
                    const sectionClasses = classNames(
                        styles.section,
                        BodyContentByPageGroup.LAYOUT_TO_CLASSNAME_MAP[this.getSharedLayout()],
                        BodyContentByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                    );

                    return (
                        <section className={sectionClasses}>
                            <div className={styles.container}>{this.renderContent()}</div>
                        </section>
                    );
                }}
            />
        );
    }

    private renderContent() {
        const { activePage, pageGroup } = this.props;

        // further subdivide this grouping of pages by the identity of the pages content
        // this accomplishes deduplicating content
        const hashPageContent = (page: Page): string => {
            if (page.isStoryPage()) {
                const hashList = page.body.content.reduce((hashList: string[], content) => {
                    if (contentIsText(content)) {
                        return [...hashList, `${content.element}:${content.text}`];
                    } else {
                        return [...hashList, content.mediaId];
                    }
                }, []);

                return hashList.join("_");
            }

            return "";
        };

        const binnedByContentIdentity = Essay.binPagesBy<StoryPage>(
            pageGroup,
            hashPageContent,
            PageType.STORY
        );

        return binnedByContentIdentity.map((bin: StoryPage[]) => {
            const [firstInBin] = bin;

            const startPageIndex = firstInBin.sortOrder;
            const endPageIndex = bin[bin.length - 1].sortOrder;

            const compositeId = bin.map((page) => page.id).join(":");
            const content = firstInBin.body.content;

            return (
                <VisibilityStatus
                    key={compositeId}
                    position={VisibilityStatus.getRangePositionRelativeTo(
                        [startPageIndex, endPageIndex],
                        activePage.sortOrder
                    )}
                    timeout={0}
                    render={({ status }) => (
                        <article
                            className={classNames(
                                styles.content,
                                BodyContentByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                            )}
                        >
                            {content.map((content, idx) => {
                                if (contentIsText(content)) {
                                    return (
                                        <Text
                                            key={idx}
                                            element={content.element}
                                            innerText={content.text}
                                        />
                                    );
                                } else if (contentIsVideo(content)) {
                                    return (
                                        <UncontrolledVideo
                                            key={idx}
                                            className={styles.inlineVideo}
                                            controls={true}
                                            loop={content.loop}
                                            source={content.reference.source}
                                        />
                                    );
                                } else {
                                    return (
                                        <Image
                                            key={idx}
                                            className={styles.inlineImage}
                                            source={content.reference.source}
                                        />
                                    );
                                }
                            })}
                        </article>
                    )}
                />
            );
        });
    }

    private getSharedLayout(): string {
        const firstPageInGroup = this.props.pageGroup[0];
        return firstPageInGroup.layout;
    }
}
