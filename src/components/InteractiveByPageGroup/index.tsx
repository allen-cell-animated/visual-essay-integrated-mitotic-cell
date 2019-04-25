import * as classNames from "classnames";
import * as React from "react";

import { Page } from "../../essay/entity/BasePage";
import InteractivePage, { InteractivePageProps } from "../../essay/entity/InteractivePage";
import VisibilityStatus, { Status } from "../VisibilityStatus";

const styles = require("./style.css");

interface InteractiveByPageGroupProps {
    activePage: Page;
    pageGroup: InteractivePage[];
}

export default class InteractiveByPageGroup extends React.Component<
    InteractiveByPageGroupProps,
    {}
> {
    private static STATUS_TO_CLASSNAME_MAP: { [index: string]: string } = {
        [Status.EXITED]: styles.exited,
        [Status.INITIAL]: styles.initial,
    };

    public render(): JSX.Element {
        const { activePage, pageGroup } = this.props;

        const startPageIndex = pageGroup[0].sortOrder;
        const endPageIndex = pageGroup[pageGroup.length - 1].sortOrder;
        const position = VisibilityStatus.getRangePositionRelativeTo(
            [startPageIndex, endPageIndex],
            activePage.sortOrder
        );
        return (
            <VisibilityStatus
                position={position}
                render={({ status }) => {
                    const sectionClasses = classNames(
                        styles.section,
                        InteractiveByPageGroup.STATUS_TO_CLASSNAME_MAP[status]
                    );

                    return (
                        <section className={sectionClasses}>
                            {React.createElement(this.getSharedComponentReference(), { position })}
                        </section>
                    );
                }}
            />
        );
    }

    private getSharedComponentReference(): React.ComponentClass<InteractivePageProps> {
        const firstPageInGroup = this.props.pageGroup[0];
        return firstPageInGroup.component;
    }
}
