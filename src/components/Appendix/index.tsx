import * as classNames from "classnames";
import * as React from "react";

import { default as ImageComponent } from "../Image";
import { InteractivePageProps } from "../InteractiveByPageGroup";

const styles = require("./style.css");

export default class Appendix extends React.Component<InteractivePageProps> {
    public render(): JSX.Element {
        const { className } = this.props;

        return (
            <section className={classNames(className, styles.section)}>
                <ImageComponent
                    imgClassName={styles.mockup}
                    source="https://s3-us-west-2.amazonaws.com/staging.imsc-visual-essay.allencell.org/assets/appendix-mockup.png"
                />
            </section>
        );
    }
}
