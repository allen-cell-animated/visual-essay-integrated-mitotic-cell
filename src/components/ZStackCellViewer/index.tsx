import * as React from "react";
import { map } from "lodash";
import { Col, Layout, Radio, Row } from "antd";

import { ASSETS_FOLDER } from "../../constants";

// TODO: remove this once custom theme added
import "antd/dist/antd.css";

const styles = require("./style.css");

const assets = "mitotic_png";
const MITOTIC_STAGES = ["Interphase", "M1-M2", "M3", "M4-M5", "M6-M7"];
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

interface ZStackCellViewerState {}

class ZStackCellViewer extends React.Component<{}, ZStackCellViewerState> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public changeMitoticStage(newStage: number) {
        this.setState({ currentMitoticStage: newStage });
    }

    public render(): JSX.Element {
        return (
            <Layout className={styles.container}>
                Viewer
                {MITOTIC_STAGES.map((mname, mindex) => {
                    <Row>
                        {PROTEIN_NAMES.map((pname, pindex) => {
                            <Col>{mname + "_" + pname}</Col>;
                        })}
                    </Row>;
                })}
            </Layout>
        );
    }
}

export default ZStackCellViewer;
