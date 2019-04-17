import * as React from "react";
import { Layout, Radio } from "antd";
import MitoticSwitcher from "../MitoticSwitcher";

import CellViewer from "../CellViewer";
import ChannelSelectors from "../ChannelSelectors";
import { includes, isEqual, filter, find, map } from "lodash";

import {
    getCurrentCellId,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
    getChannelSettings,
} from "./selectors";
// import "antd/dist/antd.css";

import { MITOTIC_GROUP_INIT_ACC, RAW, ASSETS_FOLDER, PROTEIN_NAMES } from "../../constants";
import { RadioChangeEventTarget, RadioChangeEvent } from "antd/lib/radio";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

const styles = require("./style.css");

interface CellViewerContainerProps {}

interface CellViewerContainerState {
    currentMitoticStage: number;
    rawOrSeg: string;
    selectedChannels: CheckboxValueType[];
}

class CellViewerContainer extends React.Component<
    CellViewerContainerProps,
    CellViewerContainerState
> {
    constructor(props: CellViewerContainerProps) {
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

    public onChannelToggle(value: CheckboxValueType[]) {
        this.setState({
            selectedChannels: value,
        });
    }

    public render(): JSX.Element {
        const { rawOrSeg, currentMitoticStage, selectedChannels } = this.state;
        const currentCellId = getCurrentCellId(currentMitoticStage);
        const prevCellId = getPreviousCellId(currentMitoticStage);
        const nextCellId = getNextCellId(currentMitoticStage);
        const stagesArray = getStagesArray(currentMitoticStage);
        const rawOrSegFilterOut = rawOrSeg === "raw" ? "seg" : "raw";
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
                        filter={rawOrSegFilterOut}
                        initAcc={MITOTIC_GROUP_INIT_ACC}
                        channelSettings={channelSettings}
                        preLoad={true}
                    />
                </div>
            </Layout>
        );
    }
}

export default CellViewerContainer;
