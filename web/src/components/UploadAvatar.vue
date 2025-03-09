<script setup lang='ts'>
import { CloseCircleFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import { compressImage } from '@/utils/compress'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:value'])

const loading = ref(false)
const avatarUrl = ref('')

const fileList = ref<UploadProps['fileList']>([])

async function beforeUpload(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.error('仅支持上传jpeg、jpg、png格式的文件!')
  }
  const isLt1M = (file.size || 0) / 1024 / 1024 < 0.5
  if (!isLt1M) {
    message.error('文件大小不能超过 500KB，请重新选择!')
  }
  if (!isJpgOrPng || !isLt1M)
    return false

  loading.value = true
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.src = url
  img.onload = () => {
    avatarUrl.value = compressImage(img)
    loading.value = false
  }
  return false
}

watch(() => props.value, (val) => {
  avatarUrl.value = val
  if (val) {
    fileList.value = [{
      uid: `${Date.now()}`,
      name: '',
      url: val,
    }]
  }
  else {
    fileList.value = []
  }
})
watch(avatarUrl, (val) => {
  emits('update:value', val)
})

function removeAvatar() {
  fileList.value = []
  avatarUrl.value = ''
}
</script>

<template>
  <!-- 上传头像 -->
  <a-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    accept="image/png, image/jpg, image/jpeg"
  >
    <div v-if="avatarUrl" pos-relative h-full p-1 box-border>
      <img
        :src="avatarUrl"
        alt="avatar"
        w-full
        h-full
        object-contain
      >
      <CloseCircleFilled
        pos-absolute
        right-1
        top-1
        hover:color-red
        color-red-5
        @click.stop="removeAvatar"
      />
    </div>
    <div v-else>
      <LoadingOutlined v-if="loading" />
      <PlusOutlined v-else />
      <div class="ant-upload-text">
        上传
      </div>
    </div>
  </a-upload>
</template>

<style scoped>
:deep(.ant-upload-select-picture-card) {
  width: 80px !important;
  height: 80px !important;
}

:deep(.ant-upload-select-picture-card) {
  overflow: hidden;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 6px;
  color: #666;
}
</style>
