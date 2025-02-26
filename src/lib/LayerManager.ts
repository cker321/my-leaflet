import { useMapStore } from './stores/map';
import type { LayerState } from './stores/map';

export class LayerManager {
  private static instance: LayerManager;

  private constructor() {}

  public static getInstance(): LayerManager {
    if (!LayerManager.instance) {
      LayerManager.instance = new LayerManager();
    }
    return LayerManager.instance;
  }

  public addLayer(layerId: string, options: Partial<LayerState> = {}) {
    const store = useMapStore();
    store.addLayer(layerId, options);
  }

  public removeLayer(layerId: string) {
    const store = useMapStore();
    store.removeLayer(layerId);
  }

  public updateLayer(layerId: string, updates: Partial<LayerState>) {
    const store = useMapStore();
    store.updateLayer(layerId, updates);
  }

  public setLayerVisibility(layerId: string, visible: boolean) {
    const store = useMapStore();
    store.setLayerVisibility(layerId, visible);
  }

  public setLayerOpacity(layerId: string, opacity: number) {
    const store = useMapStore();
    store.setLayerOpacity(layerId, opacity);
  }

  public getLayerState(layerId: string): LayerState | undefined {
    const store = useMapStore();
    return store.getLayerState(layerId);
  }

  public getVisibleLayers(): string[] {
    const store = useMapStore();
    return store.getVisibleLayers;
  }

  public setLayerData(layerId: string, data: any) {
    const store = useMapStore();
    store.setLayerData(layerId, data);
  }

  public setLayerStyle(layerId: string, style: any) {
    const store = useMapStore();
    store.setLayerStyle(layerId, style);
  }
}
