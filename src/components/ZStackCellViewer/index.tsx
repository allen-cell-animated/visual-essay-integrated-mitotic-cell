import * as React from "react";
import { map, range } from "lodash";
import { Col, Layout, Modal, Row } from "antd";

import ZStackScroller from "z-stack-scroller";

import { ASSETS_FOLDER } from "../../constants";

// TODO: remove this once custom theme added
import "antd/dist/antd.css";

const styles = require("./style.css");

const MITOTIC_STAGES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];
const MITOTIC_STAGES_DIR = ["Interphase", "M1_M2", "M3", "M4_M5", "M6_M7"];
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
    zstackname_composite: string;
    zstackname_channel3: string;
    selectedRow: number;
    selectedColumn: number;
}

class ZStackCellViewer extends React.Component<{}, ZStackCellViewerState> {
    constructor(props: {}) {
        super(props);
        this.onCellClick = this.onCellClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            modalVisible: false,
            selectedRow: 0,
            selectedColumn: 0,
            zstackname_composite: "",
            zstackname_channel3: "",
        };
    }

    onCellClick(x: number, y: number) {
        return ((e: React.MouseEvent) => {
            const cellid = ZSTACK_IDS[y][x];
            const protein = PROTEIN_NAMES[x];
            const stage = MITOTIC_STAGES_DIR[y];
            const zstackname_composite = `${ASSETS_FOLDER}/mitotic_png/${stage}/${protein}_${cellid}/${protein}_${cellid}_composite/${protein}_${cellid}_raw.ome.cropped_composite_RGB_`;
            const zstackname_channel3 = `${ASSETS_FOLDER}/mitotic_png/${stage}/${protein}_${cellid}/${protein}_${cellid}_channel3/${protein}_${cellid}_raw.ome.cropped_channel3_RGB_`;
            this.setState({
                modalVisible: true,
                selectedRow: y,
                selectedColumn: x,
                zstackname_composite,
                zstackname_channel3,
            });
        }).bind(this);
    }

    closeModal() {
        this.setState({
            modalVisible: false,
            selectedRow: 0,
            selectedColumn: 0,
            zstackname_composite: "",
            zstackname_channel3: "",
        });
    }

    public render(): JSX.Element {
        return (
            <Layout className={styles.container}>
                {MITOTIC_STAGES.map((mname, mindex) => {
                    return (
                        <Row key={mname + "zstackrow"} style={{ width: "100%", height: "150px" }}>
                            {PROTEIN_NAMES.map((pname, pindex) => {
                                return (
                                    <Col
                                        key={mname + "_" + pname + "_zstackcell"}
                                        span={1}
                                        style={{ width: "6.66%", height: "100%" }}
                                        onClick={this.onCellClick(pindex, mindex)}
                                    >
                                        <div
                                            style={{
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "cover",
                                                backgroundImage: `url('${GRID_THUMBNAIL_PREFIX}${(
                                                    1 +
                                                    pindex +
                                                    mindex * PROTEIN_NAMES.length
                                                )
                                                    .toString()
                                                    .padStart(2, "0")}.png')`,
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    );
                })}
                <Modal
                    title="ZStack"
                    visible={this.state.modalVisible}
                    width="50%"
                    footer={null}
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                    zIndex={10000}
                >
                    <ZStackScroller
                        names={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstackname_composite}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        names2={range(SLICES_PER_ZSTACK).map(
                            (x, i) =>
                                `${this.state.zstackname_channel3}${i
                                    .toString()
                                    .padStart(2, "0")}.png`
                        )}
                        initialSlice={SLICES_PER_ZSTACK / 2}
                    />
                </Modal>
            </Layout>
        );
    }
}

export default ZStackCellViewer;
