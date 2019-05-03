import * as React from "react";
import { range } from "lodash";
import { Modal } from "antd";
import ZStackScroller from "z-stack-scroller";

import { SLICES_PER_ZSTACK } from "./constants";
import {
    MITOTIC_STAGE_NAMES,
    STRUCTURE_NAMES,
    LABELED_STRUCTURE_NAME_MAP,
    MITOTIC_STAGES_MAP,
} from "../../constants/cell-viewer-apps";

const styles = require("./style.css");

interface ZStackModalProps {
    closeModal: () => void;
    modalVisible: boolean;
    zstacknameComposite: string;
    zstacknameChannel3: string;
    selectedGeneId: keyof typeof LABELED_STRUCTURE_NAME_MAP;
    selectedMitoticStage: keyof typeof MITOTIC_STAGES_MAP;
}

const ZStackModal: React.FunctionComponent<ZStackModalProps> = ({
    closeModal,
    modalVisible,
    zstacknameComposite,
    zstacknameChannel3,
    selectedGeneId,
    selectedMitoticStage,
}: ZStackModalProps) => {
    const proteinId = LABELED_STRUCTURE_NAME_MAP[selectedGeneId];

    return (
        <Modal
            title="Z-stack cell viewer"
            visible={modalVisible}
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
                    <span key="dna" className="dna">
                        DNA
                    </span>,
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
