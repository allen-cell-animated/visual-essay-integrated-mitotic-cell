import { Button, Dropdown, Radio, Menu, Icon } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
import * as classNames from "classnames";
import { map } from "lodash";
import * as React from "react";

import { InteractivePageProps } from "../InteractiveByPageGroup";
import { LABELED_STRUCTURE_NAMES, LABELED_GENES_ARRAY } from "../../constants/cell-viewer-apps";
import { Position } from "../VisibilityStatus/VisibilityStateMachine";

import MeasuredContainer from "../MeasuredContainer";

import CellViewer from "./CellViewer";
import ChannelSelectors from "./ChannelSelectors";
import {
    RAW,
    SEG,
    MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP,
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE,
    MITOTIC_ACTIVITY_REDISTRIBUTE,
    MITOTIC_ACTIVITY_NO_CHANGE,
} from "./constants";
import MitoticSwitcher from "./MitoticSwitcher";
import {
    getCurrentCellId,
    getDensity,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
    getChannelSettings,
} from "./selectors";

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
            rawOrSeg: SEG,
            pathTrace: true,
            maxProject: false,
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
        const channelSettings = getChannelSettings(rawOrSeg, selectedChannels);
        const density = getDensity(pathTrace, rawOrSeg === RAW);
        const menu = (
            <Menu>
                <Menu.Item>
                    <div
                        onClick={() =>
                            this.selectPresetChannels(MITOTIC_ACTIVITY_RECOMPARTMENTALIZE)
                        }
                    >
                        Disassemble & recompartmentalize
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={() => this.selectPresetChannels(MITOTIC_ACTIVITY_REDISTRIBUTE)}>
                        Redistribute & reorganize
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={() => this.selectPresetChannels(MITOTIC_ACTIVITY_NO_CHANGE)}>
                        Are maintained throughout mitosis
                    </div>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={classNames(className, styles.container)}>
                <div className={styles.title}>
                    Study relationships among 75 cell structures superimposed in space and time
                    using this 3D viewer.
                </div>
                <div className={styles.viewerAndControls}>
                    <MitoticSwitcher
                        onChange={this.changeMitoticStage}
                        currentMitoticStage={currentMitoticStage}
                    />
                    <ChannelSelectors
                        channelsToRender={LABELED_STRUCTURE_NAMES}
                        selectedChannels={this.state.selectedChannels}
                        onChange={this.onChannelToggle}
                    />

                    <div className={styles.viewerCol}>
                        <div className={styles.buttonRow}>
                            <Dropdown overlay={menu}>
                                <Button>
                                    Pathtrace renderings for structures that:{" "}
                                    <Icon type="caret-down" />
                                </Button>
                            </Dropdown>
                            <Radio.Group
                                defaultValue={rawOrSeg}
                                onChange={this.switchRawSeg}
                                buttonStyle="solid"
                                value={maxProject ? "maxProject" : rawOrSeg}
                            >
                                <Radio.Button disabled={pathTrace === true} value="raw">
                                    Raw
                                </Radio.Button>
                                <Radio.Button disabled={rawOrSeg === SEG} value="maxProject">
                                    Max project
                                </Radio.Button>
                                <Radio.Button value="seg">Segmented</Radio.Button>
                            </Radio.Group>
                            <Button
                                disabled={pathTrace === true}
                                type={autoRotate ? "primary" : "default"}
                                onClick={this.toggleAutoRotate}
                            >
                                Turntable
                            </Button>
                            <Button onClick={this.resetOrientation}>Reset</Button>
                        </div>
                        {shouldRender && (
                            <MeasuredContainer
                                className={styles.viewer}
                                render={({ height, width }) => (
                                    <CellViewer
                                        baseUrl="/assets"
                                        channelSettings={channelSettings}
                                        cellId={currentCellId}
                                        cellPath={`/assets/${currentCellId}_atlas.json`}
                                        stageIndex={currentMitoticStage}
                                        height={height}
                                        nextCellId={nextCellId}
                                        nextImgPath={`/assets/${nextCellId}_atlas.json`}
                                        prevCellId={prevCellId}
                                        prevImgPath={`/assets/${prevCellId}_atlas.json`}
                                        preLoad={true}
                                        width={width}
                                        maxProject={maxProject}
                                        autoRotate={autoRotate && !pathTrace}
                                        shouldResetOrientation={resetOrientation}
                                        onOrientationReset={this.onOrientationReset}
                                        pathTrace={pathTrace}
                                        density={density}
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
