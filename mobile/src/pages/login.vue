<script setup lang='ts'>
const username = ref('')
const password = ref('')
const checked = ref(false)
function onSubmit() {

}
</script>

<template>
  <div class="px-10 flex flex-col h-full bg-white overflow-auto">
    <div class="pb-8 pt-[10%]">
      <div class="mb-8 w-[70%]">
        <img src="@/assets/images/logo.jpg" class="w-10 h-10 rounded-sm block" />
        <h3>欢迎进入推就赚</h3>
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

        <div class="mt-8">
          <van-checkbox v-model="checked" :icon-size="16">
            本人已阅读并同意签署
            <router-link to="/" class="text-blue">
              《用户注册协议》
            </router-link>
          </van-checkbox>
        </div>

        <div class="mt-4">
          <van-button block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
      <div class="flex justify-between mt-4">
        <router-link to="/register" class="text-gray-4">
          快速注册
        </router-link>
        <router-link to="/forget-password" class="text-gray-4">
          忘记密码？
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>

</style>
