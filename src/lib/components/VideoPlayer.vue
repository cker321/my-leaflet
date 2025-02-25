<template>
  <div class="video-player-container">
    <div class="video-player-mock" :style="containerStyle">
      <div class="video-info">
        <div>URL: {{ url }}</div>
        <div>宽度: {{ width }}px</div>
        <div>高度: {{ height }}px</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  url: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 640,
  height: 360
});

const containerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`
}));
</script>

<style scoped>
.video-player-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-player-mock {
  background-color: #000;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

.video-info {
  text-align: center;
  line-height: 1.5;
}
</style>
