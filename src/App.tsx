import * as React from "react";

import AllenCellHeader from "./components/AllenCellHeader";
import BodyContentByPageGroup from "./components/BodyContentByPageGroup";
import IMSCHeader from "./components/IMSCHeader";
import InteractiveByPageGroup from "./components/InteractiveByPageGroup";
import PrimaryMediaByPageGroup from "./components/PrimaryMediaByPageGroup";

import { Page, PageType } from "./essay/entity/BasePage";
import Essay from "./essay/entity/Essay";
import InteractivePage from "./essay/entity/InteractivePage";
import StoryPage from "./essay/entity/StoryPage";

const styles = require("./styles/global.css");
import "./styles/structure-colors.css";

interface AppProps {
    essay: Essay;
}

export default class App extends React.Component<AppProps, {}> {
    private static concatenatePageIds(pages: Page[]): string {
        return pages.map((page) => page.id).join(":");
    }

    public render(): JSX.Element {
        const { essay } = this.props;

        return (
            <div className={styles.wrapper}>
                <AllenCellHeader essay={essay} />
                <IMSCHeader essay={essay} />
                {this.renderPrimaryMedia()}
                {this.renderBodyContent()}
                {this.renderInteractiveContent()}
            </div>
        );
    }

    private renderPrimaryMedia(): JSX.Element[] {
        const { essay } = this.props;

        const pagesBinnedByMedia = Essay.binPagesBy(essay.pages, "media.mediaId");

        return pagesBinnedByMedia
            .filter((bin: Page[]) => {
                const [firstPageInBin] = bin;

                if (firstPageInBin.media === undefined) {
                    return false;
                }

                // Currently do not support anything other than video as primary media
                const mediaReferenceSharedInBin = firstPageInBin.media.reference;
                const isVideo = mediaReferenceSharedInBin.type === "video";

                // If isVideo, return true
                // Else, log the attempt to render something other than video as primary media and return false
                // (exotic comma operator in action)
                const errMsg = "Attempted to return something other than video as primary media";
                return isVideo || (console.log(errMsg, mediaReferenceSharedInBin), false);
            })
            .map((bin: Page[]) => (
                <PrimaryMediaByPageGroup
                    key={App.concatenatePageIds(bin)}
                    activePage={essay.activePage}
                    advanceOnePage={essay.advance.bind(essay)}
                    pageGroup={bin}
                />
            ));
    }

    private renderBodyContent(): JSX.Element[] {
        const { essay } = this.props;

        const pagesBinnedByLayout = Essay.binPagesBy<StoryPage>(
            essay.pages,
            "layout",
            PageType.STORY
        );

        return pagesBinnedByLayout.map((bin: StoryPage[]) => (
            <BodyContentByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={essay.activePage}
                pageGroup={bin}
            />
        ));
    }

    private renderInteractiveContent(): JSX.Element[] {
        const { essay } = this.props;

        const pagesBinnedByInteractiveContent = Essay.binPagesBy<InteractivePage>(
            essay.pages,
            "componentId",
            PageType.INTERACTIVE
        );

        return pagesBinnedByInteractiveContent.map((bin: InteractivePage[]) => (
            <InteractiveByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={essay.activePage}
                essay={essay}
                pageGroup={bin}
            />
        ));
    }
}
