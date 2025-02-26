import { defineStore } from 'pinia';
import type { Map as LeafletMap } from 'leaflet';

export interface LayerState {
  id: string;
  visible: boolean;
  opacity: number;
  data?: any;
  style?: any;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  layers: Record<string, LayerState>;
  selectedFeatures: Record<string, any>;
  markers: Record<string, any>;
}

export const useMapStore = defineStore('map', {
  state: (): MapState => ({
    center: [39.9042, 116.4074], // 默认北京
    zoom: 10,
    layers: {},
    selectedFeatures: {},
    markers: {}
  }),

  getters: {
    getLayerState: (state) => (layerId: string) => state.layers[layerId],
    getVisibleLayers: (state) => Object.entries(state.layers)
      .filter(([_, layer]) => layer.visible)
      .map(([id]) => id),
    getSelectedFeatures: (state) => state.selectedFeatures,
    getMarkers: (state) => state.markers
  },

  actions: {
    setCenter(lat: number, lng: number) {
      this.center = [lat, lng];
    },

    setZoom(zoom: number) {
      this.zoom = zoom;
    },

    addLayer(layerId: string, state: Partial<LayerState> = {}) {
      this.layers[layerId] = {
        id: layerId,
        visible: true,
        opacity: 1,
        ...state
      };
    },

    updateLayer(layerId: string, updates: Partial<LayerState>) {
      if (this.layers[layerId]) {
        this.layers[layerId] = {
          ...this.layers[layerId],
          ...updates
        };
      }
    },

    removeLayer(layerId: string) {
      delete this.layers[layerId];
    },

    setLayerVisibility(layerId: string, visible: boolean) {
      if (this.layers[layerId]) {
        this.layers[layerId].visible = visible;
      }
    },

    setLayerOpacity(layerId: string, opacity: number) {
      if (this.layers[layerId]) {
        this.layers[layerId].opacity = opacity;
      }
    },

    setLayerData(layerId: string, data: any) {
      if (this.layers[layerId]) {
        this.layers[layerId].data = data;
      }
    },

    setLayerStyle(layerId: string, style: any) {
      if (this.layers[layerId]) {
        this.layers[layerId].style = style;
      }
    },

    selectFeature(layerId: string, featureId: string, feature: any) {
      if (!this.selectedFeatures[layerId]) {
        this.selectedFeatures[layerId] = {};
      }
      this.selectedFeatures[layerId][featureId] = feature;
    },

    unselectFeature(layerId: string, featureId: string) {
      if (this.selectedFeatures[layerId]) {
        delete this.selectedFeatures[layerId][featureId];
      }
    },

    clearSelectedFeatures(layerId?: string) {
      if (layerId) {
        this.selectedFeatures[layerId] = {};
      } else {
        this.selectedFeatures = {};
      }
    },

    addMarker(markerId: string, marker: any) {
      this.markers[markerId] = marker;
    },

    removeMarker(markerId: string) {
      delete this.markers[markerId];
    },

    clearMarkers() {
      this.markers = {};
    }
  }
});
