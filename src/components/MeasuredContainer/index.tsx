import * as classNames from "classnames";
import * as elementResizeDetector from "element-resize-detector";
import * as React from "react";

type CenterCoordinates = [number, number];

export interface RenderPropParams {
    center: CenterCoordinates;
    height: number;
    width: number;
}

interface MeasuredContainerProps {
    render: (props: RenderPropParams) => JSX.Element;
    className?: string;
    containerProps: React.Attributes;
    tag: keyof React.ReactHTML | keyof React.ReactSVG;
}

interface MeasuredContainerState {
    center: CenterCoordinates;
    height: number;
    isMounted: boolean;
    width: number;
}

/**
 * This component follows the "render prop" pattern (https://reactjs.org/docs/render-props.html).
 * It calls `props.render` with RenderPropParams and renders the result as a child of `props.tag`.
 * The purpose of this component is to provide arbitrary content with measurements of their container
 */
export default class MeasuredContainer extends React.Component<
    MeasuredContainerProps,
    MeasuredContainerState
> {
    public static defaultProps = {
        containerProps: {},
        tag: "div",
    };

    public state: MeasuredContainerState = {
        center: [0, 0],
        height: 0,
        isMounted: false,
        width: 0,
    };

    private container: React.RefObject<HTMLElement>;

    private elementResizeDetector: elementResizeDetector.Erd = elementResizeDetector({
        strategy: "scroll",
    });

    constructor(props: MeasuredContainerProps) {
        super(props);

        this.measureContainerAndStoreDimensions = this.measureContainerAndStoreDimensions.bind(
            this
        );
        this.container = React.createRef<HTMLElement>();
    }

    public componentDidMount() {
        if (this.container.current) {
            this.elementResizeDetector.listenTo(
                this.container.current,
                this.measureContainerAndStoreDimensions
            );
            this.setState({ isMounted: true });
        }
    }

    public componentWillUnmount() {
        if (this.container.current) {
            this.elementResizeDetector.uninstall(this.container.current);
        }
    }

    public measureContainerAndStoreDimensions(): void {
        if (!this.container.current) {
            return;
        }

        const { height, left, top, width } = this.container.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        this.setState({
            center: [centerX, centerY],
            height,
            width,
        });
    }

    public render() {
        const { className, containerProps, tag, render } = this.props;
        const { center, height, isMounted, width } = this.state;

        // cannot use JSX here because `props.tag` is a JSX.IntrinsicElement
        // <tag /> is parsed into React.createElement("tag", ...)
        // <Tag /> is parsed into React.createElement(Tag, ...)
        // whereas what we want is React.createElement("div"|"span", etc, ...)
        return React.createElement(
            tag,
            {
                className: classNames(className),
                ref: this.container,
                ...containerProps,
            },
            isMounted && render({ center, height, width })
        );
    }
}
