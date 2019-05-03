import * as React from "react";
import { range } from "lodash";
import { Card, Col, Modal, Row, Typography } from "antd";
import ZStackScroller from "z-stack-scroller";

import { SLICES_PER_ZSTACK } from "./constants";
import {
    PROTEIN_NAMES,
    MITOTIC_STAGE_NAMES,
    STRUCTURE_NAMES,
} from "../../constants/cell-viewer-apps";

interface ZStackModalProps {
    closeModal: () => void;
    modalVisible: boolean;
    zstacknameComposite: string;
    zstacknameChannel3: string;
    selectedColumn: string;
    selectedRow: string;
}

const ZStackModal: React.FunctionComponent<ZStackModalProps> = ({
    closeModal,
    modalVisible,
    zstacknameComposite,
    zstacknameChannel3,
    selectedColumn,
    selectedRow,
}: ZStackModalProps) => {
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
            imageNamesRight={range(SLICES_PER_ZSTACK).map(
                (x, i) => `${zstacknameComposite}${i.toString().padStart(2, "0")}.png`
            )}
            imageNamesLeft={range(SLICES_PER_ZSTACK).map(
                (x, i) => `${zstacknameChannel3}${i.toString().padStart(2, "0")}.png`
            )}
            initialSlice={SLICES_PER_ZSTACK / 2}
            captionRight={[
                <span className="membrane">Cell membrane</span>,
                <span className="dna">DNA</span>,
                <span>{PROTEIN_NAMES[selectedColumn]}</span>,
            ]}
            captionLeft={`Labeled ${PROTEIN_NAMES[selectedColumn]}`}
        />
        <div className={styles.metaData}>
            <p>Mitotic Stage: {MITOTIC_STAGE_NAMES[selectedColumn]}</p>
            <p>Primary structure labeled: {STRUCTURE_NAMES[selectedColumn]}</p>
            <p>Allen Institute Cell Line ID: {PROTEIN_NAMES[selectedColumn]}</p>
            <p>Gene ID: {PROTEIN_NAMES[selectedColumn]}</p>
        </div>
    </Modal>;
};

export default ZStackModal;
