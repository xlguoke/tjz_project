<script setup lang='ts'>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import MenuItem from './MenuItem.vue'
import permissionStores from '@/stores/permissions'

interface AuthKey {
  [key: string]: boolean
}
const { userPermissions } = storeToRefs(permissionStores())

const router = useRouter()
const route = useRoute()
const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>([])
const menuRoutes = ref<RouteRecordRaw[]>([])

// 需要展示的路由（仅后台管理的路由）
const visibleRoutes = routes.filter(route => route.name === '/admin')
// 提取所有用于菜单的路由
const allMenu = visibleRoutes.length ? visibleRoutes[0].children || [] : []
watch(userPermissions.value, () => {
  // 通过权限过滤路由
  if (userPermissions.value.length === 0) {
    menuRoutes.value = []
  }
  else {
    const authKes: AuthKey = {}
    for (let i = 0; i < userPermissions.value.length; i++) {
      const item = userPermissions.value[i]
      authKes[item] = true
    }
    menuRoutes.value = allMenu.filter((d) => {
      const authName = d.meta?.authName as string
      return authName && !!authKes[authName]
    })
  }

  // 默认选中路由：处理admin下无首页情况
  if (menuRoutes.value.length > 0) {
    const selRoute = menuRoutes.value[0]
    if (route.path === '/admin') {
      // 当前路由为首页，重定向到有权限的第一个路由
      router.replace(selRoute.name as string)
      selectedKeys.value = [selRoute.name as string]
    }
    else {
      selectedKeys.value = [route.name]
    }
  }
  else {
    // 无路由信息，跳转无权限页面
    // router.push('/noaccess')
  }
}, {
  immediate: true,
})
</script>

<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    class="bg-white!"
  >
    <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
      <MenuItem :datas="menuRoutes" />
    </a-menu>
  </a-layout-sider>
</template>

<style scoped>
:deep(.ant-menu-light.ant-menu-inline .ant-menu-item),
:deep(.ant-menu-inline.ant-menu-root .ant-menu-submenu-title) {
  font-weight: 500;
}
</style>
