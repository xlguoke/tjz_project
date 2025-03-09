<script setup lang='ts'>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { RoleList } from '@/pages/index/roles/components'
import type { DataSource } from '@/types/roles.d'

export type OnOkData = DataSource

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  // 已选角色id集合
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
const roleRef = ref()

watch(() => props.value, (val) => {
  visible.value = val
})

function onOk() {
  emits('onOk', roleRef.value.selectedRows)
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
    title="选择角色"
    :keyboard="false"
    :mask-closable="false"
    centered
    destroy-on-close
    width="800px"
    @cancel="cancelModal"
    @ok="onOk"
  >
    <div class="h-[70vh]">
      <RoleList
        ref="roleRef"
        selected-mode
        :select-ids="selectedKeys"
      />
    </div>
  </a-modal>
</template>

<style>

</style>
