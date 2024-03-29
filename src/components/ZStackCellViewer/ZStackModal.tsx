import * as React from "react";
import { padStart, range } from "lodash";
import { Modal, Col, Row, Divider } from "antd";
import ZStackScroller, { PlayMode } from "@aics/z-stack-scroller";

import {
    SLICES_PER_ZSTACK,
    ZSTACK_IDS,
    MITOTIC_PHASES_DIR,
    GENE_TO_CELL_LINE,
    TAG_COLOR,
} from "./constants";
import {
    MITOTIC_STAGE_NAMES,
    GENE_IDS_TO_STRUCTURE_NAMES_MAP,
    GENE_IDS,
    MITOTIC_STAGE_IDS,
    GENE_IDS_TO_PROTEIN_NAME_MAP,
} from "../../constants/cell-viewer-apps";

import "@aics/z-stack-scroller/style/style.css";

const styles = require("./modal-style.css");

interface ZStackModalProps {
    closeModal: () => void;
    selectedGeneId?: keyof typeof GENE_IDS;
    selectedMitoticStage?: keyof typeof MITOTIC_STAGE_IDS;
}

const ZStackModal: React.FunctionComponent<ZStackModalProps> = ({
    closeModal,
    selectedGeneId,
    selectedMitoticStage,
}: ZStackModalProps) => {
    if (!selectedGeneId || !selectedMitoticStage) {
        return null;
    }

    const proteinId = GENE_IDS[selectedGeneId];
    const stageId = MITOTIC_STAGE_IDS[selectedMitoticStage];
    const cellId = ZSTACK_IDS[stageId][proteinId];
    const stageDir = MITOTIC_PHASES_DIR[stageId];
    const zstacknameComposite = `/assets/mitotic_png/${stageDir}/${selectedGeneId}_${cellId}/${selectedGeneId}_${cellId}_composite/${selectedGeneId}_${cellId}_raw.ome.cropped_composite_RGB_`;
    const zstacknameChannel3 = `/assets/mitotic_png/${stageDir}/${selectedGeneId}_${cellId}/${selectedGeneId}_${cellId}_channel3/${selectedGeneId}_${cellId}_raw.ome.cropped_channel3_RGB_`;

    return (
        <Modal
            title={`Z-stack view of ${MITOTIC_STAGE_NAMES[
                selectedMitoticStage
            ].toLowerCase()} ${GENE_IDS_TO_STRUCTURE_NAMES_MAP[
                proteinId
            ].toLowerCase()} visualized via ${GENE_IDS_TO_PROTEIN_NAME_MAP[proteinId]}`}
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
                        {TAG_COLOR[proteinId]}-tagged {GENE_IDS_TO_PROTEIN_NAME_MAP[proteinId]}
                    </span>,
                ]}
                initialPlayMode={PlayMode.paused}
            />
            <Row className={styles.metaData}>
                <Col span={10} offset={8}>
                    <div key="structure">
                        <span>Primary structure labeled: </span>
                        <span className={styles.info}>
                            {GENE_IDS_TO_STRUCTURE_NAMES_MAP[proteinId]}
                        </span>
                    </div>
                    <div key="cell-line">
                        {GENE_TO_CELL_LINE[proteinId] ? (
                            <>
                                <span>Available in Cell Catalog as: </span>
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
                    </Col>
                    <Col span={12} key="gene">
                        Gene ID: <span className={styles.info}>{selectedGeneId}</span>
                    </Col>
                </Col>
            </Row>
        </Modal>
    );
};

export default ZStackModal;
