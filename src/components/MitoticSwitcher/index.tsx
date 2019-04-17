import React from "react";

import { Button, Steps } from "antd";

const { Step } = Steps;

interface CellViewerProps {
    currentMitoticStage: number;
    onChange: (newStage: number) => void;
    stagesArray: string[];
}

const MitoticSwitcher: React.SFC<CellViewerProps> = ({
    currentMitoticStage,
    onChange,
    stagesArray,
}) => {
    const prevNumb =
        currentMitoticStage - 1 >= 0
            ? currentMitoticStage - 1
            : stagesArray.length - 1;
    const nextNumb =
        currentMitoticStage + 1 <= stagesArray.length - 1
            ? currentMitoticStage + 1
            : 0;
    const goBack = () => {
        onChange(prevNumb);
    };

    const goForward = () => {
        onChange(nextNumb);
    };
    return (
        <React.Fragment>
            <Button.Group>
                <Button onClick={goBack} icon="left" />
                <Button onClick={goForward} icon="right" />
            </Button.Group>
            <Steps current={2} progressDot direction="vertical">
                {stagesArray.map((ele: string) => {
                    return <Step key={ele} title={ele} />;
                })}
            </Steps>
        </React.Fragment>
    );
};

export default MitoticSwitcher;
