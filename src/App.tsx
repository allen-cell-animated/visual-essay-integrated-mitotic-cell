import * as React from "react";

import PrimaryMediaByPageGroup from "./components/PrimaryMediaByPageGroup";
import Page from "./essay/entity/Page";
import BodyContentByPageGroup from "./components/BodyContentByPageGroup/index";

interface AppProps {
    activePage: Page;
    pagesBinnedByLayout: Page[][];
    pagesBinnedByMedia: Page[][];
}

export default class App extends React.Component<AppProps, {}> {
    private static concatenatePageIds(pages: Page[]): string {
        return pages.map((page) => page.id).join(":");
    }

    public render(): JSX.Element {
        return (
            <>
                {this.renderPrimaryMedia()}
                {this.renderBodyContent()}
            </>
        );
    }

    private renderPrimaryMedia(): JSX.Element[] {
        const { activePage, pagesBinnedByMedia } = this.props;

        return pagesBinnedByMedia
            .filter((bin: Page[]) => {
                // Currently do not support anything other than video as primary media
                const mediaReferenceSharedInBin = bin[0].media.reference;
                const isVideo = mediaReferenceSharedInBin.type === "video";

                // If isVideo, return true
                // Else, log the attempt to render something other than video as primary media and return false
                // (exotic comma operator in action)
                return (
                    isVideo ||
                    (console.log(
                        "Attempted to return something other than video as primary media",
                        mediaReferenceSharedInBin
                    ),
                    false)
                );
            })
            .map((bin: Page[]) => (
                <PrimaryMediaByPageGroup
                    key={bin[0].media.mediaId}
                    activePage={activePage}
                    pageGroup={bin}
                />
            ));
    }

    private renderBodyContent(): JSX.Element[] {
        const { activePage, pagesBinnedByLayout } = this.props;

        return pagesBinnedByLayout.map((bin: Page[]) => (
            <BodyContentByPageGroup
                key={App.concatenatePageIds(bin)}
                activePage={activePage}
                pageGroup={bin}
            />
        ));
    }
}
