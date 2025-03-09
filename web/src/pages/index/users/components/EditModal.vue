<script setup lang='ts'>
import { TreeSelect, message } from 'ant-design-vue'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import useMyFetch from '@/composables/useMyFetch'
import UploadAvatar from '@/components/UploadAvatar.vue'
import type { Certificates, DetailForm } from '@/types/users.d'
import type { DataSource as RoleData } from '@/types/roles.d'
import type { DataSource as DepartmentData } from '@/types/departments.d'
import type { PageRes } from '@/types/pagination.d'
import permissionsStore from '@/stores/permissions'

defineProps({
  // 角色选择只读
  readonlyRoles: { type: Boolean, default: false },
})
const emits = defineEmits(['save'])

const SHOW_ALL = TreeSelect.SHOW_ALL

const spinning = ref(false)
const visible = ref(false)
const submitLoad = ref(false)
const detailFormRef = ref()
const detailForm = ref<DetailForm>({
  username: '',
  name: '',
  phone: '',
  roles: [],
  roleIds: [],
  departmentIds: [],
  certificates: [
    { name: '', number: '' },
  ],
})

// 验证手机号
function validPhone(_rules: Rule, value: string) {
  if (value && !(/^1\d{10}$/.test(value))) {
    return Promise.reject(new Error('请输入正确的手机号'))
  }
  return Promise.resolve()
}
const rules = {
  username: [
    { required: true, message: '请输入用户账号' },
  ],
  name: [
    { required: true, message: '请输入用户名称' },
  ],
  phone: [
    { validator: validPhone },
  ],
}

// 获取用户详情
async function getDetailData(id?: string) {
  if (!id)
    return
  spinning.value = true
  const { data, error } = await useMyFetch<DetailForm>(`/users/${id}`)
  spinning.value = false
  if (error.value || !data.value)
    return
  if (!data.value.certificates.length) {
    data.value.certificates = [
      { name: '', number: '' },
    ]
  }
  if (data.value.roles && data.value.roles.length) {
    data.value.roleIds = data.value.roles.map(d => d.id)
  }

  if (data.value.departments && data.value.departments.length) {
    data.value.departmentIds = data.value.departments.map(d => ({ value: d.id, label: d.name }))
  }

  detailForm.value = { id, ...data.value }
}

// 获取角色列表
const search = permissionsStore().isAdmin ? '' : 'name=out=(admin)'
const { execute: getRoleDatas, data: rolesData } = useMyFetch<PageRes<RoleData>>('/roles/list', {
  params: { page: 0, size: 999, search },
}, {
  immediate: false,
})
const rolesOptions = computed(() => {
  if (!rolesData.value)
    return []
  const list: RoleData[] = rolesData.value?.content || []
  return list.map(item => ({
    ...item,
    label: item.description,
    value: item.id,
  }))
})

// 获取机构
const fieldNames = {
  label: 'name',
  value: 'id',
  children: 'subordinates',
}
const { execute: getDepartments, data } = useMyFetch<PageRes<DepartmentData>>('/departments/list', {
  params: { page: 0, size: 999, search: 'superior=isnull=' },
}, {
  immediate: false,
})
// 机构列表 - 此处处理label、value是规避ant的类型报错
const departmentsData = computed(() => {
  return data.value?.content.map(item => ({
    ...item,
    label: item.name,
    value: item.id,
  })) || []
})

// 关闭编辑弹窗
function cancelModal() {
  visible.value = false
  submitLoad.value = false
  detailFormRef.value?.resetFields()
  detailForm.value.id = ''
  detailForm.value.certificates = [{ name: '', number: '' }]
}

// 保存
async function submit() {
  try {
    await detailFormRef.value?.validateFields()
    submitLoad.value = true
    const form = { ...detailForm.value }

    // 角色
    form.roles = []
    if (form.roleIds && form.roleIds.length) {
      form.roles = rolesOptions.value
        .filter(d => form.roleIds.includes(d.id))
        .map(d => ({ id: d.id, name: d.name, description: d.description || '' }))
    }

    // 机构
    form.departments = []
    if (form.departmentIds && form.departmentIds.length) {
      form.departments = form.departmentIds.map(d => ({
        id: d.value,
        name: d.label,
      }))
      delete form.departmentIds
    }

    // 资质
    form.certificates = detailForm.value.certificates.filter(d => !!d.name)

    const { error } = await useMyFetch<DetailForm[]>(`/users${form.id ? `/${form.id}` : ''}`, {
      method: form.id ? 'PUT' : 'POST',
      body: JSON.stringify(form),
    })
    submitLoad.value = false
    if (error.value)
      return
    message.success('保存成功')
    cancelModal()
    emits('save', { ...form })
  }
  catch (err) {
    console.error('save-user->', err)
  }
  submitLoad.value = false
}

// 删除资质
function removeCertificate(item: Certificates) {
  const index = detailForm.value.certificates.indexOf(item)
  if (index !== -1) {
    detailForm.value.certificates.splice(index, 1)
  }
}
// 新增资质
function addCertificate() {
  detailForm.value.certificates.push({
    name: '',
    number: '',
  })
}

const modalTitle = ref('')
function openModal(title: string, id?: string) {
  modalTitle.value = title
  visible.value = true
  getRoleDatas()
  getDepartments()
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
      <div class="my-4 max-h-[60vh] overflow-auto">
        <a-form
          ref="detailFormRef"
          :model="detailForm"
          :rules="rules"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="头像" name="avatar">
            <UploadAvatar v-model:value="detailForm.avatar" />
          </a-form-item>
          <a-form-item label="用户账号" name="username">
            <a-input
              v-model:value="detailForm.username"
              :maxlength="50"
              :disabled="!!detailForm.id"
              allow-clear
              placeholder="请输入用户账号（创建后不可修改）"
            />
          </a-form-item>
          <a-form-item label="用户名称" name="name">
            <a-input v-model:value="detailForm.name" :maxlength="50" allow-clear placeholder="请输入用户名称" />
          </a-form-item>
          <a-form-item label="角色" name="roleIds">
            <a-select
              v-model:value="detailForm.roleIds"
              mode="multiple"
              allow-clear
              :disabled="readonlyRoles"
              :options="rolesOptions"
              placeholder="请选择角色"
            />
          </a-form-item>
          <a-form-item label="所属机构" name="departmentIds">
            <a-tree-select
              v-model:value="detailForm.departmentIds"
              popup-class-name="departments-tree-select"
              style="width: 100%"
              tree-checkable
              show-search
              :tree-data="departmentsData"
              tree-default-expand-all
              allow-clear
              tree-check-strictly
              :show-checked-strategy="SHOW_ALL"
              :field-names="fieldNames"
              placeholder="请选择所属机构"
              tree-node-filter-prop="label"
            />
          </a-form-item>
          <!-- 资质 -->
          <a-form-item class="certificate-form" label="职业资格证书">
            <div
              v-for="(item, index) in detailForm.certificates"
              :key="index"
              class="flex space-form-item"
            >
              <a-form-item
                label=" "
                :name="['certificates', index, 'name']"
                :rules="{
                  required: !!item.number,
                  message: '请输入职业资格证书',
                }"
              >
                <a-input v-model:value="item.name" :maxlength="50" allow-clear placeholder="请输入职业资格证书" />
              </a-form-item>
              <a-form-item :name="['certificates', index, 'number']" mx-2>
                <a-input v-model:value="item.number" :maxlength="50" allow-clear placeholder="请输入证书编号" />
              </a-form-item>
              <div class="flex gap-2 w-[40px] h-[32px]">
                <PlusCircleOutlined @click="addCertificate" />
                <MinusCircleOutlined v-if="detailForm.certificates.length > 1" @click="removeCertificate(item)" />
              </div>
            </div>
          </a-form-item>
          <a-form-item label="手机号" name="phone">
            <a-input v-model:value="detailForm.phone" :maxlength="20" allow-clear placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="职位" name="title">
            <a-input v-model:value="detailForm.title" :maxlength="50" allow-clear placeholder="请输入职位" />
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<style scoped>
.certificate-form {
  margin-bottom: 0;
}
.certificate-form .space-form-item :deep(.ant-form-item-label) {
  height: 32px;
}
.certificate-form .space-form-item :deep(.ant-form-item-label > label) {
  width: 11px;
}
.certificate-form :deep(.ant-form-item-required::after),
.certificate-form .space-form-item :deep(.ant-form-item-label > label:after) {
  display: none;
}
</style>
