import { BaseControl } from './BaseControl';
import Legend from './components/Legend.vue';
import type { LegendItem } from './components/Legend.vue';
import { LayerManager } from './LayerManager';

export interface LegendControlOptions {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    title?: string;
    width?: string | number;
    showOpacity?: boolean;
}

export class LegendControl extends BaseControl {
    private items: LegendItem[] = [];
    private layerManager: LayerManager;

    constructor(options: LegendControlOptions = {}) {
        super({
            position: options.position || 'topright',
            title: options.title || '图例',
            width: options.width || '200px',
            showOpacity: options.showOpacity ?? true
        });
        
        this.layerManager = LayerManager.getInstance();
        
        // 监听图层变化
        this.layerManager.on('layerVisibilityChange', (layerId: string, visible: boolean) => {
            this.emit('visibilityChange', layerId, visible);
            this.notifyUpdate();
        });
        
        this.layerManager.on('layerOpacityChange', (layerId: string, opacity: number) => {
            this.emit('opacityChange', layerId, opacity);
            this.notifyUpdate();
        });
    }

    /**
     * 添加图例项
     */
    addItem(item: LegendItem) {
        try {
            this.items.push(item);
            this.emit('itemAdded', item);
            this.notifyUpdate();
            return this;
        } catch (error) {
            this.notifyError(error);
            return this;
        }
    }

    /**
     * 移除图例项
     */
    removeItem(itemId: string) {
        try {
            const index = this.items.findIndex(item => item.id === itemId);
            if (index > -1) {
                const item = this.items.splice(index, 1)[0];
                this.emit('itemRemoved', item);
                this.notifyUpdate();
            }
            return this;
        } catch (error) {
            this.notifyError(error);
            return this;
        }
    }

    /**
     * 更新图例项
     */
    updateItem(itemId: string, updates: Partial<LegendItem>) {
        try {
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                Object.assign(item, updates);
                this.emit('itemUpdated', item);
                this.notifyUpdate();
            }
            return this;
        } catch (error) {
            this.notifyError(error);
            return this;
        }
    }

    /**
     * 切换图层可见性
     */
    toggleLayer(layerId: string) {
        try {
            const currentVisible = this.layerManager.getLayerState(layerId)?.visible ?? false;
            this.layerManager.setLayerVisibility(layerId, !currentVisible);
            return this;
        } catch (error) {
            this.notifyError(error);
            return this;
        }
    }

    /**
     * 设置图层透明度
     */
    setLayerOpacity(layerId: string, opacity: number) {
        try {
            this.layerManager.setLayerOpacity(layerId, opacity);
            return this;
        } catch (error) {
            this.notifyError(error);
            return this;
        }
    }

    protected createContainer() {
        const container = super.createContainer();
        
        // 创建 Vue 应用
        this.app = this.createApp(Legend, {
            title: this.options.title,
            items: this.items,
            width: this.options.width,
            showOpacity: this.options.showOpacity,
            onVisibilityChange: (layerId: string, visible: boolean) => {
                this.layerManager.setLayerVisibility(layerId, visible);
            },
            onOpacityChange: (layerId: string, opacity: number) => {
                this.layerManager.setLayerOpacity(layerId, opacity);
            }
        });

        // 挂载 Vue 应用
        const el = document.createElement('div');
        container.appendChild(el);
        this.app.mount(el);

        return container;
    }

    protected onMounted() {
        this.emit('ready');
    }

    protected onBeforeUnmount() {
        // 清理事件监听
        this.layerManager.off('layerVisibilityChange');
        this.layerManager.off('layerOpacityChange');
    }
}
