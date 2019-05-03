import * as classNames from "classnames";
import * as React from "react";

import { ResolvedControlledVideoReference } from "../../essay/config";
import { Page } from "../../essay/entity/BasePage";

import VisibilityStatus, { Status } from "../VisibilityStatus";
import ControlledVideo from "../ControlledVideo";

const styles = require("./style.css");

interface PrimaryMediaByPageGroupProps {
    activePage: Page;
    advanceOnePage: () => void;
    pageGroup: Page[];
}

interface PrimaryMediaByPageGroupState {
    activePageInGroup: Page;
}

/**
 * PrimaryMediaByPageGroup is a component for rendering media shared by a grouping of continous Pages. It is responsible
 * for positioning the media in and out of the viewport as necessary.
 */
export default class PrimaryMediaByPageGroup extends React.Component<
    PrimaryMediaByPageGroupProps,
    PrimaryMediaByPageGroupState
> {
    /**
     * While this is typically an anti-pattern, need to prevent telling the `ControlledVideo` component about any active
     * page that is not within this group.
     */
    public static getDerivedStateFromProps(props: PrimaryMediaByPageGroupProps) {
        const { activePage, pageGroup } = props;

        const startPageIndex = pageGroup[0].sortOrder;
        const endPageIndex = pageGroup[pageGroup.length - 1].sortOrder;
        const activePageIndex = activePage.sortOrder;

        if (activePageIndex >= startPageIndex && activePageIndex <= endPageIndex) {
            return {
                activePageInGroup: activePage,
            };
        }

        return null;
    }

    private static STATUS_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [Status.EXITED]: styles.exited,
        [Status.EXITING_UP]: styles.exitingUp,
        [Status.ENTERED]: styles.entered,
        [Status.EXITING_DOWN]: styles.exitingDown,
        [Status.INITIAL]: styles.initial,
    };

    public state: PrimaryMediaByPageGroupState;

    constructor(props: PrimaryMediaByPageGroupProps) {
        super(props);

        this.state = {
            activePageInGroup: props.pageGroup[0],
        };

        this.onVideoSegmentEnd = this.onVideoSegmentEnd.bind(this);
    }

    public render() {
        const { activePage, pageGroup } = this.props;
        const { activePageInGroup } = this.state;

        // TODO: support Image as primary media
        const media = activePageInGroup.media as ResolvedControlledVideoReference;

        const startPageIndex = pageGroup[0].sortOrder;
        const endPageIndex = pageGroup[pageGroup.length - 1].sortOrder;

        return (
            <VisibilityStatus
                position={VisibilityStatus.getRangePositionRelativeTo(
                    [startPageIndex, endPageIndex],
                    activePage.sortOrder
                )}
                timeout={2000}
                render={({ status }) => (
                    <ControlledVideo
                        active={status === Status.ENTERED}
                        className={classNames(
                            styles.base,
                            PrimaryMediaByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                        )}
                        endTime={media.endTime}
                        loop={media.loop}
                        onEnd={this.onVideoSegmentEnd}
                        source={this.getSharedMediaSource()}
                        startTime={media.startTime}
                    />
                )}
            />
        );
    }

    private onVideoSegmentEnd() {
        const { advanceOnePage } = this.props;
        const { activePageInGroup } = this.state;

        const media = activePageInGroup.media as ResolvedControlledVideoReference;

        if (media.advanceOnExit) {
            advanceOnePage();
        }
    }

    private getSharedMediaSource(): string[][] {
        const firstPageInGroup = this.props.pageGroup[0];

        if (!firstPageInGroup.media) {
            throw new Error(
                `Page (index: ${
                    firstPageInGroup.sortOrder
                }) without media configuration placed in PrimaryMediaByPageGroup`
            );
        }

        // TODO shouldn't have to type cast - need to narrow type of media so that compiler knows its a video not an image
        return firstPageInGroup.media.reference.source as string[][];
    }
}
