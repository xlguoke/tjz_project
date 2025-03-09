<script lang="ts" setup>
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/core'
import { message } from 'ant-design-vue'
import { compressImage } from '@/utils/compress'

const props = defineProps(['value'])
const emit = defineEmits(['update:value'])
const valueHtml = ref('')
const editorRef = shallowRef()
const mode = 'default'

watch(
  () => props.value,
  (val) => {
    valueHtml.value = val || ''
  },
)

const toolbarConfig = {
  excludeKeys: ['insertImage', 'insertVideo', 'group-video', 'fullScreen'],
  insertkeys: {
    index: 22,
    keys: ['uploadAttachment'],
  },
}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      allowedFileTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/svg', 'image/webp'],
      async customUpload(file: File, insert: (url: string) => void) {
        const filetype = '.jpg, .jpeg, .png, .bmp, .svg, .webp'
        const _type = getFileType(file.name)
        if (!filetype.includes(_type)) {
          message.warning(`只支持上传${filetype}格式文件`)
          return
        }
        if (file.size > 2 * 1024 * 1024) {
          return message.warning('文件大小不能超过2M')
        }
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.src = url
        img.onload = () => {
          const base64 = compressImage(img, { img_limit_size: 500 * 500, piece_size: 200 * 200 })
          insert(base64)
        }
      },
    },
  },
}

function getFileType(name: string) {
  if (!name)
    return ''
  const n = name.lastIndexOf('.')
  return name.substr(n).toLowerCase()
}

function handleCreated(editor: IDomEditor) {
  editorRef.value = editor // 记录 editor 实例，重要！
}

function handleChange(editor: IDomEditor) {
  let html = editor.getHtml()
  if (html === '<p><br></p>') {
    html = ''
  }
  emit('update:value', html)
}

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  if (!editorRef.value)
    return
  editorRef.value.destroy()
})
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      style="height: 300px; overflow-y: hidden;"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>
