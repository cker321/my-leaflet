import { PlatformLeaflet } from './PlatformLeaflet';
import { ThreeDLayer } from './3dLayer';
import { ChangeCenterControl } from './ChangeCenterControl';
import { VideoPlayerControl } from './VideoPlayerControl';
import { LegendControl } from './LegendControl';
import { initializeStore } from './utils/store';

export type { ThreeDLayerOptions } from './3dLayer';
export type { ChangeCenterOptions } from './ChangeCenterControl';
export type { VideoPlayerOptions } from './VideoPlayerControl';
export type { LegendControlOptions } from './LegendControl';

// 初始化 Pinia store
initializeStore();

// 创建一个工厂函数来生成组件实例
const createComponent = {
  ThreeDLayer: (options: any) => {
    PlatformLeaflet.getInstance().validateAuth();
    return new ThreeDLayer(options);
  },
  ChangeCenterControl: (options: any) => {
    PlatformLeaflet.getInstance().validateAuth();
    return new ChangeCenterControl(options);
  },
  VideoPlayerControl: (options: any) => {
    PlatformLeaflet.getInstance().validateAuth();
    return new VideoPlayerControl(options);
  },
  LegendControl: (options: any) => {
    PlatformLeaflet.getInstance().validateAuth();
    return new LegendControl(options);
  }
};

export {
  PlatformLeaflet,
  createComponent as Components
};
