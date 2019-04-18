import * as classNames from "classnames";
import * as React from "react";

import Page from "../../essay/entity/Page";

import VisibilityStatus, { Position, Status } from "../VisibilityStatus";
import Video from "../Video";

const styles = require("./style.css");

interface PrimaryMediaByPageGroupProps {
    activePage: Page;
    pageGroup: Page[];
}

/**
 * PrimaryMediaByPageGroup is a component for rendering media shared by a grouping of continous Pages. It is responsible
 * for positioning the media in and out of the viewport as necessary.
 */
export default class PrimaryMediaByPageGroup extends React.Component<
    PrimaryMediaByPageGroupProps,
    {}
> {
    private static STATUS_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [Status.EXITED]: styles.exited,
        [Status.EXITING_UP]: styles.exitingUp,
        [Status.ENTERED]: styles.entered,
        [Status.EXITING_DOWN]: styles.exitingDown,
        [Status.INITIAL]: styles.initial,
    };

    public render() {
        const { activePage } = this.props;

        const media = activePage.media;

        return (
            <VisibilityStatus
                key={this.getSharedMediaId()}
                position={this.getPosition()}
                timeout={2000}
                render={({ status }) => (
                    // TODO: support Image as primary media
                    <Video
                        active={status === Status.ENTERED}
                        className={classNames(
                            styles.base,
                            PrimaryMediaByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                        )}
                        // TODO shouldn't have to type cast - need to narrow type of media so that compiler knows its a video not an image
                        endTime={media.endTime as number}
                        loop={media.loop}
                        source={this.getSharedMediaSource()}
                        // TODO shouldn't have to type cast - need to narrow type of media so that compiler knows its a video not an image
                        startTime={media.startTime as number}
                    />
                )}
            />
        );
    }

    private getSharedMediaSource(): string[][] {
        const firstPageInGroup = this.props.pageGroup[0];
        // TODO shouldn't have to type cast - need to narrow type of media so that compiler knows its a video not an image
        return firstPageInGroup.media.reference.source as string[][];
    }

    private getSharedMediaId(): string {
        const firstPageInGroup = this.props.pageGroup[0];
        return firstPageInGroup.media.mediaId;
    }

    /**
     * 1. If active page is within this grouping of pages, this media should be positioned within the viewport.
     * 2. If the active page is before the first page in this grouping, this media should be below the viewport (i.e.,
     * haven't gotten there yet).
     * 3. If the active page is after the last page in this grouping, this media should be above the viewport (i.e.,
     * moved past it).
     */
    private getPosition(): Position {
        const { activePage, pageGroup } = this.props;

        const startPageIndexOfBin = pageGroup[0].sortOrder;
        const endPageIndexOfBin = pageGroup[pageGroup.length - 1].sortOrder;

        if (startPageIndexOfBin > activePage.sortOrder) {
            return Position.BELOW_VIEWPORT;
        } else if (endPageIndexOfBin < activePage.sortOrder) {
            return Position.ABOVE_VIEWPORT;
        } else {
            return Position.IN_VIEWPORT;
        }
    }
}
