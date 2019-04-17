import React from "react";

import { includes, isEqual, filter, find, map } from "lodash";
import { Checkbox } from "antd";
import { ChannelSettings } from "../CellViewer/types";
import { VOLUME_ENABLED } from "../../constants";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
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
        <CheckboxGroup
            onChange={onChange}
            options={channelsToRender}
            defaultValue={selectedChannels}
        />
    );
};

export default MitoticSwitcher;
