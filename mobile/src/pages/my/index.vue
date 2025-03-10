<script setup lang='ts'>
import UserIntro from '../components/UserIntro.vue'
import QuickEntry from '../components/QuickEntry.vue'

definePage({
  meta: {
    title: '我的',
  },
})
</script>

<template>
  <div class="p-3">
    <UserIntro />
    <QuickEntry class="my-3" />

    <ul class="rounded-md bg-white overflow-hidden">
      <li class="cell-item border-b-1 border-gray-2 border-b-solid">
        <img src="@/assets/images/icon-qr.svg" class="w-6 h-6">
        <span class="flex-1 text-[16px]">联系客服</span>
        <van-icon name="arrow" class="text-gray-4" />
      </li>
      <li class="cell-item border-b-1 border-gray-2 border-b-solid">
        <img src="@/assets/images/icon-qr.svg" class="w-6 h-6">
        <span class="flex-1 text-[16px]">关于</span>
        <van-icon name="arrow" class="text-gray-4" />
      </li>
      <li class="cell-item">
        <img src="@/assets/images/icon-qr.svg" class="w-6 h-6">
        <span class="flex-1 text-[16px]">设置</span>
        <van-icon name="arrow" class="text-gray-4" />
      </li>
    </ul>
  </div>
</template>

<style>

</style>
