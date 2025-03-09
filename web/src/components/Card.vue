<script setup lang='ts'>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleIcon: {
    type: String,
    default: '',
  },
  loading: Boolean,
  hideMore: Boolean,
})

const emits = defineEmits(['more'])

const _titleIcon = ref('')
if (props.titleIcon) {
  _titleIcon.value = new URL(`../assets/images/${props.titleIcon}`, import.meta.url).href
}

function moreFun() {
  emits('more')
}
</script>

<template>
  <a-card class="custom-card">
    <template #title>
      <div class="flex items-center">
        <img v-if="_titleIcon" :src="_titleIcon" class="card-title-icon">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
    </template>
    <template #extra>
      <a v-if="!hideMore" href="#" class="text-blue-500 flex items-center" @click="moreFun">
        查看更多<i class="i-arrow-right ml-1" />
      </a>
    </template>
    <a-spin :spinning="loading">
      <a-flex vertical class="h-full w-full">
        <div px-2>
          <slot name="alert"></slot>
        </div>

        <slot />
      </a-flex>
    </a-spin>
  </a-card>
</template>

<style scoped>
.card-title-icon {
  display: block;
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px rgba(0, 102, 236, 0.3);
}

.custom-card {
  display: flex;
  flex-direction: column;
  border: none;
  overflow: hidden;
  border-radius: 8px;
}
.custom-card :deep(.ant-card-head) {
  padding-left: 0;
  background-color: #fafafa;
  min-height: 50px;
  border-bottom: none;
}
.custom-card :deep(.ant-card-head-title) {
  padding: 12px 0 12px 24px;
  overflow-y: auto;
}
.custom-card :deep(.ant-card-body) {
  padding: 8px 0;
  flex: 1;
  height: 0;
  overflow: hidden;
}

:deep(.ant-spin-nested-loading),
:deep(.ant-spin-nested-loading > div) {
  height: 100%;
}
</style>
