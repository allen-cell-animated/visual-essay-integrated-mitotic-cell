import { Card, Col, Modal, Row, Typography } from "antd";
import * as classNames from "classnames";
import { range } from "lodash";
import * as React from "react";
import ZStackScroller from "z-stack-scroller";

import { ASSETS_FOLDER } from "../../constants";
import {
    LABELED_GENES_ARRAY,
    STRUCTURE_NAMES,
    GENE_ID_MAP,
    MITOTIC_STAGES,
    MITOTIC_STAGE_NAMES,
    MITOTIC_STAGES_MAP,
} from "../../constants/cell-viewer-apps";

import { InteractivePageProps } from "../InteractiveByPageGroup";

import "z-stack-scroller/style/style.css";
import ZStackModal from "./ZStackModal";

const styles = require("./style.css");

const GRID_THUMBNAIL_PREFIX = `${ASSETS_FOLDER}/Cell-grid-images-144ppi/`;
const initialState = {
    selectedRow: undefined,
    selectedColumn: undefined,
};

interface ZStackCellViewerState {
    selectedRow?: keyof typeof MITOTIC_STAGES_MAP;
    selectedColumn?: keyof typeof GENE_ID_MAP;
}

class ZStackCellViewer extends React.Component<InteractivePageProps, ZStackCellViewerState> {
    constructor(props: InteractivePageProps) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = initialState;
    }

    onCellClick(stageName: keyof typeof MITOTIC_STAGES_MAP, proteinName: keyof typeof GENE_ID_MAP) {
        this.setState({
            selectedRow: stageName,
            selectedColumn: proteinName,
        });
    }

    closeModal() {
        this.setState(initialState);
    }

    renderRow(keyName: string, content: JSX.Element[]) {
        return (
            <Row key={keyName} type="flex" justify="space-between" align="middle">
                {content}
            </Row>
        );
    }

    renderCellGridRow(phaseName: keyof typeof MITOTIC_STAGES_MAP) {
        return LABELED_GENES_ARRAY.map((proteinName) => {
            const proteinKey = proteinName as keyof typeof GENE_ID_MAP;
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
                        {this.renderRow("proteinLabels", [
                            <Col key={"corner_label"} span={1}>
                                <Typography.Text>Stage of cell cycle</Typography.Text>
                            </Col>,
                            ...LABELED_GENES_ARRAY.map(
                                (proteinName): JSX.Element => {
                                    const proteinKey = proteinName as keyof typeof GENE_ID_MAP;
                                    return (
                                        <Col key={proteinName + "_label"} span={1}>
                                            <Typography.Text className={styles.gridLabel}>
                                                {STRUCTURE_NAMES[GENE_ID_MAP[proteinKey]]}
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
                    selectedGeneId={this.state.selectedColumn}
                    selectedMitoticStage={this.state.selectedRow}
                />
            </>
        );
    }
}

export default ZStackCellViewer;
