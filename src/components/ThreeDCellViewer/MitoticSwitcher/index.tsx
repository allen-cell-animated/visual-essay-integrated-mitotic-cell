import * as React from "react";

import { Button, Col, Radio, Row } from "antd";
import { RadioChangeEvent } from "antd/es/radio";

import { MITOTIC_STAGE_NAMES, MITOTIC_STAGES } from "../../../constants/cell-viewer-apps";
import { getNextMitoticStageIndex, getPreviousMitoticStageIndex } from "../selectors";

const styles = require("./style.css");

interface MitoticSwitcherProps {
    currentMitoticStage: number;
    onChange: (newStage: number) => void;
}

const MitoticSwitcher: React.FunctionComponent<MitoticSwitcherProps> = ({
    currentMitoticStage,
    onChange,
}: MitoticSwitcherProps) => {
    const prevNumb = getPreviousMitoticStageIndex(currentMitoticStage);
    const nextNumb = getNextMitoticStageIndex(currentMitoticStage);

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
        <Col className={styles.container}>
            <Row className={styles.subTitle}>Stages</Row>
            <Row type="flex" justify="space-around" className={styles.stagesButtons}>
                <Button type="primary" onClick={goBack} icon="caret-up" />
                <Button type="primary" onClick={goForward} icon="caret-down" />
            </Row>
            <Radio.Group
                defaultValue={2}
                value={currentMitoticStage}
                className={styles.steps}
                onChange={onSelect}
            >
                {MITOTIC_STAGES.map((ele: string, index) => {
                    const key = ele as keyof typeof MITOTIC_STAGE_NAMES;
                    return (
                        <Radio.Button
                            key={key}
                            value={index}
                            className={`stage-icon ${MITOTIC_STAGE_NAMES[key].toLowerCase()}-icon`}
                        >
                            {MITOTIC_STAGE_NAMES[key]}
                        </Radio.Button>
                    );
                })}
            </Radio.Group>
        </Col>
    );
};

export default MitoticSwitcher;
