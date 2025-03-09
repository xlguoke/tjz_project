<script setup lang="ts">
import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { PlusOutlined, UserOutlined } from '@ant-design/icons-vue'
import EditModal from './EditModal.vue'
import type { DataSource, EmitData, Query } from '@/types/roles.d'
import { useTableHooks } from '@/composables/useTableHooks'
import useMyFetch from '@/composables/useMyFetch'
import permissionsStore from '@/stores/permissions'

const props = defineProps<{
  selectedMode?: boolean // 是否开启选择模式（目前仅支持多选）
  selectIds?: string[] // 已选用户id，多个用逗号分隔
}>()
const emits = defineEmits<{
  (e: 'setPermissions', data: EmitData): void
}>()

// 列
const columns = [
  {
    title: '角色名称',
    dataIndex: 'description',
  },
  {
    title: '角色编码',
    dataIndex: 'name',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 220,
  },
]

if (props.selectedMode) {
  columns.pop()
}

// 查询数据
const query = ref<Query>({})
const formRef = ref<FormInstance>()

// 开启选择模式时，初始化查询条件
watchEffect(() => {
  if (props.selectIds) {
    query.value.id = props.selectIds.join(',') || ''
  }
  else {
    delete query.value.id
  }
})

// 当前登录账号非管理员时，不查询管理员角色
if (!permissionsStore().isAdmin) {
  query.value.name = 'admin'
}

const {
  loading,
  dataSource,
  tableBoxRef,
  tableHeight,
  selectedRows,
  getList,
  handleSearch,
  handleReset,
  getPagination,
  getRowSelection,
} = useTableHooks<DataSource>({
  api: `/roles${props.selectedMode ? '/list' : ''}`,
  formRef,
  query,
  sqlQuery: {
    name: '$k=out=($v)',
    id: '$k=out=($v)',
  },
  sorts: {
    'auditMeta.createdAt': 'desc',
  },
})

const editModalRef = ref()
// 新增
function add() {
  editModalRef.value.openModal('新增')
}

// 编辑
function editRow(id: string) {
  editModalRef.value.openModal('编辑', id)
}

// 删除
function delRow(id: string) {
  Modal.confirm({
    title: '删除确认',
    content: '确定删除这条数据吗？',
    centered: true,
    async onOk() {
      const { error } = await useMyFetch(`/roles/${id}`, { method: 'DELETE' })
      if (error.value)
        return
      message.success('删除成功')
      getList()
    },
  })
}

// 设置用户
function usersRow(obj: DataSource) {
  emits('setPermissions', {
    roleInfo: obj,
    type: 'users',
  })
}

// 设置权限
function authRow(obj: DataSource) {
  emits('setPermissions', {
    roleInfo: obj,
    type: 'permissions',
  })
}

defineExpose({
  selectedRows,
  getList,
})
</script>

<template>
  <!-- 快捷查询 -->
  <a-form ref="formRef" :model="query" layout="inline" mb-2>
    <a-form-item name="description">
      <a-input
        v-model:value.trim="query.description"
        allow-clear
        placeholder="请输入角色名称查询"
        @press-enter="handleSearch"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="handleSearch">
          查询
        </a-button>
        <a-button @click="handleReset">
          重置
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <!-- 操作栏 -->
  <a-space v-if="!selectedMode" mb-1>
    <a-button v-permission="'roles:create'" type="text" :icon="h(PlusOutlined)" @click="add">
      新增
    </a-button>
  </a-space>
  <!-- 表格 -->
  <div ref="tableBoxRef" flex-1 h-0>
    <a-table
      row-key="id"
      :columns="columns"
      :data-source="dataSource"
      :row-selection="selectedMode ? getRowSelection() : undefined"
      :pagination="getPagination()"
      :loading="loading"
      :scroll="{ y: tableHeight }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <a-avatar v-if="text" shape="square" :src="text" />
          <a-avatar v-else shape="square">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button v-permission="'roles:user'" type="link" size="small" @click="usersRow(record as DataSource)">
            用户
          </a-button>
          <a-button v-permission="'roles:permission'" type="link" size="small" @click="authRow(record as DataSource)">
            权限
          </a-button>
          <a-button v-permission="'roles:update'" type="link" size="small" @click="editRow(record.id)">
            编辑
          </a-button>
          <a-button
            v-if="record.name !== 'admin'"
            v-permission="'roles:delete'"
            type="link"
            size="small"
            danger
            @click="delRow(record.id)"
          >
            删除
          </a-button>
        </template>
        <template v-else>
          <div class="text-ellipsis-2" :title="text">
            {{ text }}
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <EditModal ref="editModalRef" @save="getList" />
</template>

<style scoped>
.text-ellipsis-2 {
  max-height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
