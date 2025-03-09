<script setup lang="ts">
import { message } from 'ant-design-vue'
import { MenuList, RoleList, SetUsers } from './components'
import type { DataSource as UserData } from '@/types/users.d'
import type { DataSource, EmitData, HandleType, RoleUser } from '@/types/roles.d'
import useMyFetch from '@/composables/useMyFetch'

// 权限菜单
const type = ref<HandleType>('users')
const roleInfo = ref<DataSource>()
const api = ref(``)

// 获取角色详情：角色下的用户列表和权限列表
const { data, execute } = useMyFetch<DataSource>(api, {
  method: 'GET',
}, { immediate: false })

const permissionKeys = computed(() => data.value?.permissions.map(d => d.name) || [])

// 设置权限
function setPermissions(data: EmitData) {
  type.value = data.type
  roleInfo.value = data.roleInfo
  api.value = `/roles/${roleInfo.value?.id}`
  execute()
}

// 删除角色下用户
async function delRoleUser(obj: RoleUser) {
  const { error } = await useMyFetch(`/roles/${roleInfo.value?.id}/user`, {
    method: 'DELETE',
    body: JSON.stringify({
      users: [{ id: obj.id, username: obj.username }],
    }),
  })
  if (error.value)
    return ''
  message.success('删除成功')
  execute()
}

// 保存角色下的用户
async function saveRoleUser(rows: UserData[], cb: (bol: boolean) => void) {
  const users = rows.map(d => ({ id: d.id, username: d.username }))
  const { error } = await useMyFetch(`/roles/${roleInfo.value?.id}/user`, {
    method: 'PUT',
    body: JSON.stringify({
      users,
    }),
  })
  if (error.value)
    return cb(false)
  message.success('保存成功')
  cb(true)
  refreshList()
  execute()
}

// 保存角色权限
async function saveRoleAuth(keys: string[], cb: (bol: boolean) => void) {
  const permissions = keys.map(d => ({ name: d }))
  const { error } = await useMyFetch(`/roles/${roleInfo.value?.id}/permission`, {
    method: 'PUT',
    body: JSON.stringify({
      permissions,
    }),
  })
  if (error.value)
    return cb(false)
  message.success('保存成功')
  refreshList()
  execute()
  cb(true)
}

// 刷新角色列表
const roleListRef = ref()
function refreshList() {
  roleListRef.value.getList()
}

// 路由meta标题
definePage({
  meta: {
    title: '角色管理',
    authName: 'roles',
  },
})
</script>

<template>
  <div class="flex h-full">
    <!-- 角色列表 -->
    <div class="h-full mr-[24px] flex-1">
      <a-card
        title="角色列表"
        class="h-full"
        :head-style="{ padding: '0 16px', minHeight: '48px' }"
        :body-style="{ padding: '12px 16px', display: 'flex', flexDirection: 'column' }"
      >
        <RoleList ref="roleListRef" @set-permissions="setPermissions" />
      </a-card>
    </div>
    <!-- 权限设置 -->
    <div class="w-2/5 h-full">
      <a-card
        title="权限设置"
        class="h-full"
        :head-style="{ padding: '0 16px', minHeight: '48px' }"
        :body-style="{ padding: '0', display: 'flex', flexDirection: 'column' }"
      >
        <div
          v-if="!!type"
          px-4
          py-2
          flex
          justify-between
          items-center
          border-b
          border-b-dashed
          border-b-gray-300
        >
          <div py-2>
            <span font-600 mr-3>{{ type === 'users' ? '用户' : '权限' }}列表</span>
            <span>当前设置角色：{{ roleInfo?.description }}</span>
          </div>
        </div>
        <!-- 用户列表 -->
        <SetUsers
          v-if="type === 'users'"
          permission-code="roles:user"
          :selected-datas="data?.users || []"
          @del="delRoleUser"
          @save="saveRoleUser"
        />
        <!-- 权限菜单 -->
        <MenuList
          v-else-if="type === 'permissions'"
          permission-code="roles:permission"
          :selected-keys="permissionKeys"
          :role-name="roleInfo?.name"
          @save="saveRoleAuth"
        />
        <p
          v-else
          class="mt-1/2 text-center text-4 color-gray "
        >
          点击角色列表用户或权限按钮设置
        </p>
      </a-card>
    </div>
  </div>
</template>
