import * as React from "react";

import BodyContentByPageGroup from "./components/BodyContentByPageGroup";
import InteractiveByPageGroup from "./components/InteractiveByPageGroup";
import Header from "./components/Header";
import PrimaryMediaByPageGroup from "./components/PrimaryMediaByPageGroup";
import Section from "./essay/entity/Section";

import { Page, PageType } from "./essay/entity/BasePage";
import Essay from "./essay/entity/Essay";
import InteractivePage from "./essay/entity/InteractivePage";
import StoryPage from "./essay/entity/StoryPage";

interface AppProps {
    activePage: Page;
    essay: Essay;
    pages: Page[];
    sections: Section[];
}

export default class App extends React.Component<AppProps, {}> {
    private static concatenatePageIds(pages: Page[]): string {
        return pages.map((page) => page.id).join(":");
    }

    public render(): JSX.Element {
        const { activePage, essay, sections } = this.props;

        return (
            <>
                <Header
                    activePage={activePage}
                    onNavigation={essay.jumpTo.bind(essay)}
                    sections={sections}
                />
                {this.renderPrimaryMedia()}
                {this.renderBodyContent()}
                {this.renderInteractiveContent()}
            </>
        );
    }

    private renderPrimaryMedia(): JSX.Element[] {
        const { activePage, essay, pages } = this.props;

        const pagesBinnedByMedia = Essay.binPagesBy(pages, "media.mediaId");

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
                    activePage={activePage}
                    advanceOnePage={essay.advance.bind(essay)}
                    pageGroup={bin}
                />
            ));
    }

    private renderBodyContent(): JSX.Element[] {
        const { activePage, pages } = this.props;

        const pagesBinnedByLayout = Essay.binPagesBy<StoryPage>(pages, "layout", PageType.STORY);

        return pagesBinnedByLayout.map((bin: StoryPage[]) => (
            <BodyContentByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={activePage}
                pageGroup={bin}
            />
        ));
    }

    private renderInteractiveContent(): JSX.Element[] {
        const { activePage, essay, pages } = this.props;

        const pagesBinnedByInteractiveContent = Essay.binPagesBy<InteractivePage>(
            pages,
            "componentId",
            PageType.INTERACTIVE
        );

        return pagesBinnedByInteractiveContent.map((bin: InteractivePage[]) => (
            <InteractiveByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={activePage}
                essay={essay}
                pageGroup={bin}
            />
        ));
    }
}
