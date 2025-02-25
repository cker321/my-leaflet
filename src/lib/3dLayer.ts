import * as L from 'leaflet';
import type { Map as LeafletMap, LayerOptions } from 'leaflet';
import './styles/3dLayer.css';

export interface ThreeDLayerOptions extends LayerOptions {
    height?: number;
    color?: string;
}

export class ThreeDLayer {
    private map: LeafletMap | null = null;
    private options: ThreeDLayerOptions;
    private container: HTMLElement | null = null;

    constructor(options: ThreeDLayerOptions = {}) {
        this.options = {
            height: 200,
            color: '#3388ff',
            ...options
        };
    }

    public addTo(map: LeafletMap): this {
        this.map = map;
        this.onAdd(map);
        return this;
    }

    public remove(): this {
        if (this.map) {
            this.onRemove(this.map);
            this.map = null;
        }
        return this;
    }

    private onAdd(map: LeafletMap): void {
        this.container = L.DomUtil.create('div', 'leaflet-3d-layer');
        if (this.container) {
            this.container.style.height = `${this.options.height}px`;
            this.container.style.backgroundColor = this.options.color!;
            map.getPanes().overlayPane.appendChild(this.container);
        }
    }

    private onRemove(map: LeafletMap): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }
    }

    // 公共方法示例
    public setHeight(height: number): this {
        this.options.height = height;
        if (this.container) {
            this.container.style.height = `${height}px`;
        }
        return this;
    }

    public setColor(color: string): this {
        this.options.color = color;
        if (this.container) {
            this.container.style.backgroundColor = color;
        }
        return this;
    }
}
