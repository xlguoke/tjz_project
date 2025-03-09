import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { createFetch } from '@vueuse/core'
import { Dialog, showToast } from 'vant'
import permissionStore from '@/stores/permissions'

interface Params {
  [key: string]: any
}

type MyRequestInit = RequestInit & {
  params?: Params
}

let modal: any = null

const myFetch = createFetch({
  baseUrl: __DEV__ ? '/api/v1' : new URL('/api/v1', __BASE_API__).href,
  options: {
    beforeFetch({ url, options }) {
      const token = permissionStore().Authorization || ''
      const _options: MyRequestInit = {
        ...options,
        headers: {
          'Authorization': `${token ? `Bearer ${token}` : ''}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }

      return { url, options: _options }
    },
    afterFetch(ctx) {
      const { status } = ctx.response

      if (/^2\d{2}$/.test(`${status}`)) {
        return ctx
      }
      return Promise.reject(ctx.data)
    },
    onFetchError(ctx) {
      console.error('error: ', ctx)

      const isAdmin = location.pathname.indexOf('/admin') === 0

      if (modal && isAdmin)
        modal.destroy()

      // 登录失效
      if (ctx.response && ctx.response.status === 401 && permissionStore().Authorization) {
        showToast('登录已失效，请重新登录')
        // permissionStore().logout()
        return ctx
      }

      let msg = ctx?.data?.message || ctx.error.message
      if (!msg || msg === 'Internal Server Error' || msg === 'Unexpected end of JSON input')
        msg = '系统异常，请稍后重试或联系系统管理员！'
      else if (msg === 'Failed to fetch')
        msg = '网络异常，请稍后重试！'
      else if (ctx.response && ctx.response.status === 403)
        msg = '权限不足，请联系管理员！'

      modal = Dialog.error({
        title: '提示',
        content: msg,
        centered: true,
        okText: '确定',
      })

      return ctx
    },
  },
})

/**
 * 注意事项：后端返回的数据为字符串时(res.data为字符串)，在调用useMyFetch时，需要链式调用 .text()
 */
function useMyFetch<T>(
  url: MaybeRefOrGetter<string>,
  options?: MyRequestInit,
  useFetchOptions?: UseFetchOptions,
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  return myFetch(url, options || {}, useFetchOptions).json()
}

export default useMyFetch
