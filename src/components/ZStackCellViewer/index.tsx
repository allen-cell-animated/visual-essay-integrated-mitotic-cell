import { Card, Col, Modal, Row, Typography } from "antd";
import * as classNames from "classnames";
import { range } from "lodash";
import * as React from "react";
import ZStackScroller from "z-stack-scroller";

import { ASSETS_FOLDER } from "../../constants";

import { InteractivePageProps } from "../InteractiveByPageGroup";

import {
    ZSTACK_IDS,
    SLICES_PER_ZSTACK,
    MITOTIC_PHASES,
    PROTEIN_NAMES,
    MITOTIC_PHASES_DIR,
    MITOTIC_PHASES_NAMES,
    STRUCTURE_NAMES,
} from "./constants";
import "z-stack-scroller/style/style.css";

const styles = require("./style.css");

const GRID_THUMBNAIL_PREFIX = `${ASSETS_FOLDER}/Cell-grid-images-144ppi/Grid-rotated_slice-colorAdj-1_`;

interface ZStackCellViewerState {
    modalVisible: boolean;
    zstacknameComposite: string;
    zstacknameChannel3: string;
    selectedRow: number;
    selectedColumn: number;
}

class ZStackCellViewer extends React.Component<InteractivePageProps, ZStackCellViewerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            modalVisible: false,
            selectedRow: 0,
            selectedColumn: 0,
            zstacknameComposite: "",
            zstacknameChannel3: "",
        };
    }

    onCellClick(x: number, y: number) {
        return (() => {
            const cellid = ZSTACK_IDS[y][x];
            const protein = PROTEIN_NAMES[x];
            const stage = MITOTIC_PHASES_DIR[y];
            const zstacknameComposite = `${ASSETS_FOLDER}/mitotic_png/${stage}/${protein}_${cellid}/${protein}_${cellid}_composite/${protein}_${cellid}_raw.ome.cropped_composite_RGB_`;
            const zstacknameChannel3 = `${ASSETS_FOLDER}/mitotic_png/${stage}/${protein}_${cellid}/${protein}_${cellid}_channel3/${protein}_${cellid}_raw.ome.cropped_channel3_RGB_`;
            this.setState({
                modalVisible: true,
                selectedRow: y,
                selectedColumn: x,
                zstacknameComposite,
                zstacknameChannel3,
            });
        }).bind(this);
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            selectedRow: 0,
            selectedColumn: 0,
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

    renderCellGridRow(phaseName: string, phaseIndex: number) {
        return PROTEIN_NAMES.map((proteinName, proteinIndex) => {
            return (
                <Col
                    key={phaseName + "_" + proteinName + "_zstackcell"}
                    span={1}
                    onClick={this.onCellClick(proteinIndex, phaseIndex)}
                >
                    <Card
                        bordered={false}
                        hoverable
                        cover={
                            <img
                                src={`${GRID_THUMBNAIL_PREFIX}${(
                                    1 +
                                    proteinIndex +
                                    phaseIndex * PROTEIN_NAMES.length
                                )
                                    .toString()
                                    .padStart(2, "0")}.png`}
                            />
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
                                (proteinName, proteinIndex): JSX.Element => {
                                    return (
                                        <Col key={proteinName + "_label"} span={1}>
                                            <Typography.Text className={styles.gridLabel}>
                                                {STRUCTURE_NAMES[proteinIndex]}
                                            </Typography.Text>
                                        </Col>
                                    );
                                }
                            ),
                        ])}

                        {MITOTIC_PHASES.map((phaseName, phaseIndex) => {
                            return this.renderRow(phaseName + "zstackrow", [
                                <Col key={phaseName + "_label"} span={1}>
                                    <Typography.Text className={styles.gridLabel}>
                                        {MITOTIC_PHASES_NAMES[phaseIndex]}
                                    </Typography.Text>
                                </Col>,
                                ...this.renderCellGridRow(phaseName, phaseIndex),
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
                        <p>Mitotic Stage: {MITOTIC_PHASES_NAMES[this.state.selectedColumn]}</p>
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
