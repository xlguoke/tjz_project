<script setup lang='ts'>
import { message } from 'ant-design-vue'
import useMyFetch from '@/composables/useMyFetch'
import type { DetailForm } from '@/types/roles.d'

const emits = defineEmits(['save'])

const spinning = ref(false)
const visible = ref(false)
const submitLoad = ref(false)
const detailFormRef = ref()
const detailForm = ref<DetailForm>({
  name: '',
  description: '',
  permissions: [],
  users: [],
})

const rules = {
  description: [
    { required: true, message: '请输入角色名称' },
  ],
  name: [
    { required: true, message: '请输入角色编码' },
  ],
}

// 获取用户详情
async function getDetailData(id?: string) {
  if (!id)
    return
  spinning.value = true
  const { data, error } = await useMyFetch<DetailForm>(`/roles/${id}`)
  spinning.value = false
  if (error.value || !data.value)
    return

  detailForm.value = { id, ...data.value }
}

// 关闭编辑弹窗
function cancelModal() {
  visible.value = false
  submitLoad.value = false
  detailFormRef.value?.resetFields()
  detailForm.value.id = ''
}

// 保存
async function submit() {
  try {
    await detailFormRef.value?.validateFields()
    submitLoad.value = true

    const form = { ...detailForm.value }
    const { error } = await useMyFetch<DetailForm[]>(`/roles${form.id ? `/${form.id}` : ''}`, {
      method: form.id ? 'PUT' : 'POST',
      body: JSON.stringify(detailForm.value),
    })
    submitLoad.value = false
    if (error.value)
      return
    message.success('保存成功')
    cancelModal()
    emits('save')
  }
  catch (err) {
    console.error('save-user->', err)
  }
  submitLoad.value = false
}

const modalTitle = ref('')
function openModal(title: string, id?: string) {
  modalTitle.value = title
  visible.value = true
  getDetailData(id)
}

defineExpose({
  openModal,
})
</script>

<template>
  <!-- 新增、编辑 -->
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    :keyboard="false"
    :mask-closable="false"
    :confirm-loading="submitLoad"
    centered
    width="600px"
    @cancel="cancelModal"
    @ok="submit"
  >
    <a-spin :spinning="spinning">
      <div class="my-4 max-h-[60vh] min-h-[200px] overflow-auto">
        <a-form
          ref="detailFormRef"
          :model="detailForm"
          :rules="rules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-form-item label="角色名称" name="description">
            <a-input
              v-model:value="detailForm.description"
              :maxlength="200"
              allow-clear
              placeholder="请输入角色名称"
            />
          </a-form-item>
          <a-form-item label="角色编码" name="name">
            <a-input
              v-model:value="detailForm.name"
              :maxlength="50"
              :disabled="!!detailForm.id"
              allow-clear
              placeholder="请输入角色编码"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>
