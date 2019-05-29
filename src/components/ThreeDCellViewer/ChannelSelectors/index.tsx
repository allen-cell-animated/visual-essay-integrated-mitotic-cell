import { Col, Checkbox, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { map } from "lodash";
import * as React from "react";

import { getStructureName } from "../selectors";

const styles = require("./style.css");

const CheckboxGroup = Checkbox.Group;

interface ChannelSelectorProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
}

const ChannelSelectors: React.FunctionComponent<ChannelSelectorProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
}: ChannelSelectorProps) => {
    const onCheckAllChange = ({ target }: CheckboxChangeEvent) => {
        const checkedList = target.checked ? channelsToRender : [];
        onChange(checkedList);
    };

    return (
        <div className={styles.container}>
            <Row type="flex" justify="space-between">
                <Col className={styles.subTitle}>Tagged Gene</Col>
                <Col span={13} className={styles.subTitle}>
                    Labeled structure
                </Col>
            </Row>
            <Row>
                <Col span={13}>
                    <Checkbox
                        className={styles.allNone}
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
                                <Col span={13}>
                                    <span>{getStructureName(channel)}</span>
                                </Col>
                            </>
                        ) : (
                            <Col className={channel.toLowerCase()} span={13} offset={11}>
                                <Checkbox key={channel} value={channel}>
                                    {channel}
                                </Checkbox>
                            </Col>
                        )}
                    </Row>
                ))}
            </CheckboxGroup>
        </div>
    );
};

export default ChannelSelectors;
