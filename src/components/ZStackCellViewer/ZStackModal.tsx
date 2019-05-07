import * as React from "react";
import { range } from "lodash";
import { Modal, Divider } from "antd";
import ZStackScroller from "z-stack-scroller";

import { SLICES_PER_ZSTACK, ZSTACK_IDS, MITOTIC_PHASES_DIR } from "./constants";
import {
    MITOTIC_STAGE_NAMES,
    STRUCTURE_NAMES,
    GENE_ID_MAP,
    MITOTIC_STAGES_MAP,
} from "../../constants/cell-viewer-apps";
import { ASSETS_FOLDER } from "../../constants";

const styles = require("./style.css");

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
    const stage = MITOTIC_STAGES_MAP[selectedMitoticStage];
    const protein = GENE_ID_MAP[selectedGeneId];
    const cellid = ZSTACK_IDS[stage][protein];
    const stageDir = MITOTIC_PHASES_DIR[stage];
    const zstacknameComposite = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${selectedGeneId}_${cellid}/${selectedGeneId}_${cellid}_composite/${selectedGeneId}_${cellid}_raw.ome.cropped_composite_RGB_`;
    const zstacknameChannel3 = `${ASSETS_FOLDER}/mitotic_png/${stageDir}/${selectedGeneId}_${cellid}/${selectedGeneId}_${cellid}_channel3/${selectedGeneId}_${cellid}_raw.ome.cropped_channel3_RGB_`;

    return (
        <Modal
            title={`Z-stack view of ${MITOTIC_STAGE_NAMES[selectedMitoticStage]} ${
                STRUCTURE_NAMES[proteinId]
            } visualized via ${selectedGeneId}`}
            visible={true} // this is being controlled by the selection of geneId and stage, so no need to keep track of this seperately.
            centered
            width="50%"
            footer={null}
            onOk={closeModal}
            onCancel={closeModal}
            zIndex={10000}
        >
            <ZStackScroller
                autoPlay={false}
                showControls={true}
                imageNamesRight={range(SLICES_PER_ZSTACK).map(
                    (x, i) => `${zstacknameComposite}${i.toString().padStart(2, "0")}.png`
                )}
                imageNamesLeft={range(SLICES_PER_ZSTACK).map(
                    (x, i) => `${zstacknameChannel3}${i.toString().padStart(2, "0")}.png`
                )}
                initialSlice={SLICES_PER_ZSTACK / 2}
                captionRight={[
                    <span key="membrane" className="membrane">
                        Cell membrane
                    </span>,
                    <Divider key="divider-1" type="vertical" />,
                    <span key="dna" className="dna">
                        DNA
                    </span>,
                    <Divider key="divider-2" type="vertical" />,
                    <span key="selected-gene">{selectedGeneId}</span>,
                ]}
                captionLeft={`Labeled ${selectedGeneId}`}
            />

            <div className={styles.metaData}>
                <p key="stage">Mitotic Stage: {MITOTIC_STAGE_NAMES[selectedMitoticStage]}</p>
                <p key="structure">Primary structure labeled: {STRUCTURE_NAMES[proteinId]}</p>
                <p key="cell-line">Allen Institute Cell Line ID: {STRUCTURE_NAMES[proteinId]}</p>
                <p key="gene">Gene ID: {selectedGeneId}</p>
            </div>
        </Modal>
    );
};

export default ZStackModal;
