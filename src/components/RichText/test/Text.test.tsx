import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import RichText from "../";

describe("<Text />", () => {
    it("works with rich text as innerText and has class container", () => {
        const wrapper = shallow(<RichText element="p" innerText="Some <em>very</em> rich text" />);

        expect(wrapper.html()).to.equal("<p>Some <em>very</em> rich text</p>");
    });
});
