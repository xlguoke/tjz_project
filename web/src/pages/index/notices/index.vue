<script setup lang="ts">
import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useDateFormat } from '@vueuse/core'
import { EditModal } from './components'
import useMyFetch from '@/composables/useMyFetch'
import { useTableHooks } from '@/composables/useTableHooks'
import type { DataSource, Query } from '@/types/notices.d'

// 列
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    width: '30%',
  },
  {
    title: '阅读期限',
    dataIndex: 'noticeTerm',
  },
  {
    title: '是否必读',
    dataIndex: 'mustRead',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '创建日期',
    dataIndex: 'auditMeta',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 160,
  },
]

// 查询数据
const query = ref<Query>({})

const formRef = ref<FormInstance>()
const {
  loading,
  dataSource,
  tableBoxRef,
  tableHeight,
  getList,
  handleSearch,
  handleReset,
  getPagination,
} = useTableHooks<DataSource>({
  api: '/notices',
  formRef,
  query,
  sqlQuery: {
    fuzzy: {
      type: 'fuzzy',
      fields: ['title', 'details'],
    },
    status: '$k==$v',
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

// 撤回
function inactiveRow(id: string) {
  Modal.confirm({
    title: '撤回确认',
    content: '确定撤回这条数据吗？',
    centered: true,
    async onOk() {
      const { error } = await useMyFetch(`/notices/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'INACTIVE' }),
      })
      if (error.value)
        return
      message.success('撤回成功')
      getList()
    },
  })
}

// 删除
function delRow(id: string) {
  Modal.confirm({
    title: '删除确认',
    content: '确定删除这条数据吗？',
    centered: true,
    async onOk() {
      const { error } = await useMyFetch(`/notices/${id}`, { method: 'DELETE' })
      if (error.value)
        return
      message.success('删除成功')
      getList()
    },
  })
}

definePage({
  meta: {
    title: '公告管理',
    authName: 'notices',
  },
})
</script>

<template>
  <div h-full flex flex-col>
    <!-- 快捷查询 -->
    <a-form ref="formRef" :model="query" layout="inline" mb-2>
      <a-form-item name="fuzzy">
        <a-input
          v-model:value.trim="query.fuzzy"
          allow-clear
          placeholder="请输入标题、内容查询"
          @press-enter="handleSearch"
        />
      </a-form-item>
      <a-form-item name="status">
        <a-select
          v-model:value="query.status"
          style="width: 120px"
          allow-clear
          placeholder="请选择状态"
          @change="handleSearch"
        >
          <a-select-option value="OPEN">
            未发布
          </a-select-option>
          <a-select-option value="ACTIVE">
            已发布
          </a-select-option>
          <a-select-option value="INACTIVE">
            撤回
          </a-select-option>
        </a-select>
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
    <a-space mb-1>
      <a-button v-permission="'notices:create'" type="text" :icon="h(PlusOutlined)" @click="add">
        新增
      </a-button>
    </a-space>
    <!-- 表格 -->
    <div ref="tableBoxRef" flex-1 h-0>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination()"
        :loading="loading"
        row-key="id"
        :scroll="{ y: tableHeight }"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'noticeTerm'">
            {{ text ? useDateFormat(text, 'YYYY-MM-DD') : '' }}
          </template>
          <template v-else-if="column.dataIndex === 'mustRead'">
            {{ text ? '是' : '否' }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <span v-if="text === 'ACTIVE'" text-green>已发布</span>
            <span v-else-if="text === 'INACTIVE'" text-red>已撤回</span>
            <span v-else>未发布</span>
          </template>
          <template v-else-if="column.dataIndex === 'auditMeta'">
            {{ text && text.createdAt ? useDateFormat(text.createdAt, 'YYYY-MM-DD HH:mm:ss') : '' }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-button
              v-if="record.status !== 'ACTIVE'"
              v-permission="'notices:update'"
              type="link"
              size="small"
              @click="editRow(record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-if="record.status === 'ACTIVE'"
              v-permission="'notices:status'"
              type="link"
              size="small"
              @click="inactiveRow(record.id)"
            >
              <span text-orange>撤回</span>
            </a-button>
            <a-button
              v-if="record.username !== 'admin'"
              v-permission="'notices:delete'"
              type="link"
              size="small"
              danger
              @click="delRow(record.id)"
            >
              删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>

    <EditModal ref="editModalRef" @save="getList" />
  </div>
</template>
