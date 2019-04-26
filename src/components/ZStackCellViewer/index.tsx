import * as React from "react";
import { range } from "lodash";
import { Card, Col, Modal, Row, Typography } from "antd";
import ZStackScroller from "z-stack-scroller";

import { ASSETS_FOLDER } from "../../constants";

import { InteractivePageProps } from "../InteractiveByPageGroup";

import "z-stack-scroller/style/style.css";

const styles = require("./style.css");

const MITOTIC_PHASES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];
const MITOTIC_PHASES_DIR = ["Interphase", "M1_M2", "M3", "M4_M5", "M6_M7"];
const MITOTIC_PHASES_NAMES = ["Interphase", "Prophase", "Prometaphase", "Metaphase", "Anaphase"];
const PROTEIN_NAMES = [
    "ACTB",
    "ACTN1",
    "CENT2",
    "CTNNB1",
    "DSP",
    "FBL",
    "GJA1",
    "LAMP1",
    "LMNB1",
    "MYH10",
    "SEC61B",
    "ST6GAL1",
    "TJP1",
    "TOMM20",
    "TUBA1B",
];
const STRUCTURE_NAMES = [
    "Actin filaments",
    "Actin bundles",
    "Centrosome",
    "Adherens junctions",
    "Desmosomes",
    "Nucleolus (DF)",
    "Gap junction",
    "Lysosome",
    "Nuclear envelope",
    "Actomyosin bundles",
    "ER",
    "Golgi",
    "Tight junctions",
    "Mitochondria",
    "Microtubules",
];
const SLICES_PER_ZSTACK = 58;
const ZSTACK_IDS = [
    [
        "36972",
        "92320",
        "68018",
        "112818",
        "26096",
        "56186",
        "84867",
        "8761",
        "78027",
        "47479",
        "34690",
        "40381",
        "52374",
        "16877",
        "71126",
    ],
    [
        "36152",
        "93340",
        "66089",
        "112512",
        "22234",
        "57673",
        "84547",
        "4948",
        "81600",
        "44648",
        "31703",
        "40899",
        "50874",
        "15838",
        "71535",
    ],
    [
        "109970",
        "88806",
        "67753",
        "114159",
        "25417",
        "52860",
        "105732",
        "8830",
        "81623",
        "44125",
        "31957",
        "40988",
        "52391",
        "10456",
        "70407",
    ],
    [
        "35865",
        "109986",
        "64987",
        "115111",
        "26057",
        "58088",
        "85638",
        "6077",
        "82718",
        "47581",
        "33239",
        "41204",
        "48868",
        "12975",
        "71092",
    ],
    [
        "150386",
        "89338",
        "68799",
        "151687",
        "150279",
        "150778",
        "105434",
        "150859",
        "149910",
        "150568",
        "150403",
        "150506",
        "49161",
        "150139",
        "149843",
    ],
];
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
        return (
            <>
                <div className={styles.container}>
                    <Typography.Title level={4}>
                        Fluorescently labeled structures (primary FP localization during interphase)
                    </Typography.Title>
                    {this.renderRow("proteinLabels", [
                        <Col key={"corner_label"} span={1}>
                            <Typography.Title level={4}>Stage of cell cycle</Typography.Title>
                        </Col>,
                        ...PROTEIN_NAMES.map(
                            (proteinName, proteinIndex): JSX.Element => {
                                return (
                                    <Col key={proteinName + "_label"} span={1}>
                                        <div>{STRUCTURE_NAMES[proteinIndex]}</div>
                                    </Col>
                                );
                            }
                        ),
                    ])}

                    {MITOTIC_PHASES.map((phaseName, phaseIndex) => {
                        return this.renderRow(phaseName + "zstackrow", [
                            <Col key={phaseName + "_label"} span={1}>
                                <div>{MITOTIC_PHASES_NAMES[phaseIndex]}</div>
                            </Col>,
                            ...this.renderCellGridRow(phaseName, phaseIndex),
                        ]);
                    })}
                </div>

                <Modal
                    title={`${MITOTIC_PHASES_NAMES[this.state.selectedRow]} ${
                        STRUCTURE_NAMES[this.state.selectedColumn]
                    }`}
                    visible={this.state.modalVisible}
                    centered
                    width="50%"
                    footer={null}
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                    zIndex={10000}
                >
                    <ZStackScroller
                        names={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstacknameComposite}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        names2={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstacknameChannel3}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        initialSlice={SLICES_PER_ZSTACK / 2}
                    />
                </Modal>
            </>
        );
    }
}

export default ZStackCellViewer;
