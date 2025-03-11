<script setup lang='ts'>
const dfUser = new URL('@/assets/images/user.svg', import.meta.url).href
</script>

<template>
  <div class="p-3 bg-white rounded-md flex gap-4 items-center">
    <div class="w-15 h-15 rounded-full overflow-hidden">
      <img :src="dfUser" class="block w-full h-full">
    </div>
    <div class="flex-1">
      <div class="flex justify-between">
        <h3 class="my-2">
          名称
        </h3>
        <div>
          <van-icon name="setting-o" class="mr-1" />账号设置
        </div>
      </div>
      <p class="mb-1">
        手机号
      </p>
      <div class="mb-1">
        <span class="mr-4">邀请码：000</span>
        <span>复制</span>
      </div>
    </div>
  </div>
</template>

<style>

</style>
