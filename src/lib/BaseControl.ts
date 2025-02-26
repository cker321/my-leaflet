import { Map } from 'leaflet';
import { createApp, type App } from 'vue';
import { installStore } from './utils/store';
import BaseEventEmitter from './BaseEventEmitter';

export interface BaseControlOptions {
  position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  target?: string | HTMLElement;
}

// 定义控件的通用事件
export enum BaseControlEvent {
  MOUNTED = 'mounted',
  BEFORE_MOUNT = 'beforeMount',
  BEFORE_UNMOUNT = 'beforeUnmount',
  UNMOUNTED = 'unmounted',
  ERROR = 'error',
  READY = 'ready',
  UPDATE = 'update'
}

export abstract class BaseControl extends BaseEventEmitter {
  protected map: Map | null = null;
  protected container: HTMLElement | null = null;
  protected app: App | null = null;
  protected options: BaseControlOptions;
  protected isReady: boolean = false;
  protected parentElement: HTMLElement | null = null;

  constructor(options: BaseControlOptions = {}) {
    super();
    this.options = {
      position: 'topright',
      ...options
    };
  }

  /**
   * 添加控件到地图或指定的DOM容器
   * @param target 目标容器，可以是 Leaflet Map 实例或 DOM 元素
   */
  public addTo(target: Map | HTMLElement | string): this {
    try {
      if (target instanceof Map) {
        this.map = target;
        this.createMapContainer();
      } else if (target instanceof HTMLElement) {
        this.map = null;
        this.createDOMContainer(target);
      } else {
        this.map = null;
        this.createDOMContainer(target);
      }

      if (this.container) {
        this.initVueApp();
      }
    } catch (error) {
      this.emit(BaseControlEvent.ERROR, error);
    }
    return this;
  }

  /**
   * 从当前容器（地图或DOM）中移除控件
   */
  public remove(): this {
    try {
      this.emit(BaseControlEvent.BEFORE_UNMOUNT);
      this.destroyVueApp();
      this.removeFromContainer();
      this.container = null;
      this.map = null;
      this.parentElement = null;
      this.isReady = false;
      this.emit(BaseControlEvent.UNMOUNTED);
    } catch (error) {
      this.emit(BaseControlEvent.ERROR, error);
    }
    return this;
  }

  /**
   * 创建地图控件容器
   */
  protected createMapContainer(): void {
    if (!this.map) return;

    this.container = document.createElement('div');
    this.container.className = this.getControlClassName();
    
    const controlContainer = this.map.getContainer().querySelector(
      `.leaflet-${this.options.position}`
    );
    
    if (controlContainer) {
      this.parentElement = controlContainer as HTMLElement;
      controlContainer.appendChild(this.container);
    }
  }

  /**
   * 创建DOM容器
   * @param target DOM元素或元素ID
   */
  protected createDOMContainer(target: HTMLElement | string): void {
    this.container = document.createElement('div');
    this.container.className = this.getControlClassName();

    if (typeof target === 'string') {
      const targetElement = document.getElementById(target);
      if (!targetElement) {
        throw new Error(`Target element with id '${target}' not found`);
      }
      this.parentElement = targetElement;
    } else {
      this.parentElement = target;
    }

    this.parentElement.appendChild(this.container);
  }

  /**
   * 从当前容器中移除
   */
  protected removeFromContainer(): void {
    if (this.container) {
      this.container.remove();
    }
  }

  /**
   * 初始化 Vue 应用
   */
  protected initVueApp(): void {
    if (!this.container) return;

    const component = this.getVueComponent();
    const props = this.getComponentProps();

    this.emit(BaseControlEvent.BEFORE_MOUNT);
    
    this.app = createApp({
      setup: () => {
        this.onBeforeMount();
        return () => component(props);
      }
    });

    // 安装插件
    this.installPlugins(this.app);

    // 注册生命周期钩子
    this.app.config.globalProperties.$onMounted = () => {
      this.onMounted();
      this.emit(BaseControlEvent.MOUNTED);
      this.isReady = true;
      this.emit(BaseControlEvent.READY);
    };

    this.app.config.globalProperties.$onBeforeUnmount = () => {
      this.onBeforeUnmount();
    };

    this.app.config.globalProperties.$onUnmounted = () => {
      this.onUnmounted();
    };

    // 挂载应用
    this.app.mount(this.container);
  }

  /**
   * 销毁 Vue 应用
   */
  protected destroyVueApp(): void {
    if (this.app) {
      this.app.unmount();
      this.app = null;
    }
  }

  /**
   * 更新组件
   */
  protected update(): void {
    this.emit(BaseControlEvent.UPDATE);
  }

  /**
   * 获取控件的类名
   */
  protected abstract getControlClassName(): string;

  /**
   * 获取 Vue 组件
   */
  protected abstract getVueComponent(): any;

  /**
   * 获取组件属性
   */
  protected abstract getComponentProps(): Record<string, any>;

  /**
   * 安装 Vue 插件
   */
  protected installPlugins(app: App): void {
    // 默认安装 Pinia
    installStore(app);
  }

  /**
   * 生命周期钩子：组件挂载前
   */
  protected onBeforeMount(): void {
    // 子类可以重写此方法
  }

  /**
   * 生命周期钩子：组件挂载后
   */
  protected onMounted(): void {
    // 子类可以重写此方法
  }

  /**
   * 生命周期钩子：组件卸载前
   */
  protected onBeforeUnmount(): void {
    // 子类可以重写此方法
  }

  /**
   * 生命周期钩子：组件卸载后
   */
  protected onUnmounted(): void {
    // 子类可以重写此方法
  }
}
