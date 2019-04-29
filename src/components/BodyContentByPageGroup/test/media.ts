export default {
    "media-1": {
        type: "video",
        source: [["foo.mp4", "video/mp4"]],
        markers: {
            zero: {
                startTime: 0,
                endTime: 0,
            },
            one: {
                startTime: 0,
                endTime: 2.5,
            },
            two: {
                startTime: 4,
                endTime: 7,
            },
            entirety: {
                startTime: 0,
                endTime: 15,
            },
        },
    },
};
