<script setup lang='ts'>
import { ref } from 'vue'
import type { PropType } from 'vue'
import Users from '@/pages/index/users/index.vue'
import type { DataSource } from '@/types/users.d'

export type OnOkData = DataSource
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  // 已选用户id集合
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const emits = defineEmits<{
  (e: 'update:value', data?: boolean): () => void
  (e: 'onOk', val: OnOkData[]): () => void
  (e: 'onCancel'): () => void
}>()

const visible = ref(false)
const userRef = ref()

watch(() => props.value, (val) => {
  visible.value = val
})

function onOk() {
  emits('onOk', userRef.value.selectedRows)
  cancelModal()
}

function cancelModal() {
  visible.value = false
  emits('update:value', false)
  emits('onCancel')
}
</script>

<template>
  <a-modal
    v-model:open="visible"
    title="选择用户"
    :keyboard="false"
    :mask-closable="false"
    centered
    destroy-on-close
    width="1000px"
    @cancel="cancelModal"
    @ok="onOk"
  >
    <div class="h-[70vh]">
      <Users
        ref="userRef"
        selected-mode
        :select-ids="selectedKeys"
      />
    </div>
  </a-modal>
</template>

<style>

</style>
