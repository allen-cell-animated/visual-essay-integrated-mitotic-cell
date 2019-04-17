import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import Text from "../";

describe("<Text />", () => {
    it("works with rich text as innerText", () => {
        const wrapper = shallow(<Text element="p" innerText="Some <em>very</em> rich text" />);

        expect(wrapper.html()).to.equal("<p>Some <em>very</em> rich text</p>");
    });
});
