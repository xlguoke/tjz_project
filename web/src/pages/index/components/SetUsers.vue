<script setup lang='ts'>
import { Modal, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { DataSource as UserData } from '@/types/users.d'
import type { RoleUser } from '@/types/roles.d'
import useTableHeight from '@/composables/useTableHeight'
import permissionsStore from '@/stores/permissions'
import SelectedUser from '@/components/SelectedUser.vue'
import type { OnOkData } from '@/components/SelectedUser.vue'

const props = defineProps<{
  selectedDatas: RoleUser[]
  permissionCode: string // 权限编码
}>()
const emits = defineEmits<{
  (e: 'del', obj: RoleUser): void
  (e: 'save', data: UserData[], cb: (d: any) => void): void
}>()
const pStore = permissionsStore()
// 初始化表格高度
const { tableBoxRef, tableHeight } = useTableHeight(false)

// 列
const columns = [
  {
    title: '用户账号',
    dataIndex: 'username',
  },
  {
    title: '用户名称',
    dataIndex: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 70,
  },
]

if (!pStore.hasPermission(props.permissionCode)) {
  columns.pop()
}

const dataSource = ref<RoleUser[]>([])
const userIds = computed(() => dataSource.value.map(item => item.id))
watch(
  () => props.selectedDatas,
  (list) => {
    dataSource.value = list
  },
  {
    immediate: true,
  },
)

const visible = ref(false)
const submitLoad = ref(false)
// 添加用户
function addUser() {
  visible.value = true
}

// 删除用户
function delRow(obj: RoleUser) {
  Modal.confirm({
    title: '删除确认',
    content: '确定删除这条数据吗？',
    centered: true,
    async onOk() {
      emits('del', obj)
    },
  })
}

// 保存选择的用户
async function saveRoleUser(rows: OnOkData[]) {
  submitLoad.value = true
  if (rows.length === 0) {
    message.info('未修改用户信息')
    submitLoad.value = false
    visible.value = false
    return
  }
  emits('save', rows, (saveSuccess: boolean) => {
    submitLoad.value = false
    if (saveSuccess)
      visible.value = false
  })
}
</script>

<template>
  <div
    flex
    flex-col
    h-full
    overflow-auto
  >
    <div v-if="pStore.hasPermission(permissionCode)" p-1>
      <a-button type="text" @click="addUser">
        <PlusOutlined />添加用户
      </a-button>
    </div>
    <div ref="tableBoxRef" h-0 flex-1>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ y: tableHeight }"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            {{ text === 'ACTIVE' ? '启用' : '禁用' }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-button type="link" size="small" danger @click="delRow(record as RoleUser)">
              删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <SelectedUser v-model:value="visible" :selected-keys="userIds" @on-ok="saveRoleUser" />
</template>
