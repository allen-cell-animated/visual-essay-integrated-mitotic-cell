import { Button, Radio, Typography } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
import * as classNames from "classnames";
import { map } from "lodash";
import * as React from "react";

import { InteractivePageProps } from "../InteractiveByPageGroup";
import { ASSETS_FOLDER } from "../../constants";
import { Position } from "../VisibilityStatus/VisibilityStateMachine";

import MeasuredContainer from "../MeasuredContainer";

import CellViewer from "./CellViewer";
import ChannelSelectors from "./ChannelSelectors";
import { RAW, PROTEIN_NAMES, SEG } from "./constants";
import MitoticSwitcher from "./MitoticSwitcher";
import {
    getCurrentCellId,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
    getChannelSettings,
} from "./selectors";

const { Title } = Typography;

const styles = require("./style.css");

interface CellViewerContainerState {
    currentMitoticStage: number;
    rawOrSeg: string;
    selectedChannels: any[]; // MRM: I gave up on getting this to be typed correctly between my types and antd/s
    shouldRender: boolean;
}

class CellViewerContainer extends React.Component<InteractivePageProps, CellViewerContainerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.switchRawSeg = this.switchRawSeg.bind(this);
        this.changeMitoticStage = this.changeMitoticStage.bind(this);
        this.onChannelToggle = this.onChannelToggle.bind(this);
        this.state = {
            currentMitoticStage: 1,
            rawOrSeg: RAW,
            selectedChannels: PROTEIN_NAMES,
            shouldRender: false,
        };
    }

    public componentDidUpdate() {
        const { position } = this.props;
        const { shouldRender } = this.state;

        if (position && position === Position.IN_VIEWPORT && !shouldRender) {
            this.setState({ shouldRender: true });
        }
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

    public render(): JSX.Element | null {
        const { className } = this.props;
        const { currentMitoticStage, rawOrSeg, selectedChannels, shouldRender } = this.state;

        const currentCellId = getCurrentCellId(currentMitoticStage);
        const prevCellId = getPreviousCellId(currentMitoticStage);
        const nextCellId = getNextCellId(currentMitoticStage);
        const stagesArray = getStagesArray(currentMitoticStage);
        const channelSettings = getChannelSettings(rawOrSeg, selectedChannels);
        return (
            <div className={classNames(className, styles.container)}>
                <Title level={4} className={styles.title}>
                    3D Volume Viewer
                </Title>
                <div className={styles.viewerAndControls}>
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
                    <div className={styles.viewerCol}>
                        <Radio.Group defaultValue={rawOrSeg} onChange={this.switchRawSeg}>
                            <Radio.Button value="raw">Raw</Radio.Button>
                            <Radio.Button value="seg">Segmented</Radio.Button>
                            <Button disabled={rawOrSeg === SEG}>Max Project</Button>
                        </Radio.Group>
                        {shouldRender && (
                            <MeasuredContainer
                                className={styles.viewer}
                                render={({ height, width }) => (
                                    <CellViewer
                                        baseUrl={ASSETS_FOLDER}
                                        channelSettings={channelSettings}
                                        cellId={currentCellId}
                                        cellPath={`${ASSETS_FOLDER}/${currentCellId}_atlas.json`}
                                        height={height}
                                        nextCellId={nextCellId}
                                        nextImgPath={`${ASSETS_FOLDER}/${nextCellId}_atlas.json`}
                                        prevCellId={prevCellId}
                                        prevImgPath={`${ASSETS_FOLDER}/${prevCellId}_atlas.json`}
                                        preLoad={true}
                                        width={width}
                                    />
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CellViewerContainer;
