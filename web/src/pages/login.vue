<script lang="ts" setup>
import type { UnwrapRef } from 'vue'
import qs from 'qs'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import type { FormProps } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { useFetch } from '@vueuse/core'
import ScanLogin from './ScanLogin.vue'
import { useLogin } from './useLogin'
import type { LoginRole } from '@/types/permission'
import { Footer } from '@/layout'
import CanvasBg from '@/components/CanvasBg.vue'
import { encrypt } from '@/utils/encrypt'

const props = defineProps<{
  entry?: LoginRole
}>()

interface FormState {
  username: string
  password: string
}

const { loginSuccess } = useLogin(props.entry)

const formState: UnwrapRef<FormState> = reactive({
  username: '',
  password: '',
})
const platformName = __PLATFORM_NAME__
const loading = ref(false)
const handleFinish: FormProps['onFinish'] = async () => {
  try {
    loading.value = true
    const loginApi = __DEV__ ? '/test/login' : new URL('/login', __BASE_API__).href
    const { data, error } = await useFetch(loginApi, {
      method: 'POST',
      body: qs.stringify({
        username: encrypt(formState.username),
        password: encrypt(formState.password),
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'X-CNT-ID': uuid(),
      },
    }, {
      onFetchError(ctx) {
        if (!ctx.response || ctx.response?.status !== 200) {
          console.error(ctx)
          let msg = ctx.error.message || ctx.response?.statusText
          if (ctx.data) {
            msg = JSON.parse(ctx.data).message
          }
          if (!msg || msg === 'Internal Server Error' || msg === 'Unexpected end of JSON input')
            msg = '系统异常，请稍后重试或联系系统管理员！'
          else if (msg === 'Failed to fetch')
            msg = '网络异常，请稍后重试！'
          else if (ctx.response && ctx.response.status === 403)
            msg = '权限不足，请联系管理员！'
          Modal.error({
            title: '提示',
            content: msg || '系统异常，请稍后重试或联系系统管理员！',
            centered: true,
            okText: '确定',
          })
        }
        return ctx
      },
    }).text()
    if (!error.value) {
      if (data.value) {
        loginSuccess(data.value)
      }
    }
    else {
      throw new Error(error.value)
    }
  }
  catch (err) {
    console.error('登录异常->', err)
    loading.value = false
  }
}

function uuid(): string {
  const s: any = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}
</script>

<template>
  <a-layout h-screen>
    <a-layout-header
      class="h-[70px]! leading-[70px]! pl-4! pr-4! bg-gradient-to-r! text-white!"
      from-blue-700
      to-sky-500
      text-2xl
      z-100
    >
      {{ platformName }}
    </a-layout-header>
    <a-layout>
      <a-layout-content>
        <CanvasBg />
        <div w-full h-full grid place-items-center>
          <div
            py-8
            px-12
            flex
            gap-12
            shadow-md
            rounded-lg
            bg-white
            z-100
          >
            <!-- <ScanLogin :entry="entry" /> -->
            <div class="w-70">
              <h3 mb-10 mt-0 text-center>
                登录
              </h3>
              <a-form
                :model="formState"
                @finish="handleFinish"
              >
                <a-form-item>
                  <a-input
                    v-model:value="formState.username"
                    placeholder="请输入用户账号"
                    :maxlength="50"
                  >
                    <template #prefix>
                      <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input-password
                    v-model:value.trim="formState.password"
                    placeholder="请输入用户密码"
                    :maxlength="20"
                  >
                    <template #prefix>
                      <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    block
                    :loading="loading"
                    :disabled="formState.username === '' || formState.password === ''"
                  >
                    登 录
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </a-layout-content>
      <Footer />
    </a-layout>
  </a-layout>
</template>
