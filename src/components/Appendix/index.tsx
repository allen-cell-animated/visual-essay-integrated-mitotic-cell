import * as classNames from "classnames";
import * as React from "react";

import { default as ImageComponent } from "../Image";
import { InteractivePageProps } from "../InteractiveByPageGroup";

import {
    PrimaryResource,
    PrimaryResourceGroup,
    primaryResources,
    RelatedResource,
    relatedResources,
} from "./resources";

const styles = require("./style.css");

export default class Appendix extends React.Component<InteractivePageProps> {
    private static renderPrimaryResourceGroup(
        primaryResourceGroup: PrimaryResourceGroup
    ): JSX.Element {
        return (
            <article className={styles.primaryResourceGroup} key={primaryResourceGroup.title}>
                <h3 className={styles.primaryResourceGroupTitle}>{primaryResourceGroup.title}</h3>
                <div className={styles.primaryResourceCards}>
                    {primaryResourceGroup.resources.map(Appendix.renderPrimaryResource)}
                </div>
            </article>
        );
    }

    private static renderPrimaryResource(primaryResource: PrimaryResource): JSX.Element {
        return (
            <div className={styles.primaryResourceCard} key={primaryResource.title}>
                <ImageComponent
                    containerClassName={styles.primaryResourceCardImage}
                    source={primaryResource.image}
                />
                <div className={styles.primaryResourceCardText}>
                    <h4 className={styles.primaryResourceCardTitle}>{primaryResource.title}</h4>
                    <p className={styles.primaryResourceCardDescription}>
                        {primaryResource.description}
                    </p>
                </div>
            </div>
        );
    }

    private static renderRelatedResources(relatedResource: RelatedResource): JSX.Element {
        return (
            <li key={relatedResource.label}>
                <span>{relatedResource.label}</span> {relatedResource.description}
            </li>
        );
    }

    public render(): JSX.Element {
        const { className } = this.props;

        return (
            <section className={classNames(className, styles.section)}>
                <header className={styles.header}>
                    <h2>More information and resources available on allencell.org</h2>
                </header>
                <section className={styles.primaryResources}>
                    {primaryResources.map(Appendix.renderPrimaryResourceGroup)}
                </section>
                <footer className={styles.footer}>
                    <h3 className={styles.footerTitle}>Additional related resources</h3>
                    <ul className={styles.relatedResourcesList}>
                        {relatedResources.map(Appendix.renderRelatedResources)}
                    </ul>
                </footer>
            </section>
        );
    }
}
