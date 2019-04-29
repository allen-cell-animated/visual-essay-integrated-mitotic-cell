import * as classNames from "classnames";
import * as React from "react";

import { Page, PageType } from "../../essay/entity/BasePage";
import { contentIsText, contentIsVideo } from "../../essay/config";
import Essay from "../../essay/entity/Essay";
import StoryPage from "../../essay/entity/StoryPage";

import Image from "../Image";
import Text from "../Text";
import UncontrolledVideo from "../UncontrolledVideo";
import VisibilityStatus, { Status } from "../VisibilityStatus";
import { Position } from "../VisibilityStatus/VisibilityStateMachine";

const styles = require("./style.css");

interface BodyContentByPageGroupProps {
    activePage: Page;
    pageGroup: StoryPage[];
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
        [Status.EXITING_UP]: styles.exitingUp,
        [Status.ENTERING_DOWN]: styles.enteringDown,
        [Status.ENTERED]: styles.entered,
        [Status.ENTERING_UP]: styles.enteringUp,
        [Status.EXITING_DOWN]: styles.exitingDown,
        [Status.INITIAL]: styles.initial,
    };

    private static TRANSITION_TO_CLASSNAME_MAP: { [index: string]: string } = {
        fade: styles.fade,
        push: styles.push,
        stack: styles.stack,
    };

    private static LAYOUT_TO_CLASSNAME_MAP: { [index: string]: string } = {
        "two-column": styles.twoColumnLayout,
        "one-column": styles.oneColumnLayout,
    };

    private static getContentHash(page: Page): string {
        return page.contentHash;
    }

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

                    const containerClasses = classNames(styles.container);

                    return (
                        <section className={sectionClasses}>
                            <div className={containerClasses}>
                                {this.renderContent()}
                                <div className={styles.gradientTop} />
                                <div className={styles.gradientBottom} />
                            </div>
                        </section>
                    );
                }}
            />
        );
    }

    private renderContent() {
        const { activePage, pageGroup } = this.props;

        // Further subdivide this grouping of pages by the identity of the pages' contents.
        // This accomplishes de-duplicating content so that if the only thing that changes between continuous pages
        // is their media reference/marker, scrolling will not transition between content that is exactly the same.
        const binnedByContentIdentity = Essay.binPagesBy<StoryPage>(
            pageGroup,
            BodyContentByPageGroup.getContentHash,
            PageType.STORY
        );

        return binnedByContentIdentity.map((bin: StoryPage[], binIndex: number) => {
            // helpers
            const hasNextSibling = () => {
                return binIndex < binnedByContentIdentity.length - 1;
            };

            const hasPrevSibling = () => {
                return binIndex > 0;
            };

            const [firstInBin] = bin;

            const startPageIndex = firstInBin.sortOrder;
            const endPageIndex = bin[bin.length - 1].sortOrder;
            const binPosition = VisibilityStatus.getRangePositionRelativeTo(
                [startPageIndex, endPageIndex],
                activePage.sortOrder
            );

            const compositeId = bin.map((page) => page.id).join(":");
            const content = firstInBin.body.content;
            const transition =
                BodyContentByPageGroup.TRANSITION_TO_CLASSNAME_MAP[
                    firstInBin.body.transition || "push"
                ];

            return (
                <VisibilityStatus
                    key={compositeId}
                    position={binPosition}
                    timeout={0}
                    render={({ status }) => {
                        let transitionClasses: string[] = [];

                        if (hasNextSibling()) {
                            const nextBin = binnedByContentIdentity[binIndex + 1];
                            const firstPageInNextBin = nextBin[0];
                            const lastPageInNextBin = nextBin[nextBin.length - 1];

                            const nextBinPosition = VisibilityStatus.getRangePositionRelativeTo(
                                [firstPageInNextBin.sortOrder, lastPageInNextBin.sortOrder],
                                activePage.sortOrder
                            );

                            // if this bin is exiting up or already exited, apply transition specified by its next sibling
                            if (status === Status.EXITING_UP || status === Status.EXITED) {
                                const siblingTransition =
                                    firstPageInNextBin.body.transition || "push";
                                const exitingClass =
                                    BodyContentByPageGroup.TRANSITION_TO_CLASSNAME_MAP[
                                        siblingTransition
                                    ];
                                transitionClasses.push(exitingClass);
                            }

                            if (nextBinPosition === Position.IN_VIEWPORT) {
                                transitionClasses.push(styles.nextSiblingInView);
                            }
                        }

                        if (hasPrevSibling()) {
                            const prevBin = binnedByContentIdentity[binIndex - 1];
                            const firstPageInPrevBin = prevBin[0];
                            const lastPageInPrevBin = prevBin[prevBin.length - 1];

                            const prevBinPosition = VisibilityStatus.getRangePositionRelativeTo(
                                [firstPageInPrevBin.sortOrder, lastPageInPrevBin.sortOrder],
                                activePage.sortOrder
                            );

                            if (prevBinPosition === Position.IN_VIEWPORT) {
                                transitionClasses.push(styles.prevSiblingInView);
                            }
                        }

                        if (
                            !hasNextSibling() ||
                            (status !== Status.EXITING_UP && status !== Status.EXITED)
                        ) {
                            transitionClasses.push(transition);
                        }

                        return (
                            <article
                                className={classNames(
                                    styles.content,
                                    BodyContentByPageGroup.STATUS_TO_CLASSNAME_MAP[status],
                                    transitionClasses
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
                        );
                    }}
                />
            );
        });
    }

    private getSharedLayout(): string {
        const firstPageInGroup = this.props.pageGroup[0];
        return firstPageInGroup.layout;
    }
}
