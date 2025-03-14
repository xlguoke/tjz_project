<script setup lang='ts'>
const router = useRouter()
const username = ref('')
const password = ref('')
function onSubmit() {

}
</script>

<template>
  <div class="px-10 flex flex-col h-full bg-white overflow-auto">
    <div class="pb-8 pt-[10%]">
      <div class="mb-8 w-[70%]">
        <img src="@/assets/images/logo.jpg" class="w-10 h-10 rounded-sm block" />
        <h3>找回密码</h3>
      </div>
      <van-form @submit="onSubmit">
        <div class="mx-[-16px]">
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </div>

        <div class="mt-4">
          <van-button block type="primary" native-type="submit">
            确定
          </van-button>
        </div>
      </van-form>
      <div class="mt-4 text-right">
        <a href="#" class="text-gray-4" @click="router.back()">
          返回登录
        </a>
      </div>
    </div>
  </div>
</template>

<style>

</style>
