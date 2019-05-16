import { Card, Col, Row, Typography } from "antd";
import * as classNames from "classnames";
import * as React from "react";

import {
    LABELED_GENES_ARRAY,
    GENE_IDS_TO_STRUCTURE_NAMES_MAP,
    GENE_IDS,
    MITOTIC_STAGES,
    MITOTIC_STAGE_NAMES,
    MITOTIC_STAGE_IDS,
} from "../../constants/cell-viewer-apps";

import { InteractivePageProps } from "../InteractiveByPageGroup";

import "z-stack-scroller/style/style.css";
import ZStackModal from "./ZStackModal";

const styles = require("./style.css");

const GRID_THUMBNAIL_PREFIX = "/assets/Cell-grid-images-144ppi/";
const initialState = {
    selectedRow: undefined,
    selectedColumn: undefined,
};

interface ZStackCellViewerState {
    selectedRow?: keyof typeof MITOTIC_STAGE_IDS;
    selectedColumn?: keyof typeof GENE_IDS;
}

class ZStackCellViewer extends React.Component<InteractivePageProps, ZStackCellViewerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = initialState;
    }

    onCellClick(stageName: keyof typeof MITOTIC_STAGE_IDS, proteinName: keyof typeof GENE_IDS) {
        this.setState({
            selectedRow: stageName,
            selectedColumn: proteinName,
        });
    }

    closeModal() {
        this.setState(initialState);
    }

    renderWrappedRow(keyName: string, content: JSX.Element[]) {
        return (
            <Row
                key={keyName}
                className={styles.row}
                type="flex"
                justify="space-between"
                align="middle"
            >
                {content}
            </Row>
        );
    }

    renderListOfCellImageCards(phaseName: keyof typeof MITOTIC_STAGE_IDS) {
        return LABELED_GENES_ARRAY.map((proteinName) => {
            const proteinKey = proteinName as keyof typeof GENE_IDS;
            return (
                <Col
                    key={phaseName + "_" + proteinName + "_zstackcell"}
                    span={1}
                    onClick={() => this.onCellClick(phaseName, proteinKey)}
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
                        <div className={styles.gridProteinLabel}>
                            Structures labeled by fluorescently-tagged proteins
                        </div>
                        {this.renderWrappedRow("proteinLabels", [
                            <Col key={"corner_label"} span={1}>
                                <Typography.Text>Stage of cell cycle</Typography.Text>
                            </Col>,
                            ...LABELED_GENES_ARRAY.map(
                                (proteinName): JSX.Element => {
                                    const proteinKey = proteinName as keyof typeof GENE_IDS;
                                    return (
                                        <Col key={proteinName + "_label"} span={1}>
                                            <Typography.Text
                                                className={classNames(
                                                    styles.gridProteinLabel,
                                                    styles.gridLabel
                                                )}
                                            >
                                                {
                                                    GENE_IDS_TO_STRUCTURE_NAMES_MAP[
                                                        GENE_IDS[proteinKey]
                                                    ]
                                                }
                                            </Typography.Text>
                                        </Col>
                                    );
                                }
                            ),
                        ])}

                        {MITOTIC_STAGES.map((stageId) => {
                            const stageKey = stageId as keyof typeof MITOTIC_STAGE_IDS;
                            return this.renderWrappedRow(stageId + "zstackrow", [
                                <Col key={stageId + "_label"} span={1}>
                                    <Typography.Text className={styles.gridLabel}>
                                        {MITOTIC_STAGE_NAMES[stageKey]}
                                    </Typography.Text>
                                </Col>,
                                ...this.renderListOfCellImageCards(stageKey),
                            ]);
                        })}
                    </div>
                </div>
                <ZStackModal
                    closeModal={this.closeModal}
                    selectedGeneId={this.state.selectedColumn}
                    selectedMitoticStage={this.state.selectedRow}
                />
            </>
        );
    }
}

export default ZStackCellViewer;
