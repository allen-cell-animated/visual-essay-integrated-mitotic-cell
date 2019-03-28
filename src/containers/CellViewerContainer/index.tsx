import * as React from "react";
import { connect } from "react-redux";
import { Layout, Radio } from "antd";
import MitoticSwitcher from "../../components/MitoticSwitcher";

import CellViewer from "../../components/CellViewer/index";
import {
    changeMitoticStage,
    switchRawSeg,
} from "../../state/selection/actions";
import {
    getCurrentCellId,
    getCurrentMitoticStage,
    getNextCellId,
    getPreviousCellId,
    getRawSegFilterOut,
    getRawSegSelection,
    getStagesArray,
} from "../../state/selection/selectors";
import "antd/dist/antd.css";
import { ChangeMitoticStageAction } from "../../state/selection/types";
import { State } from "../../state/types";

const styles = require("./style.css");

interface CellViewerContainerProps {
    currentMitoticStage: number;
    stagesArray: string[];
    changeMitoticStage: (newStage: number) => ChangeMitoticStageAction;
    currentCellId: string;
    prevCellId: string;
    rawOrSeg: string;
    nextCellId: string;
    switchRawSeg: (rawOrSeg: string) => ChangeRawSegAction;
}

class CellViewerContainer extends React.Component<
    CellViewerContainerProps,
    {}
> {
    constructor(props) {
        super(props);
        this.switchRawSeg = this.switchRawSeg.bind(this);
    }
    public switchRawSeg({ target }) {
        const { switchRawSeg } = this.props;
        switchRawSeg(target.value);
    }
    public render(): JSX.Element {
        const {
            currentMitoticStage,
            stagesArray,
            changeMitoticStage,
            currentCellId,
            prevCellId,
            nextCellId,
            rawOrSegFilterOut,
            rawOrSeg,
            initAcc,
        } = this.props;
        console.log(rawOrSeg);
        return (
            <Layout className={styles.container}>
                Viewer
                <Radio.Group
                    defaultValue={rawOrSeg}
                    buttonStyle="solid"
                    onChange={this.switchRawSeg}
                >
                    <Radio.Button value="_seg">Segmented</Radio.Button>
                    <Radio.Button value="_raw">Raw</Radio.Button>
                </Radio.Group>
                <CellViewer
                    cellId={currentCellId}
                    prevImg={prevCellId}
                    nextImg={nextCellId}
                    filter={rawOrSegFilterOut}
                    initAcc={initAcc}
                />
                <MitoticSwitcher
                    onChange={changeMitoticStage}
                    currentMitoticStage={currentMitoticStage}
                    stagesArray={stagesArray}
                />
            </Layout>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        currentMitoticStage: getCurrentMitoticStage(state),
        currentCellId: getCurrentCellId(state),
        stagesArray: getStagesArray(state),
        nextCellId: getNextCellId(state),
        prevCellId: getPreviousCellId(state),
        rawOrSeg: getRawSegSelection(state),
        rawOrSegFilterOut: getRawSegFilterOut(state),
    };
}

const dispatchToPropsMap = {
    changeMitoticStage,
    switchRawSeg,
};

export default connect(
    mapStateToProps,
    dispatchToPropsMap
)(CellViewerContainer);
