import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Image from "../";

describe("<Image />", () => {
    it("renders a caption if given one", () => {
        const wrapper = shallow(<Image source="images/example.png" caption="Some example." />);

        expect(wrapper.exists("figcaption")).to.equal(true);
    });

    it("does not render a caption if not given one", () => {
        const wrapper = shallow(<Image source="images/example.png" />);

        expect(wrapper.exists("figcaption")).to.equal(false);
    });
});
