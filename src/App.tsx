import * as React from "react";

import PrimaryMediaByPageGroup from "./components/PrimaryMediaByPageGroup";
import Page from "./essay/entity/Page";

interface AppProps {
    activePage: Page;
    pagesBinnedByLayout: Page[][];
    pagesBinnedByMedia: Page[][];
}

export default class App extends React.Component<AppProps, {}> {
    public render(): JSX.Element {
        return <>{this.renderPrimaryMedia()}</>;
    }

    private renderPrimaryMedia(): JSX.Element[] {
        const { activePage, pagesBinnedByMedia } = this.props;

        return pagesBinnedByMedia
            .filter((bin: Page[]) => {
                // we currently do not support anything other than video as primary media
                const mediaReferenceSharedInBin = bin[0].media.reference;
                const isVideo = mediaReferenceSharedInBin.type === "video";

                // if isVideo, return true
                // else, log the attempt to render something other than video as primary media
                // and return false (exotic comma operator in action)
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
}
