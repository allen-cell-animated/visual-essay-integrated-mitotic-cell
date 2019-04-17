import { VOLUME_ENABLED, ISO_SURFACE_ENABLED } from "../../constants";

export interface Vector {
    x: number;
    y: number;
    z: number;
}

export interface ChannelRender {
    dims: number[];
    histogram: number[];
    imgData: {
        [key: string]: any;
    };
    loaded: boolean;
    lut: number[];
    name: string;
    volumeData: any;
}

export interface VolumeImage {
    atlasSize: number[];
    channel_colors_default: number[][];
    channel_names: string[];
    channels: any[];
    currentScale: Vector;
    imageInfo: ImageInfo;
    loaded: boolean;
    name: string;
    normalizedPhysicalSize: any;
    num_channels: number;
    physicalSize: Vector;
    pixel_size: number;
    scale: Vector;
    t: number;
    volumeDataObservers: number[];
    volumeSize: number[];
    x: number;
    y: number;
    z: number;
    getHistogram: (channelIndex: number) => VolumeImage;
    lutGenerator_auto2: () => VolumeImage;
}

export interface ChannelSettings {
    name: string;
    index: number;
    [VOLUME_ENABLED]: boolean;
    [ISO_SURFACE_ENABLED]: boolean;
    opacity?: number;
    color: number[];
    dataReady: boolean;
}

export interface ChannelData {
    name: string;
    channels: number[];
}

export interface JsonData {
    atlas_height: number;
    atlas_width: number;
    channel_names: string[];
    channels: number;
    cols: number;
    images: ChannelData[];
    height: number;
    name: string;
    pixel_size_x: number;
    pixel_size_y: number;
    pixel_size_z: number;
    rows: number;
    width: number;
    tile_height: number;
    tile_width: number;
    tiles: number;
    userData?: {
        [key: string]: any;
    };
}

export interface ImageInfo extends JsonData {
    transform: {
        [key: string]: number[];
    };
}
