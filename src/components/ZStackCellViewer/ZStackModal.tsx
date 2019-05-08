import * as React from "react";
import { padStart, range } from "lodash";
import { Modal, Col, Row, Divider } from "antd";
import ZStackScroller from "z-stack-scroller";

import {
    SLICES_PER_ZSTACK,
    ZSTACK_IDS,
    MITOTIC_PHASES_DIR,
    GENE_TO_CELL_LINE,
    TAG_COLOR,
} from "./constants";
import {
    MITOTIC_STAGE_NAMES,
    STRUCTURE_NAMES,
    GENE_ID_MAP,
    MITOTIC_STAGES_MAP,
    PROTEIN_NAMES,
} from "../../constants/cell-viewer-apps";
import { ASSETS_FOLDER } from "../../constants";

const styles = require("./modal-style.css");

interface ZStackModalProps {
    closeModal: () => void;
    selectedGeneId?: keyof typeof GENE_ID_MAP;
    selectedMitoticStage?: keyof typeof MITOTIC_STAGES_MAP;
}

const ZStackModal: React.FunctionComponent<ZStackModalProps> = ({
    closeModal,
    selectedGeneId,
    selectedMitoticStage,
}: ZStackModalProps) => {
    if (!selectedGeneId || !selectedMitoticStage) {
        return null;
    }

    const proteinId = GENE_ID_MAP[selectedGeneId];
    const stageId = MITOTIC_STAGES_MAP[selectedMitoticStage];
    const cellId = ZSTACK_IDS[stageId][proteinId];
    const stageDir = MITOTIC_PHASES_DIR[stageId];

    const zstacknameComposite = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${selectedGeneId}_${cellId}/${selectedGeneId}_${cellId}_composite/${selectedGeneId}_${cellId}_raw.ome.cropped_composite_RGB_`;
    const zstacknameChannel3 = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${selectedGeneId}_${cellId}/${selectedGeneId}_${cellId}_channel3/${selectedGeneId}_${cellId}_raw.ome.cropped_channel3_RGB_`;

    return (
        <Modal
            title={`Z-stack view of ${MITOTIC_STAGE_NAMES[
                selectedMitoticStage
            ].toLowerCase()} ${STRUCTURE_NAMES[proteinId].toLowerCase()} visualized via ${
                PROTEIN_NAMES[proteinId]
            }`}
            visible={true} // this is being controlled by the selection of geneId and stage, so no need to keep track of this seperately.
            centered
            width="50%"
            footer={null}
            onOk={closeModal}
            onCancel={closeModal}
            zIndex={10000}
            className={styles.container}
        >
            <ZStackScroller
                autoPlay={false}
                showControls={true}
                imageNamesRight={range(SLICES_PER_ZSTACK).map(
                    (x, i) => `${zstacknameComposite}${padStart(i.toString(), 2, "0")}.png`
                )}
                imageNamesLeft={range(SLICES_PER_ZSTACK).map(
                    (x, i) => `${zstacknameChannel3}${padStart(i.toString(), 2, "0")}.png`
                )}
                initialSlice={30}
                captionRight={[
                    <span key="membrane" className={styles.membrane}>
                        Cell membrane
                    </span>,
                    <Divider key="divider-1" type="vertical" />,
                    <span key="dna" className={styles.dna}>
                        DNA
                    </span>,
                    <Divider key="divider-2" type="vertical" />,
                    <span key="selected-gene" className={styles.structure}>
                        {selectedGeneId}
                    </span>,
                ]}
                captionLeft={[
                    <span className={styles.structure} key="caption-left">
                        {TAG_COLOR[proteinId]}-tagged {PROTEIN_NAMES[proteinId]}
                    </span>,
                ]}
            />
            <Row className={styles.metaData}>
                <Col span={10} offset={8}>
                    <div key="structure">
                        Primary structure labeled:{" "}
                        <span className={styles.info}>{STRUCTURE_NAMES[proteinId]}</span>
                    </div>
                    <div key="cell-line">
                        {GENE_TO_CELL_LINE[proteinId] ? (
                            <>
                                Available in Cell Catalog as:{" "}
                                <span className={styles.info}>
                                    AICS-{GENE_TO_CELL_LINE[proteinId]}
                                </span>
                            </>
                        ) : (
                            "Cell line not publicly available "
                        )}
                    </div>
                    <Col span={12} key="cell-id">
                        Cell ID: <span className={styles.info}>{cellId}</span>
                    </Col>{" "}
                    <Col span={12} key="gene">
                        Gene ID: <span className={styles.info}>{selectedGeneId}</span>
                    </Col>
                </Col>
            </Row>
        </Modal>
    );
};

export default ZStackModal;
