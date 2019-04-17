import React from "react";
import {
    RENDERMODE_PATHTRACE,
    RENDERMODE_RAYMARCH,
    Volume,
    VolumeLoader,
    AREA_LIGHT,
    Light,
    SKY_LIGHT,
    View3d,
} from "volume-viewer";
import { includes, isEqual, filter, find, map } from "lodash";

const VIEW_3D_VIEWER = "view3dviewer";

import {
    CELL_VIEWER_CONFIG,
    MITOTIC_ACTIVITY_KEYS,
    MITOTIC_GROUP_INIT_ACC,
    MITOTIC_GROUP_TO_CHANNEL_NAMES_MAP,
    ISO_SURFACE_ENABLED,
    VOLUME_ENABLED,
    LUT_CONTROL_POINTS,
} from "../../constants/index";
import { VolumeImage, JsonData, ChannelSettings } from "./types";

const styles = require("./style.css");

interface CellViewerProps {
    cellId: string;
    filter: string;
    initAcc: any;
    channelSettings: ChannelSettings[];
    cellPath: string;
    nextImgPath: string;
    prevImgPath: string;
    prevCellId: string;
    nextCellId: string;
    preLoad: boolean;
    appHeight?: string;
    baseUrl: string;
}

interface CellViewerState {
    view3d?: any;
    image?: VolumeImage;
    cellId?: string;
    nextImg?: VolumeImage;
    prevImg?: VolumeImage;
    loadedPath?: string;
    sendingQueryRequest: boolean;
}

class CellViewer extends React.Component<CellViewerProps, CellViewerState> {
    constructor(props: CellViewerProps) {
        super(props);
        this.loadFromJson = this.loadFromJson.bind(this);
        this.onChannelDataLoaded = this.onChannelDataLoaded.bind(this);
        this.loadNextImage = this.loadNextImage.bind(this);
        this.loadPrevImage = this.loadPrevImage.bind(this);
        this.beginRequestImage = this.beginRequestImage.bind(this);
        this.getOneChannelSetting = this.getOneChannelSetting.bind(this);
        this.intializeNewImage = this.intializeNewImage.bind(this);
        this.state = {
            view3d: undefined,
            image: undefined,
            cellId: "",
            nextImg: undefined,
            prevImg: undefined,
            sendingQueryRequest: false,
        };
    }

    componentDidMount() {
        if (!this.state.view3d) {
            let el = document.getElementById(VIEW_3D_VIEWER);
            this.setState({ view3d: new View3d(el) });
        }
    }

    componentDidUpdate(prevProps: CellViewerProps, prevState: CellViewerState) {
        const { cellId, cellPath, channelSettings } = this.props;
        const { view3d } = this.state;
        const newRequest = cellId !== prevProps.cellId;
        console.log(newRequest);
        if (newRequest) {
            if (cellPath === prevProps.nextImgPath) {
                this.loadNextImage();
            } else if (cellPath === prevProps.prevImgPath) {
                this.loadPrevImage();
            } else {
                this.beginRequestImage();
            }
        }
        if (cellId && !prevState.cellId && view3d) {
            this.beginRequestImage();
        }
        if (view3d) {
            view3d.resize(null, 1032, 915);
        }
    }

    beginRequestImage() {
        const {
            cellPath,
            cellId,
            prevImgPath,
            nextImgPath,
            preLoad,
        } = this.props;

        this.setState({
            cellId,
            loadedPath: cellPath,
            sendingQueryRequest: true,
        });
        if (preLoad) {
            this.requestImageData(nextImgPath).then((data) => {
                this.loadFromJson(data, "nextImg");
            });
            this.requestImageData(prevImgPath).then((data) => {
                this.loadFromJson(data, "prevImg");
            });
        }
        this.requestImageData(cellPath).then((data) => {
            this.loadFromJson(data, "image");
        });
    }

    loadPrevImage() {
        const { image, prevImg } = this.state;
        const { prevImgPath } = this.props;

        // assume prevImg is available to initialize
        this.intializeNewImage(prevImg);
        this.setState({
            image: prevImg,
            nextImg: image,
        });
        // preload the new "prevImg"
        this.requestImageData(prevImgPath).then((data) => {
            this.loadFromJson(data, "prevImg");
        });
    }

    loadNextImage() {
        const { image, nextImg } = this.state;
        const { nextImgPath } = this.props;
        console.log(nextImg);
        // assume nextImg is available to initialize
        this.intializeNewImage(nextImg);
        this.setState({
            image: nextImg,
            prevImg: image,
        });
        // preload the new "nextImg"
        this.requestImageData(nextImgPath).then((data) => {
            this.loadFromJson(data, "nextImg");
        });
    }

    public intializeNewImage(aimg: any) {
        const { view3d } = this.state;
        const { channelSettings } = this.props;

        let imageMask = 1.0;
        let imageBrightness = 0.5;
        let imageDensity = 20.0;
        // set alpha slider first time image is loaded to something that makes sense

        // Here is where we officially hand the image to the volume-viewer

        view3d.removeAllVolumes();

        view3d.addVolume(aimg);
        view3d.setVolumeRenderMode(0);

        view3d.updateMaskAlpha(aimg, imageMask);
        // view3d.setMaxProjectMode(aimg, false);
        view3d.updateExposure(imageBrightness);
        view3d.updateDensity(aimg, imageDensity);
        // view3d.updateMaterial(aimg);

        // update current camera mode to make sure the image gets the update
        // tell view that things have changed for this image
        view3d.updateActiveChannels(aimg);
        view3d.setShowAxis(true);
    }

    public onChannelDataLoaded(
        aimg: VolumeImage,
        thisChannelsSettings: ChannelSettings,
        channelIndex: number
    ) {
        const { image, view3d } = this.state;
        if (aimg !== image) {
            return;
        }
        const volenabled = thisChannelsSettings[VOLUME_ENABLED];
        const isoenabled = thisChannelsSettings[ISO_SURFACE_ENABLED];

        view3d.setVolumeChannelOptions(aimg, channelIndex, {
            enabled:
                thisChannelsSettings.index === channelIndex
                    ? volenabled
                    : false,
            isosurfaceEnabled: false,
        });

        // keep control points if they exist AND we are in path trace mode

        const lutObject = aimg.getHistogram(channelIndex).lutGenerator_auto2();
        view3d.updateLuts(aimg);
    }

    public getOneChannelSetting(channelName: string) {
        const { channelSettings } = this.props;
        return find(channelSettings, (channel) => {
            return channel.name === channelName.split("_")[0];
        });
    }

    public loadFromJson(obj: JsonData, stateKey: string) {
        const { baseUrl } = this.props;
        const aimg: VolumeImage = new Volume(obj);

        // const newChannelSettings = this.updateStateOnLoadImage(obj.channel_names);
        // if we have some url to prepend to the atlas file names, do it now.
        obj.images = obj.images.map((img) => ({
            ...img,
            name: `${baseUrl}/${img.name}`,
        }));
        // GO OUT AND GET THE VOLUME DATA.
        VolumeLoader.loadVolumeAtlasData(
            aimg,
            obj.images,
            (url: string, channelIndex: number) => {
                // const thisChannelSettings = this.getOneChannelSetting(channel.name, newChannelSettings, (channel) => channel.name === obj.channel_names[channelIndex].split('_')[0]);
                const thisChannelSettings = this.getOneChannelSetting(
                    obj.channel_names[channelIndex]
                );
                if (thisChannelSettings) {
                    this.onChannelDataLoaded(
                        aimg,
                        thisChannelSettings,
                        channelIndex
                    );
                }
            }
        );
        if (stateKey === "image") {
            this.intializeNewImage(aimg);
        } else if (stateKey === "prevImg") {
            this.setState({ prevImg: aimg });
        } else if (stateKey === "nextImg") {
            this.setState({ nextImg: aimg });
        }
    }

    public requestImageData(path: string) {
        const { cellId, filter } = this.props;
        return fetch(path).then((response) => {
            return response.json();
        });
    }

    public render() {
        const { cellId, filter, appHeight } = this.props;
        if (!cellId) {
            return null;
        }

        return (
            <div className={styles.cellViewer} style={{ height: appHeight }}>
                <div id={VIEW_3D_VIEWER} className={styles.view3d} />
            </div>
        );
    }
}

export default CellViewer;
