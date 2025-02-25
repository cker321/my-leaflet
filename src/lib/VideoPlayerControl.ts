import { createApp, h } from 'vue';
import VideoPlayer from './components/VideoPlayer.vue';
import { PlatformLeaflet } from './PlatformLeaflet';

interface VideoInfo {
  url: string;
  title?: string;
  duration?: number;
}

export interface VideoPlayerOptions {
  target?: string | HTMLElement;
  videoId: string;  // 视频ID，用于从API获取视频信息
  width?: number;
  height?: number;
}

export class VideoPlayerControl {
  private component: any = null;
  private container: HTMLElement | null = null;
  private app: any = null;
  private options: VideoPlayerOptions;
  private platform: PlatformLeaflet;
  private videoInfo: VideoInfo | null = null;

  constructor(options: VideoPlayerOptions) {
    this.options = {
      width: 640,
      height: 360,
      ...options
    };
    this.platform = PlatformLeaflet.getInstance();
  }

  private async fetchVideoInfo(): Promise<VideoInfo> {
    try {
      // 使用平台的request方法发起API请求
      const response = await this.platform.request<VideoInfo>(
        `/api/videos/${this.options.videoId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Failed to fetch video info:', error);
      throw error;
    }
  }

  public async addTo(container: HTMLElement | string): Promise<this> {
    // 获取或创建容器
    let targetElement: HTMLElement | null = null;
    
    if (this.options.target) {
      if (typeof this.options.target === 'string') {
        targetElement = document.getElementById(this.options.target);
      } else {
        targetElement = this.options.target;
      }
    } else if (typeof container === 'string') {
      targetElement = document.getElementById(container);
    } else {
      targetElement = container;
    }

    if (!targetElement) {
      throw new Error('Target container not found');
    }

    try {
      // 获取视频信息
      this.videoInfo = await this.fetchVideoInfo();

      // 创建 Vue 应用
      this.app = createApp({
        render: () => h(VideoPlayer, {
          url: this.videoInfo?.url || '',
          width: this.options.width,
          height: this.options.height
        })
      });

      // 挂载 Vue 组件
      this.component = this.app.mount(targetElement);
      this.container = targetElement;

    } catch (error) {
      console.error('Failed to initialize video player:', error);
      throw error;
    }

    return this;
  }

  public remove(): this {
    if (this.container) {
      // 卸载 Vue 应用
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }
      this.container = null;
      this.component = null;
    }
    return this;
  }

  // 获取容器元素
  public getContainer(): HTMLElement | null {
    return this.container;
  }

  // 获取视频信息
  public getVideoInfo(): VideoInfo | null {
    return this.videoInfo;
  }
}
