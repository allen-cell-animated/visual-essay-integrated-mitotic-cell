import * as React from "react";

import { map } from "lodash";
import { Col, Checkbox, Badge, Divider, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { getHexColorForChannel, getStructureName } from "../selectors";

const styles = require("./style.css");
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
        <CheckboxGroup
            onChange={onChange}
            defaultValue={selectedChannels}
            className={styles.container}
        >
            {map(channelsToRender, (channel) => (
                <Row>
                    <Col className={channel.toLowerCase()}>
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
