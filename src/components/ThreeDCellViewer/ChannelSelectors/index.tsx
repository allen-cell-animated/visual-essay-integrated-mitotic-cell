import React from "react";

import { map } from "lodash";
import { Col, Checkbox, Badge, Divider, Row } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { getHexColorForChannel, getStructureName } from "../selectors";
const CheckboxGroup = Checkbox.Group;

interface CellViewerProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
}

const MitoticSwitcher: React.FunctionComponent<CellViewerProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
}: CellViewerProps) => {
    return (
        <CheckboxGroup onChange={onChange} defaultValue={selectedChannels}>
            {map(channelsToRender, (channel) => (
                <Row>
                    <Col>
                        <Badge dot style={{ backgroundColor: getHexColorForChannel(channel) }} />

                        <Checkbox key={channel} value={channel}>
                            {channel}
                            <Divider type="vertical" />
                            {getStructureName(channel)}
                        </Checkbox>
                    </Col>
                </Row>
            ))}
        </CheckboxGroup>
    );
};

export default MitoticSwitcher;
