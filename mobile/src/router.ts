import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import NProgress from 'nprogress'
import { storeToRefs } from 'pinia'
import permissionStore from './stores/permissions'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/admin/login']

NProgress.configure({
  showSpinner: false
})

export function createTypedRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  router.beforeEach(async (to) => {
    NProgress.start()
  //   // 前往非登录页和非白名单页面，进行权限拦截
  //   if (
  //     !whiteList.includes(to.path)
  //     || !['/login', '/admin/login'].includes(to.path)
  //   ) {
  //     const permissions = permissionStore()
  //     const { isEntryBackstage, Authorization } = storeToRefs(permissions)
  //     // 未登录，跳转登录页
  //     if (!Authorization.value) {
  //       permissions.$reset()
  //       return permissions.loginPath()
  //     }
  //     await permissions.getUserPermissions()
  //     // 已登录，匹配管理员路由鉴权
  //     if (/^\/admin\/*/.test(to.path)) {
  //       const authName = to.meta?.authName as string
  //       // 普通用户访问后台管理或管理用户访问无权限页面时，跳转无权限页面
  //       if (!isEntryBackstage.value || !permissions.checkRouteAuth(authName))
  //         return '/noaccess'
  //     }
  //   }
  })

  router.afterEach(() => {
    NProgress.done()
  })

  return router
}
