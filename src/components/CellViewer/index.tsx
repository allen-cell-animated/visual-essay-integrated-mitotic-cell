import React from "react";

import { ImageViewerApp } from "ac-3d-viewer";
import {
    CELL_VIEWER_CONFIG,
    MITOTIC_ACTIVITY_KEYS,
    MITOTIC_GROUP_INIT_ACC,
    MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP,
} from "../../constants/index";

const styles = require("./style.css");

interface CellViewerProps {
    cellId: string;
    nextImg: string;
    prevImg: string;
}

const CellViewer: React.SFC<CellViewerProps> = ({
    cellId,
    nextImg,
    prevImg,
}) => {
    if (!cellId) {
        return null;
    }
    return (
        <div className={styles.cellViewer}>
            <ImageViewerApp
                cellId={cellId}
                appHeight="75vh"
                cellPath={cellId}
                baseUrl="assets"
                initialChannelAcc={MITOTIC_GROUP_INIT_ACC}
                groupToChannelNameMap={MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP}
                keyList={MITOTIC_ACTIVITY_KEYS}
                nextImgPath={nextImg}
                prevImgPath={prevImg}
                preLoad={true}
                renderConfig={CELL_VIEWER_CONFIG}
            />
        </div>
    );
};

export default CellViewer;
