import * as React from "react";
import CellViewerContainer from "../CellViewerContainer";

const styles = require("./style.css");

export default class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <div className={styles.container}>
                Hello world
                <CellViewerContainer />
            </div>
        );
    }
}
