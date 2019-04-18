import React from "react";

import { includes, isEqual, filter, find, map } from "lodash";
import { Col, Checkbox, Badge, Divider, Row } from "antd";
import { ChannelSettings } from "../CellViewer/types";
import { VOLUME_ENABLED, PROTEIN_COLORS, PROTEIN_NAME_MAP } from "../../constants";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { getHexColorForChannel, getStructureName } from "../CellViewerContainer/selectors";
const CheckboxGroup = Checkbox.Group;

interface CellViewerProps {
    selectedChannels: CheckboxValueType[];
    channelsToRender: string[];
    onChange: (values: CheckboxValueType[]) => void;
}

const MitoticSwitcher: React.SFC<CellViewerProps> = ({
    selectedChannels,
    channelsToRender,
    onChange,
}) => {
    return (
        <CheckboxGroup onChange={onChange} defaultValue={selectedChannels}>
            {map(channelsToRender, (channel) => (
                <Row
                // type="flex"
                >
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
