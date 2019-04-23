import * as React from "react";
import { map } from "lodash";
import { Layout, Radio } from "antd";
import { RadioChangeEvent } from "antd/es/radio";

import { ASSETS_FOLDER } from "../../constants";

import CellViewer from "./CellViewer";
import ChannelSelectors from "./ChannelSelectors";
import MitoticSwitcher from "./MitoticSwitcher";

import {
    getCurrentCellId,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
    getChannelSettings,
} from "./selectors";

import { RAW, PROTEIN_NAMES } from "./constants";

const styles = require("./style.css");

interface CellViewerContainerState {
    currentMitoticStage: number;
    rawOrSeg: string;
    selectedChannels: any[]; // I gave up on getting this to be typed correctly between my types and antd/s
}

class CellViewerContainer extends React.Component<{}, CellViewerContainerState> {
    constructor(props: {}) {
        super(props);
        this.switchRawSeg = this.switchRawSeg.bind(this);
        this.changeMitoticStage = this.changeMitoticStage.bind(this);
        this.onChannelToggle = this.onChannelToggle.bind(this);
        this.state = {
            currentMitoticStage: 1,
            rawOrSeg: RAW,
            selectedChannels: PROTEIN_NAMES,
        };
    }
    public switchRawSeg({ target }: RadioChangeEvent) {
        this.setState({
            rawOrSeg: target.value,
        });
    }

    public changeMitoticStage(newStage: number) {
        this.setState({ currentMitoticStage: newStage });
    }

    public onChannelToggle(value: any[]) {
        this.setState({
            selectedChannels: value as string[],
        });
    }

    public render(): JSX.Element {
        const { rawOrSeg, currentMitoticStage, selectedChannels } = this.state;
        const currentCellId = getCurrentCellId(currentMitoticStage);
        const prevCellId = getPreviousCellId(currentMitoticStage);
        const nextCellId = getNextCellId(currentMitoticStage);
        const stagesArray = getStagesArray(currentMitoticStage);
        const channelSettings = getChannelSettings(rawOrSeg, selectedChannels);
        return (
            <Layout className={styles.container}>
                Viewer
                <Radio.Group
                    defaultValue={rawOrSeg}
                    buttonStyle="solid"
                    onChange={this.switchRawSeg}
                >
                    <Radio.Button value="seg">Segmented</Radio.Button>
                    <Radio.Button value="raw">Raw</Radio.Button>
                </Radio.Group>
                <div className={styles.viewerContainer}>
                    <MitoticSwitcher
                        onChange={this.changeMitoticStage}
                        currentMitoticStage={currentMitoticStage}
                        stagesArray={stagesArray}
                    />
                    <ChannelSelectors
                        channelsToRender={map(channelSettings, "name")}
                        selectedChannels={this.state.selectedChannels}
                        onChange={this.onChannelToggle}
                    />
                    <CellViewer
                        cellId={currentCellId}
                        prevCellId={prevCellId}
                        nextCellId={nextCellId}
                        baseUrl={ASSETS_FOLDER}
                        cellPath={`${ASSETS_FOLDER}/${currentCellId}_atlas.json`}
                        prevImgPath={`${ASSETS_FOLDER}/${prevCellId}_atlas.json`}
                        nextImgPath={`${ASSETS_FOLDER}/${nextCellId}_atlas.json`}
                        channelSettings={channelSettings}
                        preLoad={true}
                    />
                </div>
            </Layout>
        );
    }
}

export default CellViewerContainer;
