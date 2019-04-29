import * as classNames from "classnames";
import { get as _get, PropertyPath } from "lodash";
import * as React from "react";

import { Page, PageType } from "../../essay/entity/BasePage";
import { contentIsText, contentIsVideo, PageBodyWithResolvedMedia } from "../../essay/config";
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

    private static getSharedProperty(
        bin: StoryPage[],
        property: keyof StoryPage,
        notFoundValue: any = undefined
    ) {
        const firstPageInGroup = bin[0];
        return _get(firstPageInGroup, property, notFoundValue);
    }

    public render(): JSX.Element {
        const { pageGroup } = this.props;

        const layout = BodyContentByPageGroup.getSharedProperty(pageGroup, "layout");

        return (
            <VisibilityStatus
                position={this.getBinPosition(pageGroup)}
                render={({ status }) => {
                    const sectionClasses = classNames(
                        styles.section,
                        BodyContentByPageGroup.LAYOUT_TO_CLASSNAME_MAP[layout],
                        BodyContentByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                    );

                    return (
                        <section className={sectionClasses}>
                            <div className={styles.container}>
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
        const { pageGroup } = this.props;

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

            // binId is a composition of the ids of the pages within it
            const binId = bin.map((page) => page.id).join(":");

            const body:
                | PageBodyWithResolvedMedia
                | undefined = BodyContentByPageGroup.getSharedProperty(bin, "body");

            if (!body) {
                throw new Error(
                    `Malformed story configuration: nothing to render for bin of StoryPages with id: ${binId}`
                );
            }

            return (
                <VisibilityStatus
                    key={binId}
                    position={this.getBinPosition(bin)}
                    timeout={0}
                    render={({ status }) => {
                        let transitionClasses: string[] = [];

                        if (hasNextSibling()) {
                            const nextBin = binnedByContentIdentity[binIndex + 1];

                            // exit behavior is specified by how next sibling enters
                            if (status === Status.EXITING_UP || status === Status.EXITED) {
                                const siblingBody:
                                    | PageBodyWithResolvedMedia
                                    | undefined = BodyContentByPageGroup.getSharedProperty(
                                    nextBin,
                                    "body"
                                );

                                if (!siblingBody) {
                                    const siblingBinId = nextBin.map((page) => page.id).join(":");
                                    throw new Error(
                                        `Malformed story configuration: nothing to render for bin of StoryPages with id: ${siblingBinId}`
                                    );
                                }

                                const exitingClass =
                                    BodyContentByPageGroup.TRANSITION_TO_CLASSNAME_MAP[
                                        siblingBody.transition || "push"
                                    ];
                                transitionClasses.push(exitingClass);
                            }

                            if (this.getBinPosition(nextBin) === Position.IN_VIEWPORT) {
                                transitionClasses.push(styles.nextSiblingInView);
                            }
                        }

                        if (hasPrevSibling()) {
                            const prevBin = binnedByContentIdentity[binIndex - 1];

                            if (this.getBinPosition(prevBin) === Position.IN_VIEWPORT) {
                                transitionClasses.push(styles.prevSiblingInView);
                            }
                        }

                        // use own transition if either
                        //      a. bin does not have a next sibling to tell it what to do as it exists
                        //      b. bin is not exiting out of view or exited
                        if (
                            !hasNextSibling() ||
                            (status !== Status.EXITING_UP && status !== Status.EXITED)
                        ) {
                            const transition =
                                BodyContentByPageGroup.TRANSITION_TO_CLASSNAME_MAP[
                                    body.transition || "push"
                                ];
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
                                {body.content.map((item, idx) => {
                                    if (contentIsText(item)) {
                                        return (
                                            <Text
                                                key={idx}
                                                element={item.element}
                                                innerText={item.text}
                                            />
                                        );
                                    } else if (contentIsVideo(item)) {
                                        return (
                                            <UncontrolledVideo
                                                key={idx}
                                                className={styles.inlineVideo}
                                                controls={true}
                                                loop={item.loop}
                                                source={item.reference.source}
                                            />
                                        );
                                    } else {
                                        return (
                                            <Image
                                                key={idx}
                                                className={styles.inlineImage}
                                                source={item.reference.source}
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

    private getBinPosition(bin: StoryPage[]): Position {
        const { activePage } = this.props;

        const firstPageInBin = bin[0];
        const lastPageInBin = bin[bin.length - 1];

        return VisibilityStatus.getRangePositionRelativeTo(
            [firstPageInBin.sortOrder, lastPageInBin.sortOrder],
            activePage.sortOrder
        );
    }
}
