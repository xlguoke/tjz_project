<script setup lang='ts'>
import type { Rule } from 'ant-design-vue/es/form'
import { Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import permissions from '@/stores/permissions'
import useMyFetch from '@/composables/useMyFetch'
import { encrypt } from '@/utils/encrypt'

const { userInfo } = storeToRefs(permissions())
// 修改密码
const visible = ref(false)
const submitLoad = ref(false)
const formRef = ref()
const form = reactive({
  oldPassWord: '',
  newPassWord: '',
  reNewPassWord: '',
})

// eslint-disable-next-line vue/max-len
const pwdReg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z_!@$%^&*.]+$)(?![a-z0-9]+$)(?![a-z_!@$%^&*.]+$)(?![0-9_!@$%^&*.]+$)[\w!@$%^&*.]{8,15}$/

// 密码强度校验
async function validNewPwd(_rule: Rule, value: string) {
  if (!value) {
    return Promise.resolve()
  }
  if (value === form.oldPassWord) {
    return Promise.reject(new Error('新密码不能与原密码一致'))
  }
  if (value.length < 8 || value.length > 15) {
    return Promise.reject(new Error('密码长度为8~15个字符'))
  }
  if (!pwdReg.test(value)) {
    return Promise.reject(new Error('密码必须包含大小写字母、数字、特殊字符(_!@$%^&*.)中的至少三种'))
  }
  return Promise.resolve()
}

function validReNewPwd(_rule: Rule, value: string) {
  if (!value) {
    return Promise.resolve()
  }
  if (value !== form.newPassWord) {
    return Promise.reject(new Error('确认密码与新密码不一致'))
  }
  return Promise.resolve()
}

const rules = reactive({
  oldPassWord: [
    { required: true, message: '请输入原密码' },
  ],
  newPassWord: [
    { required: true, message: '请输入新密码' },
    { validator: validNewPwd },
  ],
  reNewPassWord: [
    { required: true, message: '请输入确认密码' },
    { validator: validReNewPwd },
  ],
})

function cancelModal() {
  visible.value = false
  formRef.value.resetFields()
}

async function submit() {
  await formRef.value.validateFields()
  submitLoad.value = true
  const { error } = await useMyFetch(`/users/${userInfo.value.id}/password`, {
    method: 'PUT',
    body: JSON.stringify({
      oldPassWord: encrypt(form.oldPassWord),
      newPassWord: encrypt(form.newPassWord),
    }),
  })
  if (error.value) {
    submitLoad.value = false
    return
  }
  cancelModal()
  reLoginMsg()
}

const secend = ref(3)
let timer: any = null
function countDown() {
  timer = setInterval(() => {
    secend.value--
    if (secend.value <= 0) {
      stopCountDown()
    }
  }, 1000)
}

function stopCountDown() {
  clearInterval(timer)
  window.location.href = permissions().loginPath()
}

function reLoginMsg() {
  permissions().$reset()
  countDown()
  Modal.info({
    title: '提示',
    content: h('span', `密码修改成功，即将跳转登录页重新登录`),
    centered: true,
    okText: '立即重新登录',
    onOk() {
      stopCountDown()
    },
  })
}

function openModal() {
  submitLoad.value = false
  visible.value = true
}

defineExpose({
  openModal,
})
</script>

<template>
  <a-modal
    v-model:open="visible"
    title="修改密码"
    :keyboard="false"
    :mask-closable="false"
    :closable="false"
    centered
    width="600px"
  >
    <template #footer>
      <a-button :disabled="submitLoad" @click="cancelModal">
        取消
      </a-button>
      <a-button :loading="submitLoad" type="primary" @click="submit">
        确定
      </a-button>
    </template>
    <div class="my-4 max-h-[60vh] min-h-[200px] overflow-auto">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-item label="原密码" name="oldPassWord">
          <a-input-password
            v-model:value="form.oldPassWord"
            :maxlength="20"
            placeholder="请输入原密码"
          />
        </a-form-item>
        <a-form-item label="新密码" name="newPassWord">
          <a-input-password
            v-model:value="form.newPassWord"
            type="password"
            :maxlength="20"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item label="确认密码" name="reNewPassWord">
          <a-input-password
            v-model:value="form.reNewPassWord"
            type="password"
            :maxlength="20"
            placeholder="请输入确认密码"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
