import { Button, Col, Checkbox, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
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

interface ChannelSelectorProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
    selectPresetChannels: (presetName: string) => void;
}

const ChannelSelectors: React.FunctionComponent<ChannelSelectorProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
    selectPresetChannels,
}: ChannelSelectorProps) => {
    const onClickPreset = ({ currentTarget }: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        selectPresetChannels(currentTarget.id);
    };
    const onCheckAllChange = ({ target }: CheckboxChangeEvent) => {
        const checkedList = target.checked ? channelsToRender : [];
        onChange(checkedList);
    };

    return (
        <div className={styles.container}>
            <Row type="flex" justify="space-between">
                <Col className={styles.subTitle}>Tagged Gene</Col>
                <Col span={12} className={styles.subTitle}>
                    Labeled structure
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Checkbox
                        indeterminate={
                            !!selectedChannels.length &&
                            selectedChannels.length < channelsToRender.length
                        }
                        onChange={onCheckAllChange}
                        checked={selectedChannels.length === channelsToRender.length}
                    >
                        All/None
                    </Checkbox>
                </Col>
            </Row>
            <CheckboxGroup
                onChange={onChange}
                value={selectedChannels}
                className={styles.checkboxGroup}
            >
                {map(channelsToRender, (channel) => (
                    <Row
                        key={channel}
                        className={styles.checkBoxRow}
                        type="flex"
                        justify="space-between"
                    >
                        {getStructureName(channel) ? (
                            <>
                                <Col className={channel.toLowerCase()}>
                                    <Checkbox key={channel} value={channel}>
                                        {channel}
                                    </Checkbox>
                                </Col>
                                <Col span={12}>
                                    <span>{getStructureName(channel)}</span>
                                </Col>
                            </>
                        ) : (
                            <Col className={channel.toLowerCase()} span={12} offset={12}>
                                <Checkbox key={channel} value={channel}>
                                    {channel}
                                </Checkbox>
                            </Col>
                        )}
                    </Row>
                ))}
            </CheckboxGroup>
            <div className={styles.presetTitle}>Pathtrace renderings for structures that:</div>
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
