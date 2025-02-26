<template>
  <div class="legend-container" :style="containerStyle">
    <div class="legend-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="legend-content">
      <div
        v-for="item in items"
        :key="item.id"
        class="legend-item"
        :class="{ 'is-active': isLayerVisible(item.layerId) }"
        @click="handleLayerToggle(item)"
      >
        <div class="legend-symbol" :style="getSymbolStyle(item)"></div>
        <div class="legend-label">{{ item.label }}</div>
        <div class="legend-controls">
          <input
            type="checkbox"
            :checked="isLayerVisible(item.layerId)"
            @change="handleLayerToggle(item)"
          />
          <input
            v-if="showOpacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="getLayerOpacity(item.layerId)"
            @input="handleOpacityChange($event, item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { BaseComponent } from './BaseComponent';
import { LayerManager } from '../LayerManager';

export interface LegendItem {
  id: string;
  label: string;
  layerId: string;
  color?: string;
  symbol?: string;
}

export default defineComponent({
  name: 'Legend',
  extends: BaseComponent,
  props: {
    title: {
      type: String,
      default: '图例'
    },
    items: {
      type: Array as PropType<LegendItem[]>,
      required: true
    },
    width: {
      type: [String, Number],
      default: '200px'
    },
    showOpacity: {
      type: Boolean,
      default: true
    }
  },
  emits: ['error', 'update', 'visibilityChange', 'opacityChange'],
  setup(props, { emit }) {
    const layerManager = LayerManager.getInstance();

    const containerStyle = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width
    }));

    const isLayerVisible = (layerId: string) => {
      try {
        return layerManager.getLayerState(layerId)?.visible ?? false;
      } catch (error) {
        emit('error', error);
        return false;
      }
    };

    const getLayerOpacity = (layerId: string) => {
      try {
        return layerManager.getLayerState(layerId)?.opacity ?? 1;
      } catch (error) {
        emit('error', error);
        return 1;
      }
    };

    const handleLayerToggle = (item: LegendItem) => {
      try {
        const currentVisible = isLayerVisible(item.layerId);
        emit('visibilityChange', item.layerId, !currentVisible);
      } catch (error) {
        emit('error', error);
      }
    };

    const handleOpacityChange = (event: Event, item: LegendItem) => {
      try {
        const opacity = parseFloat((event.target as HTMLInputElement).value);
        emit('opacityChange', item.layerId, opacity);
      } catch (error) {
        emit('error', error);
      }
    };

    const getSymbolStyle = (item: LegendItem) => {
      if (item.symbol) {
        return {
          backgroundImage: `url(${item.symbol})`,
          backgroundColor: 'transparent'
        };
      }
      return {
        backgroundColor: item.color || '#000000'
      };
    };

    return {
      containerStyle,
      isLayerVisible,
      getLayerOpacity,
      handleLayerToggle,
      handleOpacityChange,
      getSymbolStyle
    };
  }
});
</script>

<style>
.legend-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.legend-header {
  margin-bottom: 10px;
}

.legend-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  cursor: pointer;
}

.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.legend-item.is-active {
  opacity: 1;
}

.legend-item:not(.is-active) {
  opacity: 0.5;
}

.legend-symbol {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  margin-right: 8px;
  background-size: cover;
  background-position: center;
}

.legend-label {
  flex: 1;
  font-size: 12px;
}

.legend-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-controls input[type="range"] {
  width: 60px;
  margin: 0;
}
</style>
