<!-- ChangeCenter.vue -->
<template>
  <div class="change-center-container">
    <div class="input-group">
      <input
        type="number"
        v-model="latitude"
        placeholder="纬度"
        step="0.000001"
        class="coordinate-input"
      />
      <input
        type="number"
        v-model="longitude"
        placeholder="经度"
        step="0.000001"
        class="coordinate-input"
      />
      <button @click="handleChangeCenter" class="change-center-btn">
        跳转
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Map as LeafletMap } from 'leaflet';
// import * as L from 'leaflet';

interface Props {
  map?: LeafletMap;
  zoom?: number;
  animateDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 13,
  animateDuration: 1
});

const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);

const handleChangeCenter = () => {
  if (!props.map || latitude.value === null || longitude.value === null) return;

  props.map.flyTo(
    [latitude.value, longitude.value],
    props.zoom,
    {
      duration: props.animateDuration
    }
  );
};

// 暴露方法给外部使用
defineExpose({
  setCenter: (lat: number, lng: number) => {
    latitude.value = lat;
    longitude.value = lng;
    handleChangeCenter();
  }
});
</script>

<style>
.leaflet-control-changeCenter {
  background: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
  cursor: auto;
}

.change-center-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group {
  display: flex;
  gap: 5px;
  align-items: center;
}

.coordinate-input {
  width: 90px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 12px;
}

.coordinate-input:focus {
  outline: none;
  border-color: #409eff;
}

.change-center-btn {
  padding: 4px 8px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.change-center-btn:hover {
  background-color: #66b1ff;
}

.change-center-btn:active {
  background-color: #3a8ee6;
}
</style>
