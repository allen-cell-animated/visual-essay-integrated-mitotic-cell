import * as React from "react";

import { Button, Col, Radio, Row } from "antd";
import { MITOTIC_STAGES_NAMES, MITOTIC_STAGES } from "../constants";
import { RadioChangeEvent } from "antd/es/radio";

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

    const onSelect = ({ target }: RadioChangeEvent) => {
        onChange(target.value);
    };

    return (
        <Col>
            <Row className={styles.subTitle}>Stages</Row>
            <Row type="flex" justify="space-around" className={styles.stagesButtons}>
                <Button onClick={goBack} icon="caret-up" />
                <Button onClick={goForward} icon="caret-down" />
            </Row>
            <Radio.Group defaultValue={2} className={styles.steps} onChange={onSelect}>
                {MITOTIC_STAGES.map((ele: string, index) => {
                    const key = ele as keyof typeof MITOTIC_STAGES_NAMES;
                    return (
                        <Radio.Button
                            key={key}
                            value={index}
                            className={`stage-icon ${MITOTIC_STAGES_NAMES[key].toLowerCase()}-icon`}
                        >
                            {MITOTIC_STAGES_NAMES[key]}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        </Col>
    );
};

export default MitoticSwitcher;
