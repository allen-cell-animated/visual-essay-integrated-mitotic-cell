import { Card, Col, Modal, Row, Typography } from "antd";
import * as classNames from "classnames";
import { range } from "lodash";
import * as React from "react";
import ZStackScroller from "z-stack-scroller";

import { ASSETS_FOLDER } from "../../constants";
import {
    PROTEIN_NAMES,
    STRUCTURE_NAMES,
    LABELED_STRUCTURE_NAME_MAP,
    MITOTIC_STAGES,
    MITOTIC_STAGE_NAMES,
    MITOTIC_STAGES_MAP,
} from "../../constants/cell-viewer-apps";

import { InteractivePageProps } from "../InteractiveByPageGroup";

import { ZSTACK_IDS, MITOTIC_PHASES_DIR } from "./constants";
import "z-stack-scroller/style/style.css";
import ZStackModal from "./ZStackModal";

const styles = require("./style.css");

const GRID_THUMBNAIL_PREFIX = `${ASSETS_FOLDER}/Cell-grid-images-144ppi/`;

interface ZStackCellViewerState {
    modalVisible: boolean;
    zstacknameComposite: string;
    zstacknameChannel3: string;
    selectedRow: keyof typeof MITOTIC_STAGES_MAP;
    selectedColumn: keyof typeof LABELED_STRUCTURE_NAME_MAP;
}

class ZStackCellViewer extends React.Component<InteractivePageProps, ZStackCellViewerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            modalVisible: false,
            zstacknameComposite: "",
            zstacknameChannel3: "",
            selectedRow: "Interphase",
            selectedColumn: "TUBA1B",
        };
    }

    onCellClick(
        stageName: keyof typeof MITOTIC_STAGES_MAP,
        proteinName: keyof typeof LABELED_STRUCTURE_NAME_MAP
    ) {
        return (() => {
            const stage = MITOTIC_STAGES_MAP[stageName];
            const protein = LABELED_STRUCTURE_NAME_MAP[proteinName];
            const cellid = ZSTACK_IDS[stage][protein];
            const stageDir = MITOTIC_PHASES_DIR[stage];
            const zstacknameComposite = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${proteinName}_${cellid}/${proteinName}_${cellid}_composite/${proteinName}_${cellid}_raw.ome.cropped_composite_RGB_`;
            const zstacknameChannel3 = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${proteinName}_${cellid}/${proteinName}_${cellid}_channel3/${proteinName}_${cellid}_raw.ome.cropped_channel3_RGB_`;
            this.setState({
                modalVisible: true,
                selectedRow: stageName,
                selectedColumn: proteinName,
                zstacknameComposite,
                zstacknameChannel3,
            });
        }).bind(this);
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            zstacknameComposite: "",
            zstacknameChannel3: "",
        });
    }

    renderRow(keyName: string, content: JSX.Element[]) {
        return (
            <Row key={keyName} type="flex" justify="space-between" align="middle">
                {content}
            </Row>
        );
    }

    renderCellGridRow(phaseName: keyof typeof MITOTIC_STAGES_MAP) {
        return PROTEIN_NAMES.map((proteinName) => {
            const proteinKey = proteinName as keyof typeof LABELED_STRUCTURE_NAME_MAP;
            return (
                <Col
                    key={phaseName + "_" + proteinName + "_zstackcell"}
                    span={1}
                    onClick={this.onCellClick(phaseName, proteinKey)}
                >
                    <Card
                        bordered={false}
                        hoverable
                        cover={
                            <img src={`${GRID_THUMBNAIL_PREFIX}${proteinName}_${phaseName}.png`} />
                        }
                    />
                </Col>
            );
        });
    }

    public render(): JSX.Element {
        const { className } = this.props;

        return (
            <>
                <div className={classNames(className, styles.container)}>
                    <Typography.Text className={styles.title}>
                        Click on any cell in the grid below to study the spinning disc confocal data
                        in a z-stack image viewer.
                    </Typography.Text>
                    <div className={styles.grid}>
                        {this.renderRow("proteinLabels", [
                            <Col key={"corner_label"} span={1}>
                                <Typography.Text>Stage of cell cycle</Typography.Text>
                            </Col>,
                            ...PROTEIN_NAMES.map(
                                (proteinName): JSX.Element => {
                                    const proteinKey = proteinName as keyof typeof LABELED_STRUCTURE_NAME_MAP;
                                    return (
                                        <Col key={proteinName + "_label"} span={1}>
                                            <Typography.Text className={styles.gridLabel}>
                                                {
                                                    STRUCTURE_NAMES[
                                                        LABELED_STRUCTURE_NAME_MAP[proteinKey]
                                                    ]
                                                }
                                            </Typography.Text>
                                        </Col>
                                    );
                                }
                            ),
                        ])}

                        {MITOTIC_STAGES.map((stageId) => {
                            const stageKey = stageId as keyof typeof MITOTIC_STAGES_MAP;
                            return this.renderRow(stageId + "zstackrow", [
                                <Col key={stageId + "_label"} span={1}>
                                    <Typography.Text className={styles.gridLabel}>
                                        {MITOTIC_STAGE_NAMES[stageKey]}
                                    </Typography.Text>
                                </Col>,
                                ...this.renderCellGridRow(stageKey),
                            ]);
                        })}
                    </div>
                </div>
                <ZStackModal
                    closeModal={this.closeModal}
                    modalVisible={this.state.modalVisible}
                    zstacknameComposite={this.state.zstacknameComposite}
                    zstacknameChannel3={this.state.zstacknameChannel3}
                    selectedGeneId={this.state.selectedColumn}
                    selectedMitoticStage={this.state.selectedRow}
                />
            </>
        );
    }
}

export default ZStackCellViewer;
