import { Button, Col, Checkbox, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { map } from "lodash";
import * as React from "react";

import { getStructureName } from "../selectors";
import {
    MITOTIC_ACTIVITY_RECOMPARTMENTALIZE,
    MITOTIC_ACTIVITY_REDISTRIBUTE,
    MITOTIC_ACTIVITY_NO_CHANGE,
} from "../constants";

const styles = require("./style.css");

const CheckboxGroup = Checkbox.Group;

interface CellViewerProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
    selectPresetChannels: (presetName: string) => void;
}

const ChannelSelectors: React.FunctionComponent<CellViewerProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
    selectPresetChannels,
}: CellViewerProps) => {
    const onClickPreset = ({ target }) => {
        console.log(target);
        selectPresetChannels(target.id);
    };
    console.log(selectedChannels);
    return (
        <div className={styles.container}>
            <CheckboxGroup
                onChange={onChange}
                value={selectedChannels}
                className={styles.checkboxGroup}
            >
                <Row type="flex" justify="space-between">
                    <Col className={styles.subTitle}>Tagged Gene</Col>
                    <Col span={12} className={styles.subTitle}>
                        Labeled structure
                    </Col>
                </Row>
                {map(channelsToRender, (channel) => (
                    <Row key={channel} type="flex" justify="space-between">
                        <Col className={channel.toLowerCase()}>
                            <Checkbox key={channel} value={channel}>
                                {channel}
                            </Checkbox>
                        </Col>
                        <Col span={12}>
                            <span>{getStructureName(channel)}</span>
                        </Col>
                    </Row>
                ))}
            </CheckboxGroup>
            <div>Pathtrace renderings for structures that:</div>
            <Button onClick={onClickPreset} id={MITOTIC_ACTIVITY_RECOMPARTMENTALIZE} block>
                Disassemble & recompartmentalize
            </Button>
            <Button onClick={onClickPreset} id={MITOTIC_ACTIVITY_REDISTRIBUTE} block>
                Redistribute & reorganize
            </Button>
            <Button onClick={onClickPreset} id={MITOTIC_ACTIVITY_NO_CHANGE} block>
                Are maintained throughout mitosis
            </Button>
        </div>
    );
};

export default ChannelSelectors;
