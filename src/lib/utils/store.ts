import { createPinia } from 'pinia';
import type { App } from 'vue';

// 全局 pinia 实例
let pinia: ReturnType<typeof createPinia> | null = null;

export function initializeStore() {
  if (!pinia) {
    pinia = createPinia();
  }
  return pinia;
}

export function getStore() {
  if (!pinia) {
    throw new Error('Store not initialized. Call initializeStore first.');
  }
  return pinia;
}

export function installStore(app: App) {
  const store = initializeStore();
  app.use(store);
  return app;
}
