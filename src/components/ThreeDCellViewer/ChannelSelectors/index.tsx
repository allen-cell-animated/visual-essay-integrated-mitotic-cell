import { Col, Checkbox, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { map } from "lodash";
import * as React from "react";

import { getStructureName } from "../selectors";

const styles = require("./style.css");

const CheckboxGroup = Checkbox.Group;

interface CellViewerProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
}

const ChannelSelectors: React.FunctionComponent<CellViewerProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
}: CellViewerProps) => {
    return (
        <CheckboxGroup
            onChange={onChange}
            defaultValue={selectedChannels}
            className={styles.container}
        >
            <Row>
                <Col span={9} className={styles.subTitle}>
                    Tagged Gene
                </Col>
                <Col span={15} className={styles.subTitle}>
                    Labeled structure
                </Col>
            </Row>
            {map(channelsToRender, (channel) => (
                <Row key={channel}>
                    <Col className={channel.toLowerCase()} span={9}>
                        <Checkbox key={channel} value={channel}>
                            {channel}
                        </Checkbox>
                    </Col>
                    <Col span={15}>{getStructureName(channel)}</Col>
                </Row>
            ))}
        </CheckboxGroup>
    );
};

export default ChannelSelectors;
