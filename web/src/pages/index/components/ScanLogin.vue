<script setup lang='ts'>
import { CheckCircleOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useLogin } from './useLogin'
import useMyFetch from '@/composables/useMyFetch'
import type { LoginRole } from '@/types/permission'

const props = defineProps<{
  entry?: LoginRole
}>()

const QR_STATUS = {
  /** 等待扫码 */
  WAITING: 'WAITING',
  /** 二维码已过期 */
  EXPIRED: 'EXPIRED',
  /** 扫码完成 */
  COMPLETED: 'COMPLETED',
}

const { loginSuccess } = useLogin(props.entry)
const { isFetching, data, execute } = useMyFetch('/log-in/qr/new').text()

const errMsg = ref('获取二维码失败，重新获取')
const qrId = computed(() => `${data.value || ''}`)
const qrCode = useQRCode(qrId as any, {
  width: 160,
  height: 160,
  margin: 1,
})
const qrImg = computed(() => qrCode.value)
const scanSuccess = ref(false)
let timer: any = null

// 获取扫码状态
async function getLoginStatus() {
  try {
    const { data } = await useMyFetch(`/log-in/qr/status/${qrId.value}`).text()
    if (data.value === QR_STATUS.EXPIRED) {
      errMsg.value = '二维码已过期，请重新获取'
      qrCode.value = ''
    }
    else if (data.value === QR_STATUS.WAITING) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        getLoginStatus()
      }, 1000)
    }
    else if (data.value) {
      scanSuccess.value = true
      loginSuccess(data.value)
    }
  }
  catch (err) {
    console.error(err)
    errMsg.value = '获取二维码失败，重新获取'
    qrCode.value = ''
  }
}

// 监听二维码id变化，获取扫码状态
watch(() => qrId.value, (id) => {
  if (!id)
    return ''
  getLoginStatus()
})
</script>

<template>
  <div text-center>
    <h3 mb-4 mt-0>
      扫码登录
    </h3>
    <div
      m-auto
      relative
      w-40
      h-40
      border-gray-200
      border-1
      border-solid
      overflow-hidden
      box-content
    >
      <div
        v-if="scanSuccess"
        absolute
        top-16
        w-full
        text-center
        text-green
        text-xs
      >
        <CheckCircleOutlined style="font-size: 22px;" />
        <div mt-2>
          扫码成功
        </div>
      </div>
      <img v-if="qrImg" :src="qrImg" alt="加载失败" />
      <div
        v-else
        h-full
        flex
        flex-col
        justify-center
        items-center
        gap-2
      >
        <LoadingOutlined v-if="isFetching" style="font-size: 18px;" />
        <template v-else>
          <ReloadOutlined style="font-size: 18px;cursor:pointer;" @click="execute()" />
          <span text-gray text-xs>
            {{ errMsg }}
          </span>
        </template>
      </div>
    </div>
    <div mt-3 text-xs text-gray-500>
      使用综合数字化管理平台APP扫码登录
    </div>
  </div>
</template>

<style>

</style>
