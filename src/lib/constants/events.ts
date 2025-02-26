export const CONTROL_EVENTS = {
    BEFORE_MOUNT: 'beforeMount',
    MOUNTED: 'mounted',
    BEFORE_UNMOUNT: 'beforeUnmount',
    UNMOUNTED: 'unmounted',
    ERROR: 'error',
    UPDATE: 'update',
    READY: 'ready'
} as const;

export const LAYER_EVENTS = {
    VISIBILITY_CHANGE: 'visibilityChange',
    OPACITY_CHANGE: 'opacityChange',
    STYLE_CHANGE: 'styleChange',
    DATA_CHANGE: 'dataChange'
} as const;

export const VIDEO_EVENTS = {
    PLAY: 'play',
    PAUSE: 'pause',
    STOP: 'stop',
    TIME_UPDATE: 'timeUpdate',
    VOLUME_CHANGE: 'volumeChange',
    MUTE_CHANGE: 'muteChange'
} as const;
