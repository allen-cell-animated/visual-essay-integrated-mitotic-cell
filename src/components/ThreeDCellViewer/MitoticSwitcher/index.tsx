import * as React from "react";

import { Button, Col, Radio, Row } from "antd";
import { MITOTIC_STAGES_NAMES, MITOTIC_STAGES } from "../constants";

const styles = require("./style.css");

interface CellViewerProps {
    currentMitoticStage: number;
    onChange: (newStage: number) => void;
    stagesArray: string[];
}

const MitoticSwitcher: React.FunctionComponent<CellViewerProps> = ({
    currentMitoticStage,
    onChange,
    stagesArray,
}: CellViewerProps) => {
    const prevNumb =
        currentMitoticStage - 1 >= 0 ? currentMitoticStage - 1 : stagesArray.length - 1;
    const nextNumb =
        currentMitoticStage + 1 <= stagesArray.length - 1 ? currentMitoticStage + 1 : 0;
    const goBack = () => {
        onChange(prevNumb);
    };

    const goForward = () => {
        onChange(nextNumb);
    };

    const onSelect = ({ target }) => {
        onChange(target.value);
    };

    return (
        <Col>
            <Row>
                <Button onClick={goBack} icon="caret-up" />
                <Button onClick={goForward} icon="caret-down" />
            </Row>
            <Radio.Group defaultValue={2} className={styles.steps} onChange={onSelect}>
                {MITOTIC_STAGES.map((ele: string, index) => {
                    return (
                        <Radio.Button
                            key={ele}
                            value={index}
                            className={`stage-icon ${MITOTIC_STAGES_NAMES[ele].toLowerCase()}-icon`}
                        >
                            {MITOTIC_STAGES_NAMES[ele]}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        </Col>
    );
};

export default MitoticSwitcher;
