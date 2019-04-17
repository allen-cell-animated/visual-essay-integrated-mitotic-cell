import * as React from "react";
import { Layout, Radio } from "antd";
import MitoticSwitcher from "../MitoticSwitcher";

import CellViewer from "../CellViewer";

import {
    getCurrentCellId,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
    getChannelSettings,
} from "./selectors";
import "antd/dist/antd.css";
import { MITOTIC_GROUP_INIT_ACC, RAW, ASSETS_FOLDER } from "../../constants";
import { RadioChangeEventTarget, RadioChangeEvent } from "antd/lib/radio";

const styles = require("./style.css");

interface CellViewerContainerProps {}

interface CellViewerContainerState {
    currentMitoticStage: number;
    rawOrSeg: string;
    channelSettings: any;
}

class CellViewerContainer extends React.Component<
    CellViewerContainerProps,
    CellViewerContainerState
> {
    constructor(props: CellViewerContainerProps) {
        super(props);
        this.switchRawSeg = this.switchRawSeg.bind(this);
        this.changeMitoticStage = this.changeMitoticStage.bind(this);
        this.state = {
            currentMitoticStage: 1,
            rawOrSeg: RAW,
            channelSettings: getChannelSettings(RAW),
        };
    }
    public switchRawSeg({ target }: RadioChangeEvent) {
        this.setState({ rawOrSeg: target.value });
    }

    public changeMitoticStage(newStage: number) {
        this.setState({ currentMitoticStage: newStage });
    }

    public render(): JSX.Element {
        const { rawOrSeg, currentMitoticStage } = this.state;
        const currentCellId = getCurrentCellId(currentMitoticStage);
        const prevCellId = getPreviousCellId(currentMitoticStage);
        const nextCellId = getNextCellId(currentMitoticStage);
        const stagesArray = getStagesArray(currentMitoticStage);
        const rawOrSegFilterOut = rawOrSeg === "raw" ? "seg" : "raw";
        console.log(ASSETS_FOLDER);
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
                        channelSettings={this.state.channelSettings}
                        preLoad={true}
                    />
                </div>
            </Layout>
        );
    }
}

export default CellViewerContainer;
