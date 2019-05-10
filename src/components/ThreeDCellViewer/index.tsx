import { Button, Radio, Typography } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
import * as classNames from "classnames";
import { map } from "lodash";
import * as React from "react";

import { InteractivePageProps } from "../InteractiveByPageGroup";
import { ASSETS_FOLDER } from "../../constants";
import { LABELED_STRUCTURE_NAMES, LABELED_GENES_ARRAY } from "../../constants/cell-viewer-apps";
import { Position } from "../VisibilityStatus/VisibilityStateMachine";

import MeasuredContainer from "../MeasuredContainer";

import CellViewer from "./CellViewer";
import ChannelSelectors from "./ChannelSelectors";
import { RAW, SEG, MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP } from "./constants";
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
    autoRotate: boolean;
    currentMitoticStage: number;
    rawOrSeg: string;
    resetOrientation: boolean;
    selectedChannels: any[]; // MRM: I gave up on getting this to be typed correctly between my types and antd/s
    shouldRender: boolean;
    maxProject: boolean;
    pathTrace: boolean;
}

class CellViewerContainer extends React.Component<InteractivePageProps, CellViewerContainerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.switchRawSeg = this.switchRawSeg.bind(this);
        this.changeMitoticStage = this.changeMitoticStage.bind(this);
        this.onChannelToggle = this.onChannelToggle.bind(this);
        this.toggleAutoRotate = this.toggleAutoRotate.bind(this);
        this.onOrientationReset = this.onOrientationReset.bind(this);
        this.resetOrientation = this.resetOrientation.bind(this);
        this.selectPresetChannels = this.selectPresetChannels.bind(this);
        this.state = {
            currentMitoticStage: 1,
            rawOrSeg: RAW,
            selectedChannels: LABELED_STRUCTURE_NAMES,
            shouldRender: false,
            maxProject: false,
            autoRotate: false,
            resetOrientation: false,
            pathTrace: false,
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
        const { value } = target;
        if (value === "maxProject") {
            return this.setState({
                rawOrSeg: RAW,
                maxProject: true,
            });
        }
        return this.setState({
            rawOrSeg: value,
            maxProject: false,
        });
    }

    public changeMitoticStage(newStage: number) {
        this.setState({ currentMitoticStage: newStage });
    }

    public onChannelToggle(value: any[]) {
        this.setState({
            selectedChannels: value as string[],
            pathTrace: false, // any channel change reverts back to no pathtrace
        });
    }

    public selectPresetChannels(presetValue: string) {
        const channelsOn = MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP[presetValue];
        this.setState({
            selectedChannels: channelsOn as string[],
            pathTrace: true,
        });
    }

    public toggleAutoRotate() {
        this.setState({
            autoRotate: !this.state.autoRotate,
        });
    }

    public resetOrientation() {
        this.setState({
            resetOrientation: true,
        });
    }

    public onOrientationReset() {
        this.setState({
            resetOrientation: false,
        });
    }

    public render(): JSX.Element | null {
        const { className } = this.props;
        const {
            rawOrSeg,
            currentMitoticStage,
            selectedChannels,
            shouldRender,
            maxProject,
            resetOrientation,
            autoRotate,
            pathTrace,
        } = this.state;

        const currentCellId = getCurrentCellId(currentMitoticStage);
        const prevCellId = getPreviousCellId(currentMitoticStage);
        const nextCellId = getNextCellId(currentMitoticStage);
        const stagesArray = getStagesArray(currentMitoticStage);
        const channelSettings = getChannelSettings(rawOrSeg, selectedChannels);
        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.title}>3D Volume Viewer</div>
                <div className={styles.viewerAndControls}>
                    <MitoticSwitcher
                        onChange={this.changeMitoticStage}
                        currentMitoticStage={currentMitoticStage}
                        stagesArray={stagesArray}
                    />
                    <ChannelSelectors
                        channelsToRender={LABELED_STRUCTURE_NAMES}
                        selectedChannels={this.state.selectedChannels}
                        onChange={this.onChannelToggle}
                        selectPresetChannels={this.selectPresetChannels}
                    />

                    <div className={styles.viewerCol}>
                        <div className={styles.buttonRow}>
                            <Radio.Group
                                defaultValue={rawOrSeg}
                                onChange={this.switchRawSeg}
                                buttonStyle="solid"
                            >
                                <Radio.Button value="raw">Raw</Radio.Button>
                                <Radio.Button disabled={rawOrSeg === SEG} value="maxProject">
                                    Max project
                                </Radio.Button>
                                <Radio.Button value="seg">Segmented</Radio.Button>
                            </Radio.Group>
                            <div>
                                <Button
                                    type={autoRotate ? "primary" : "default"}
                                    onClick={this.toggleAutoRotate}
                                >
                                    Turntable
                                </Button>
                                <Button onClick={this.resetOrientation}>Reset</Button>
                            </div>
                        </div>
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
                                        maxProject={maxProject}
                                        autoRotate={autoRotate}
                                        shouldResetOrienation={resetOrientation}
                                        onOrientationReset={this.onOrientationReset}
                                        pathTrace={pathTrace}
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
