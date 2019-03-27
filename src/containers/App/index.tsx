import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import MitoticSwitcher from "../../components/MitoticSwitcher";

import CellViewer from "../../components/CellViewer/index";
import { changeMitoticStage } from "../../state/selection/actions";
import {
    getCurrentCellId,
    getCurrentMitoticStage,
    getCurrentMitoticStageLabel,
    getNextCellId,
    getPreviousCellId,
    getStagesArray,
} from "../../state/selection/selectors";
import "antd/dist/antd.css";
import { ChangeMitoticStageAction } from "../../state/selection/types";
import { State } from "../../state/types";

const styles = require("./style.css");

interface AppProps {
    currentMitoticStage: number;
    stagesArray: string[];
    changeMitoticStage: (newStage: number) => ChangeMitoticStageAction;
    currentCellId: string;
    prevCellId: string;
    nextCellId: string;
}

class App extends React.Component<AppProps, {}> {
    public render(): JSX.Element {
        const {
            currentMitoticStage,
            stagesArray,
            changeMitoticStage,
            currentCellId,
            prevCellId,
            nextCellId,
        } = this.props;
        return (
            <Layout className={styles.container}>
                Viewer
                <CellViewer
                    cellId={currentCellId}
                    prevImg={prevCellId}
                    nextImg={nextCellId}
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
