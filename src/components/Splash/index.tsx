import * as React from "react";

import { Position } from "../VisibilityStatus";

interface SplashProps {
    position: Position;
}

export default class Splash extends React.Component<SplashProps> {
    public render(): JSX.Element {
        return <section />;
    }
}
