import { defineComponent } from 'vue';

export const BaseComponent = defineComponent({
  emits: ['mounted', 'beforeMount', 'beforeUnmount', 'unmounted', 'update', 'error'],

  mounted() {
    this.$emit('mounted');
  },

  beforeMount() {
    this.$emit('beforeMount');
  },

  beforeUnmount() {
    this.$emit('beforeUnmount');
  },

  unmounted() {
    this.$emit('unmounted');
  },

  methods: {
    /**
     * 通知父组件更新
     */
    notifyUpdate() {
      this.$emit('update');
    },

    /**
     * 通知父组件发生错误
     */
    notifyError(error: any) {
      this.$emit('error', error);
    }
  }
});
