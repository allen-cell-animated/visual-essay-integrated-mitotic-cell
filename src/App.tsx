import * as React from "react";

import BodyContentByPageGroup from "./components/BodyContentByPageGroup";
import InteractiveByPageGroup from "./components/InteractiveByPageGroup";
import Header from "./components/Header";
import PrimaryMediaByPageGroup from "./components/PrimaryMediaByPageGroup";
import Section from "./essay/entity/Section";

import { Page } from "./essay/entity/BasePage";
import InteractivePage from "./essay/entity/InteractivePage";
import StoryPage from "./essay/entity/StoryPage";

interface AppProps {
    activePage: Page;
    pagesBinnedByInteractive: InteractivePage[][];
    pagesBinnedByLayout: StoryPage[][];
    pagesBinnedByMedia: StoryPage[][];
    onNavigation: (page: Page) => void;
    sections: Section[];
}

export default class App extends React.Component<AppProps, {}> {
    private static concatenatePageIds(pages: Page[]): string {
        return pages.map((page) => page.id).join(":");
    }

    public render(): JSX.Element {
        return (
            <>
                <Header
                    activePage={this.props.activePage}
                    onNavigation={this.props.onNavigation}
                    sections={this.props.sections}
                />
                {this.renderPrimaryMedia()}
                {this.renderBodyContent()}
                {this.renderInteractiveContent()}
            </>
        );
    }

    private renderPrimaryMedia(): JSX.Element[] {
        const { activePage, pagesBinnedByMedia } = this.props;

        return pagesBinnedByMedia
            .filter((bin: StoryPage[]) => {
                // Currently do not support anything other than video as primary media
                const mediaReferenceSharedInBin = bin[0].media.reference;
                const isVideo = mediaReferenceSharedInBin.type === "video";

                // If isVideo, return true
                // Else, log the attempt to render something other than video as primary media and return false
                // (exotic comma operator in action)
                const errMsg = "Attempted to return something other than video as primary media";
                return isVideo || (console.log(errMsg, mediaReferenceSharedInBin), false);
            })
            .map((bin: StoryPage[]) => (
                <PrimaryMediaByPageGroup
                    key={bin[0].media.mediaId}
                    activePage={activePage}
                    pageGroup={bin}
                />
            ));
    }

    private renderBodyContent(): JSX.Element[] {
        const { activePage, pagesBinnedByLayout } = this.props;

        return pagesBinnedByLayout.map((bin: StoryPage[]) => (
            <BodyContentByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={activePage}
                pageGroup={bin}
            />
        ));
    }

    private renderInteractiveContent(): JSX.Element[] {
        const { activePage, pagesBinnedByInteractive } = this.props;

        return pagesBinnedByInteractive.map((bin: InteractivePage[]) => (
            <InteractiveByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={activePage}
                pageGroup={bin}
            />
        ));
    }
}
