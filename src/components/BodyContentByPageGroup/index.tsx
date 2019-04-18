import * as classNames from "classnames";
import * as React from "react";

import {
    BodyContentText,
    BodyContentResolvedImage,
    BodyContentResolvedVideo,
} from "../../essay/config";
import Page from "../../essay/entity/Page";

import Image from "../Image";
import Text from "../Text";
import UncontrolledVideo from "../UncontrolledVideo";
import VisibilityStatus, { Status } from "../VisibilityStatus";

const styles = require("./style.css");

interface BodyContentByPageGroupProps {
    activePage: Page;
    pageGroup: Page[];
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
        return this.props.pageGroup.map((page) => {
            return (
                <VisibilityStatus
                    key={page.id}
                    position={VisibilityStatus.getPositionRelativeTo(
                        page.sortOrder,
                        this.props.activePage.sortOrder
                    )}
                    timeout={0}
                    render={({ status }) => (
                        <article
                            className={classNames(
                                styles.content,
                                BodyContentByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                            )}
                        >
                            {page.body.content.map((content, idx) => {
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
