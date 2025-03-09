<script setup lang="ts">
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
const route = useRoute()
const docTitle = ref('')
watchEffect(() => {
  docTitle.value = route.meta.title as string
})

useHead({
  title: `${__PROJECT_NAME__}-${docTitle.value}`,
  meta: [
    {
      name: 'description',
      content: 'tjz Project',
    },
  ],
})
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        borderRadius: 4,
        colorPrimary: '#0066ec',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style>

</style>
