<script setup lang='ts'>
import { TreeSelect, message } from 'ant-design-vue'
import { CloseCircleFilled } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import useMyFetch from '@/composables/useMyFetch'
import useSqlQuery from '@/composables/useSqlQuery'
import { AUTH_TYPE } from '@/types/notices.d'
import type { DetailForm } from '@/types/notices.d'
import type { DataSource as DepartmentData } from '@/types/departments.d'
import type { PageRes } from '@/types/pagination.d'
import type { OnOkData as RoleSelRows } from '@/components/SelectedRole.vue'
import type { OnOkData as UserSelRows } from '@/components/SelectedUser.vue'
import WEditor from '@/components/WEditor.vue'
import SelectedRole from '@/components/SelectedRole.vue'
import SelectedUser from '@/components/SelectedUser.vue'

interface Options {
  label: string
  value: string
}

const emits = defineEmits(['save'])
const SHOW_ALL = TreeSelect.SHOW_ALL
const spinning = ref(false)
const visible = ref(false)
const submitLoad = ref(false)
const detailFormRef = ref()
const detailForm = ref<DetailForm>({
  title: '',
  mustRead: false,
  type: 'ALL',
  idList: [],
})
// 发布类型
const releaseType = ref('1')
const roleVisible = ref(false)
const userVisible = ref(false)
const selectedKeys = ref<string[]>([])
const authTypeOptions = ref<Options[]>([])

const rules = {
  title: [
    { required: true, message: '请输入标题' },
  ],
  details: [
    { required: true, message: '请输入内容' },
  ],
  noticeTerm: [
    { required: true, message: '请选择阅读期限' },
  ],
  type: [
    { required: true, message: '请选择授权级别' },
  ],
  minTime: [
    { required: true, message: '请输入最小阅读时长' },
  ],
  mustReadTerm: [
    { required: true, message: '请选择必读期限' },
  ],
  releaseTerm: [
    { required: true, message: '请选择发布时间' },
  ],
}

// 获取机构列表
const fieldNames = {
  children: 'subordinates',
  label: 'name',
  value: 'id',
}
const departmentsData = ref<DepartmentData[]>([])
async function getDepartments() {
  spinning.value = true
  const { data, error } = await useMyFetch<PageRes<DepartmentData>>('/departments/list', {
    params: { page: 0, size: 999, search: 'superior=isnull=' },
  })
  if (!error.value && data.value) {
    // 机构列表 - 此处处理label、value是规避ant的类型报错
    departmentsData.value = data.value.content.map(item => ({
      ...item,
      label: item.name,
      value: item.id,
    }),
    )
  }
  spinning.value = false
}

// 获取已选的用户列表 - 用于回显
async function getUserDatas(ids: string[]) {
  if (!ids || ids.length === 0)
    return
  const { initQueryParams } = useSqlQuery({
    isPagination: false,
    query: ref({
      id: ids.join(','),
    }),
    sqlQuery: {
      id: '$k=in=($v)',
    },
  })
  const { data, error } = await useMyFetch<PageRes<UserSelRows>>('/users/list', {
    params: initQueryParams(),
  })
  if (error.value)
    return ''
  const list = data.value?.content || []
  authTypeOptions.value = list.map(d => ({
    value: d.id,
    label: d.name,
  }))
}

// 获取已选的角色列表 - 用于回显
async function getRoleDatas(ids: string[]) {
  if (!ids || ids.length === 0)
    return
  const { initQueryParams } = useSqlQuery({
    isPagination: false,
    query: ref({
      id: ids.join(','),
    }),
    sqlQuery: {
      id: '$k=in=($v)',
    },
  })
  const { data, error } = await useMyFetch<PageRes<RoleSelRows>>('/roles/list', {
    params: initQueryParams(),
  })
  if (error.value)
    return ''
  const list = data.value?.content || []
  authTypeOptions.value = list.map(d => ({
    value: d.id,
    label: d.description || d.name,
  }))
}

// 获取用户详情
async function getDetailData(id?: string) {
  if (!id)
    return
  spinning.value = true
  const { data, error } = await useMyFetch<DetailForm>(`/notices/${id}`)
  if (error.value || !data.value) {
    spinning.value = false
    return
  }
  if (!data.value.type) {
    data.value.type = 'ALL'
  }
  if (data.value.releaseTerm) {
    releaseType.value = '2'
  }
  if (data.value.type === 'DEPART') {
    getDepartments()
  }
  else if (data.value.type === 'USER') {
    await getUserDatas(data.value.idList)
  }
  else if (data.value.type === 'ROLE') {
    await getRoleDatas(data.value.idList)
  }
  detailForm.value = { id, ...data.value }
  spinning.value = false
}

// 切换授权级别
function changeAuthType() {
  detailForm.value.idList = []
  detailFormRef.value.clearValidate('idList')
  if (detailForm.value.type === 'DEPART') {
    getDepartments()
  }
  clearAuthType()
}

// 选择角色或用户
function chooseAuthType() {
  const { type, idList = [] } = detailForm.value
  selectedKeys.value = [...idList]
  if (type === 'ROLE') {
    roleVisible.value = true
  }
  else if (type === 'USER') {
    userVisible.value = true
  }
}

// 获取选择的授权角色
function getRoleScope(list: RoleSelRows[]) {
  const options = list.map(d => ({
    label: d.description || d.name,
    value: d.id,
  }))
  initAuthTypeOptions(options)
}

// 获取选择的授权用户
function getUserScope(list: UserSelRows[]) {
  const options = list.map(d => ({
    label: d.name,
    value: d.id,
  }))
  initAuthTypeOptions(options)
}

// 设置授权级别对应的数据
function initAuthTypeOptions(list: Options[]) {
  detailFormRef.value.clearValidate('idList')
  authTypeOptions.value = list
  detailForm.value.idList = list.map(d => d.value)
}

// 清空授权级别
function clearAuthType() {
  authTypeOptions.value = []
  detailForm.value.idList = []
}

// 删除单个授权
function delAuthType(ind: number) {
  authTypeOptions.value.splice(ind, 1)
  detailForm.value.idList.splice(ind, 1)
}

// 保存
async function submit() {
  try {
    await detailFormRef.value?.validateFields()
    submitLoad.value = true
    const form: any = { ...detailForm.value }
    // 授权级别为机构时，选中项数据为 {label: '',value:''}
    if (form.idList && form.idList.length > 0 && typeof form.idList[0] === 'object') {
      form.idList = form.idList.map((d: Options) => d.value)
    }
    // 非必读时，清除必读期限和最小阅读时间
    if (!form.mustRead) {
      delete form.mustReadTerm
      delete form.minTime
    }

    const { error } = await useMyFetch<DetailForm[]>(`/notices${form.id ? `/${form.id}` : ''}`, {
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

// 禁用当天以前的日期
function disabledDate(current: Dayjs) {
  return current && current < dayjs().subtract(1, 'day')
}

// 关闭编辑弹窗
function cancelModal() {
  visible.value = false
  submitLoad.value = false
  detailFormRef.value?.resetFields()
  detailForm.value.id = ''
  detailForm.value.mustReadTerm = undefined
  detailForm.value.minTime = undefined
  releaseType.value = '1'
  authTypeOptions.value = []
  selectedKeys.value = []
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
    destroy-on-close
    centered
    width="1100px"
    @cancel="cancelModal"
    @ok="submit"
  >
    <a-spin :spinning="spinning">
      <div class="my-4 max-h-[70vh] overflow-auto">
        <a-form
          ref="detailFormRef"
          :model="detailForm"
          :rules="rules"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-item label="标题" name="title">
            <a-input
              v-model:value="detailForm.title"
              :maxlength="100"
              allow-clear
              placeholder="请输入标题"
            />
          </a-form-item>
          <a-form-item label="内容" name="details">
            <WEditor v-model:value="detailForm.details" />
          </a-form-item>
          <!-- 授权级别 -->
          <a-form-item label="授权级别" name="type">
            <a-radio-group v-model:value="detailForm.type" @change="changeAuthType">
              <a-radio v-for="(v, k) in AUTH_TYPE" :key="k" :value="k">
                {{ v }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="detailForm.type !== 'ALL'"
            :label="`${AUTH_TYPE[detailForm.type]}授权`"
            :rules="[{ required: true, message: `请选择授权${AUTH_TYPE[detailForm.type]}` }]"
            name="idList"
          >
            <a-tree-select
              v-if="detailForm.type === 'DEPART'"
              v-model:value="detailForm.idList"
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
            <a-flex v-else align="center" class="auth-type-box">
              <div class="flex-1 w-0 h-full mr-2 flex flex-wrap gap-y-1" @click="chooseAuthType">
                <span v-show="authTypeOptions.length === 0" text-gray-3>
                  选择授权{{ AUTH_TYPE[detailForm.type] }}
                </span>
                <a-tag v-for="(d, i) in authTypeOptions" :key="d.value" closable @close="delAuthType(i)">
                  {{ d.label }}
                </a-tag>
              </div>
              <CloseCircleFilled
                v-show="authTypeOptions.length > 0"
                class="close-icon"
                color="#BFBFBF"
                @click="clearAuthType"
              />
            </a-flex>
          </a-form-item>
          <!-- 是否必读 -->
          <a-form-item label="是否必读" name="mustRead">
            <a-switch v-model:checked="detailForm.mustRead" />
          </a-form-item>
          <a-form-item
            v-if="detailForm.mustRead"
            label="必读期限"
            name="mustReadTerm"
          >
            <a-date-picker
              v-model:value="detailForm.mustReadTerm"
              style="width:50%"
              allow-clear
              value-format="YYYY-MM-DD"
              placeholder="请选择必读期限"
              :disabled-date="disabledDate"
            />
          </a-form-item>
          <a-form-item v-if="detailForm.mustRead" label="最小阅读时长" name="minTime">
            <a-flex align="center">
              <a-input-number
                v-model:value="detailForm.minTime"
                :min="0"
                :max="60"
                style="width:50%"
                allow-clear
                placeholder="请输入最小阅读时长"
              />
              <span ml-2>秒</span>
            </a-flex>
          </a-form-item>
          <a-form-item label="阅读期限" name="noticeTerm">
            <a-date-picker
              v-model:value="detailForm.noticeTerm"
              style="width:50%"
              allow-clear
              value-format="YYYY-MM-DD"
              placeholder="请选择阅读期限"
              :disabled-date="disabledDate"
            />
          </a-form-item>
          <a-form-item label="发布时间" :rules="[{ required: true }]">
            <a-flex align="center">
              <a-form-item>
                <a-radio-group
                  v-model:value="releaseType"
                  @change="detailForm.releaseTerm = ''"
                >
                  <a-radio value="1">
                    立即发布
                  </a-radio>
                  <a-radio value="2">
                    定时发布
                  </a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item
                v-if="releaseType === '2'"
                name="releaseTerm"
              >
                <a-date-picker
                  v-model:value="detailForm.releaseTerm"
                  :disabled-date="disabledDate"
                  style="width:100%"
                  show-time
                  allow-clear
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择发布时间"
                />
              </a-form-item>
            </a-flex>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>

    <!-- 选择角色 -->
    <SelectedRole v-model:value="roleVisible" :selected-keys="selectedKeys" @on-ok="getRoleScope" />
    <!-- 选择用户 -->
    <SelectedUser v-model:value="userVisible" :selected-keys="selectedKeys" @on-ok="getUserScope" />
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
:deep(.custom-disabled .ant-select-selector) {
  background: transparent !important;
  cursor: initial !important;
}
.auth-type-box {
  padding: 4px 11px;
  min-height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: 0.2s;
  cursor: text;
}
.auth-type-box:hover {
  border-color: #288afa;
}

.auth-type-box .close-icon {
  cursor: pointer;
  transition: 0.2s;
  opacity: 0;
}
.auth-type-box .close-icon:hover {
  color: rgba(0, 0, 0, 0.45);
}
.auth-type-box:hover .close-icon {
  opacity: 1;
}
</style>
