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

import { ZSTACK_IDS, SLICES_PER_ZSTACK, MITOTIC_PHASES_DIR } from "./constants";
import "z-stack-scroller/style/style.css";

const styles = require("./style.css");

const GRID_THUMBNAIL_PREFIX = `${ASSETS_FOLDER}/Cell-grid-images-144ppi/`;

interface ZStackCellViewerState {
    modalVisible: boolean;
    zstacknameComposite: string;
    zstacknameChannel3: string;
    selectedRow?: keyof MITOTIC_STAGES_MAP;
    selectedColumn?: keyof LABELED_STRUCTURE_NAME_MAP;
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
        };
    }

    onCellClick(
        stageName: keyof MITOTIC_STAGES_MAP,
        proteinName: keyof LABELED_STRUCTURE_NAME_MAP
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

    renderCellGridRow(phaseName) {
        return PROTEIN_NAMES.map((proteinName, proteinIndex) => {
            return (
                <Col
                    key={phaseName + "_" + proteinName + "_zstackcell"}
                    span={1}
                    onClick={this.onCellClick(phaseName, proteinName)}
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
                                    return (
                                        <Col key={proteinName + "_label"} span={1}>
                                            <Typography.Text className={styles.gridLabel}>
                                                {
                                                    STRUCTURE_NAMES[
                                                        LABELED_STRUCTURE_NAME_MAP[proteinName]
                                                    ]
                                                }
                                            </Typography.Text>
                                        </Col>
                                    );
                                }
                            ),
                        ])}

                        {MITOTIC_STAGES.map((stageId) => {
                            return this.renderRow(stageId + "zstackrow", [
                                <Col key={stageId + "_label"} span={1}>
                                    <Typography.Text className={styles.gridLabel}>
                                        {MITOTIC_STAGE_NAMES[stageId]}
                                    </Typography.Text>
                                </Col>,
                                ...this.renderCellGridRow(stageId),
                            ]);
                        })}
                    </div>
                </div>

                <Modal
                    title="Z-stack cell viewer"
                    visible={this.state.modalVisible}
                    centered
                    width="50%"
                    footer={null}
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                    zIndex={10000}
                >
                    <ZStackScroller
                        imageNamesRight={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstacknameComposite}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        imageNamesLeft={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstacknameChannel3}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        initialSlice={SLICES_PER_ZSTACK / 2}
                        captionRight={[
                            <span className="membrane">Cell membrane</span>,
                            <span className="dna">DNA</span>,
                            <span>{PROTEIN_NAMES[this.state.selectedColumn]}</span>,
                        ]}
                        captionLeft={`Labeled ${PROTEIN_NAMES[this.state.selectedColumn]}`}
                    />
                    <div className={styles.metaData}>
                        <p>Mitotic Stage: {MITOTIC_STAGE_NAMES[this.state.selectedColumn]}</p>
                        <p>
                            Primary structure labeled: {STRUCTURE_NAMES[this.state.selectedColumn]}
                        </p>
                        <p>
                            Allen Institute Cell Line ID: {PROTEIN_NAMES[this.state.selectedColumn]}
                        </p>
                        <p>Gene ID: {PROTEIN_NAMES[this.state.selectedColumn]}</p>
                    </div>
                </Modal>
            </>
        );
    }
}

export default ZStackCellViewer;
