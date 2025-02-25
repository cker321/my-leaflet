import { createApp, h } from 'vue';
import type { Map as LeafletMap } from 'leaflet';
import * as L from 'leaflet';
import ChangeCenter from './components/ChangeCenter.vue';

export interface ChangeCenterOptions {
  target?: string | HTMLElement; // 目标元素ID或DOM元素
  zoom?: number;
  animateDuration?: number;
}

export class ChangeCenterControl {
  private map: LeafletMap | null = null;
  private component: any = null;
  private container: HTMLElement | null = null;
  private options: ChangeCenterOptions;
  private app: any = null;

  constructor(options: ChangeCenterOptions = {}) {
    this.options = {
      zoom: 13,
      animateDuration: 1,
      ...options
    };
  }

  public addTo(map: LeafletMap): this {
    this.map = map;

    // 获取或创建容器
    let targetElement: HTMLElement | null = null;

    if (this.options.target) {
      if (typeof this.options.target === 'string') {
        targetElement = document.getElementById(this.options.target);
      } else {
        targetElement = this.options.target;
      }
    }

    if (!targetElement) {
      // 如果没有指定目标元素，创建一个默认容器并添加到地图上
      targetElement = L.DomUtil.create('div', 'leaflet-control leaflet-control-changeCenter');
      const controlContainer = map.getContainer().querySelector('.leaflet-top.leaflet-left');
      if (controlContainer) {
        controlContainer.appendChild(targetElement);
      } else {
        map.getContainer().appendChild(targetElement);
      }
    }

    // 确保容器有正确的类名
    targetElement.classList.add('leaflet-control-changeCenter');

    // 防止地图事件传播
    L.DomEvent.disableClickPropagation(targetElement);
    L.DomEvent.disableScrollPropagation(targetElement);

    // 创建 Vue 应用
    this.app = createApp({
      render: () => h(ChangeCenter, {
        map: this.map,
        zoom: this.options.zoom,
        animateDuration: this.options.animateDuration
      })
    });

    // 挂载 Vue 组件
    this.component = this.app.mount(targetElement);
    this.container = targetElement;

    return this;
  }

  public remove(): this {
    if (this.container) {
      // 卸载 Vue 应用
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }

      // 如果是自动创建的容器，则移除它
      if (!this.options.target && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      this.container = null;
      this.component = null;
    }
    this.map = null;
    return this;
  }

  // 公开方法：设置中心点
  public setCenter(latitude: number, longitude: number): this {
    if (this.map) {
      this.map.flyTo([latitude, longitude]);
    }
    return this;
  }

  // 获取容器元素
  public getContainer(): HTMLElement | null {
    return this.container;
  }
}
