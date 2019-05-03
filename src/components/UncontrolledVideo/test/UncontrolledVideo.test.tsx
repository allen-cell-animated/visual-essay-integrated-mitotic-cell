import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import UncontrolledVideo from "../";

describe("<UncontrolledVideo />", () => {
    const source = [["video/video.mp4", "video/mp4"]];

    it("renders a caption if given one", () => {
        const wrapper = shallow(<UncontrolledVideo source={source} caption="Some example." />);

        expect(wrapper.html().includes("figcaption")).to.equal(true);
    });

    it("does not render a caption if not given one", () => {
        const wrapper = shallow(<UncontrolledVideo source={source} />);

        expect(wrapper.html().includes("figcaption")).to.equal(false);
    });
});
