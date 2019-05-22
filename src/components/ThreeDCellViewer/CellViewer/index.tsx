import * as React from "react";
import { isEqual, find, map } from "lodash";
import { Volume, VolumeLoader, View3d } from "volume-viewer";

import {
    IMAGE_BRIGHTNESS,
    LUT_MIN_PCT,
    LUT_MAX_PCT,
    RAW_CHANNEL_LEVELS,
    VOLUME_ENABLED,
} from "../constants";
import { GENE_IDS, MITOTIC_STAGES } from "../../../constants/cell-viewer-apps";

import { getNextMitoticStageIndex, getPreviousMitoticStageIndex } from "../selectors";

import { VolumeImage, JsonData, ChannelSettings } from "./types";

interface CellViewerProps {
    autoRotate: boolean;
    baseUrl?: string;
    cellId: string;
    stageIndex: number;
    channelSettings: ChannelSettings[];
    cellPath: string;
    density: number;
    height: number;
    maxProject: boolean;
    nextCellId: string;
    nextImgPath: string;
    onOrientationReset: () => void;
    prevImgPath: string;
    prevCellId: string;
    preLoad: boolean;
    shouldResetOrientation: boolean;
    width: number;
    pathTrace: boolean;
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

export default class CellViewer extends React.Component<CellViewerProps, CellViewerState> {
    private container: React.RefObject<HTMLDivElement>;

    constructor(props: CellViewerProps) {
        super(props);

        this.loadFromJson = this.loadFromJson.bind(this);
        this.onChannelDataLoaded = this.onChannelDataLoaded.bind(this);
        this.loadNextImage = this.loadNextImage.bind(this);
        this.loadPrevImage = this.loadPrevImage.bind(this);
        this.beginRequestImage = this.beginRequestImage.bind(this);
        this.getOneChannelSetting = this.getOneChannelSetting.bind(this);
        this.intializeNewImage = this.intializeNewImage.bind(this);
        this.channelsToRenderChanged = this.channelsToRenderChanged.bind(this);
        this.toggleRenderedChannels = this.toggleRenderedChannels.bind(this);

        this.container = React.createRef<HTMLDivElement>();

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
        if (!this.container.current) {
            throw new Error("Cannot find CellViewer container to attach to.");
        }

        if (!this.state.view3d) {
            const view3d = new View3d(this.container.current);
            view3d.updateExposure(IMAGE_BRIGHTNESS);
            this.setState({ view3d });
        }
    }

    componentDidUpdate(prevProps: CellViewerProps, prevState: CellViewerState) {
        const {
            cellId,
            cellPath,
            density,
            height,
            width,
            maxProject,
            autoRotate,
            shouldResetOrientation,
            onOrientationReset,
            pathTrace,
        } = this.props;
        const { view3d, image } = this.state;
        if (view3d) {
            const newChannels = this.channelsToRenderChanged(prevProps.channelSettings);

            this.toggleRenderedChannels();
            if (height !== prevProps.height || width !== prevProps.width) {
                view3d.resize(null, width, height);
            }
        }
        const newRequest = cellId !== prevProps.cellId;
        if (newRequest) {
            if (cellPath === prevProps.nextImgPath) {
                this.loadNextImage();
            } else if (cellPath === prevProps.prevImgPath) {
                this.loadPrevImage();
            } else {
                this.beginRequestImage();
            }
        }

        if (cellId && !this.state.cellId && view3d) {
            this.beginRequestImage();
        }
        if (view3d && image) {
            if (maxProject !== prevProps.maxProject) {
                view3d.setMaxProjectMode(image, maxProject);
                view3d.updateActiveChannels(image);
            }
            if (autoRotate !== prevProps.autoRotate) {
                view3d.setAutoRotate(autoRotate);
            }
            if (shouldResetOrientation) {
                view3d.resetCamera();
                onOrientationReset();
            }
            if (pathTrace !== prevProps.pathTrace) {
                view3d.setVolumeRenderMode(pathTrace ? 1 : 0);
            }
            if (density !== prevProps.density) {
                view3d.updateDensity(image, density);
            }
        }
    }

    toggleRenderedChannels() {
        const { view3d, image } = this.state;
        if (image) {
            image.channel_names.forEach((name, index) => {
                const thisChannelSetting = this.getOneChannelSetting(name);
                view3d.setVolumeChannelEnabled(
                    image,
                    index,
                    thisChannelSetting &&
                        thisChannelSetting.index === index &&
                        thisChannelSetting[VOLUME_ENABLED]
                );
            });
        }
        view3d.updateActiveChannels(image);
    }

    channelsToRenderChanged(oldChannelSettings: ChannelSettings[]): number[] | boolean {
        const { channelSettings } = this.props;
        const oldChannels = map(oldChannelSettings, "index");
        const newChannels = map(channelSettings, "index");
        return !isEqual(oldChannels, newChannels);
    }

    beginRequestImage() {
        const { cellPath, cellId, prevImgPath, nextImgPath, preLoad } = this.props;

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
        const { prevImgPath, cellPath } = this.props;

        // assume prevImg is available to initialize
        if (prevImg) {
            this.intializeNewImage(prevImg);
            this.setState({
                image: prevImg,
                nextImg: image,
            });
            // preload the new "prevImg"
            return this.requestImageData(prevImgPath).then((data) => {
                this.loadFromJson(data, "prevImg");
            });
        }
        // otherwise request it as normal
        this.requestImageData(cellPath).then((data) => {
            this.loadFromJson(data, "prevImg");
        });
    }

    loadNextImage() {
        const { image, nextImg } = this.state;
        const { nextImgPath, cellPath } = this.props;
        if (nextImg) {
            this.intializeNewImage(nextImg);
            this.setState({
                image: nextImg,
                prevImg: image,
            });
            // preload the new "nextImg"
            return this.requestImageData(nextImgPath).then((data) => {
                this.loadFromJson(data, "nextImg");
            });
        }
        // otherwise request it as normal
        this.requestImageData(cellPath).then((data) => {
            this.loadFromJson(data, "prevImg");
        });
    }

    public intializeNewImage(aimg: VolumeImage) {
        const { view3d } = this.state;
        const { density, maxProject, pathTrace } = this.props;
        // Here is where we officially hand the image to the volume-viewer
        view3d.removeAllVolumes();

        view3d.addVolume(aimg, {
            channels: aimg.channel_names.map((name, index) => {
                const ch = this.getOneChannelSetting(name);

                if (!ch) {
                    return {};
                }
                if (index !== ch.index) {
                    return {
                        enabled: false,
                        color: ch.color,
                    };
                }
                return {
                    enabled: ch[VOLUME_ENABLED],
                    color: ch.color,
                };
            }),
        });
        view3d.updateDensity(aimg, density);
        view3d.setVolumeRenderMode(pathTrace ? 1 : 0);
        view3d.setMaxProjectMode(aimg, maxProject);
        // update current camera mode to make sure the image gets the update
        // tell view that things have changed for this image
        view3d.updateActiveChannels(aimg);
        view3d.setShowAxis(true);
    }

    public onChannelDataLoaded(
        aimg: VolumeImage,
        thisChannelsSettings: ChannelSettings,
        channelIndex: number,
        stateKey: string
    ) {
        const { image, view3d } = this.state;

        // typescript needed this.
        const nameCheckGene = thisChannelsSettings.name as keyof typeof GENE_IDS;

        let stage = this.props.stageIndex;
        if (stateKey === "nextImg") {
            stage = getNextMitoticStageIndex(this.props.stageIndex);
        } else if (stateKey === "prevImg") {
            stage = getPreviousMitoticStageIndex(this.props.stageIndex);
        }

        const lut = aimg
            .getHistogram(channelIndex)
            .lutGenerator_windowLevel(
                RAW_CHANNEL_LEVELS[stage][GENE_IDS[nameCheckGene]].window,
                RAW_CHANNEL_LEVELS[stage][GENE_IDS[nameCheckGene]].level
            );
        aimg.setLut(channelIndex, lut.lut);

        if (aimg !== image) {
            return;
        }
        const volenabled = thisChannelsSettings[VOLUME_ENABLED];

        view3d.setVolumeChannelOptions(aimg, channelIndex, {
            enabled: thisChannelsSettings.index === channelIndex ? volenabled : false,
            color: thisChannelsSettings.color,
        });

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

        // if we have some url to prepend to the atlas file names, do it now.
        obj.images = obj.images.map((img) => ({
            ...img,
            name: `${baseUrl}/${img.name}`,
        }));
        // GO OUT AND GET THE VOLUME DATA.
        VolumeLoader.loadVolumeAtlasData(aimg, obj.images, (url: string, channelIndex: number) => {
            const thisChannelSettings = this.getOneChannelSetting(obj.channel_names[channelIndex]);
            if (thisChannelSettings) {
                this.onChannelDataLoaded(aimg, thisChannelSettings, channelIndex, stateKey);
            }
        });
        if (stateKey === "prevImg") {
            this.setState({
                prevImg: aimg,
            });
        } else if (stateKey === "nextImg") {
            this.setState({
                nextImg: aimg,
            });
        } else {
            this.intializeNewImage(aimg);
            this.setState({ image: aimg });
            this.setState({
                image: aimg,
            });
        }
    }

    public requestImageData(path: string) {
        return fetch(path)
            .then((response) => {
                return response.json();
            })
            .catch((e) => {
                // TODO
                console.log(e);
            });
    }

    public render() {
        const { cellId } = this.props;

        if (!cellId) {
            return null;
        }

        return <div ref={this.container} />;
    }
}
