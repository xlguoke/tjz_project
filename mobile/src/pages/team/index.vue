<script setup lang='ts'>
import ShareQr from '../components/ShareQr.vue'
import TeamAward from '../components/TeamAward.vue'

const comClass = 'py-2 px-4 bg-blue-5 text-white rounded-2xl inline-block text-sm'

definePage({
  meta: {
    title: '团队',
  },
})
</script>

<template>
  <div class="p-3">
    <ul class="px-3 py-6 flex rounded-md bg-white">
      <li class="flex-1 text-center">
        <p :class="comClass">
          分享数据
        </p>
        <p class="my-4 leading-[50px] text-2xl">
          0
        </p>
        <p class="text-sm">
          今日
          <span class="text-orange">+ 0个</span>
        </p>
      </li>
      <li class="flex-1 text-center">
        <p :class="comClass">
          阅读数据
        </p>
        <p class="my-4 leading-[50px] text-2xl border-x-1 border-x-solid border-gray-3">
          0
        </p>
        <p class="text-sm">
          今日
          <span class="text-orange">+ 0个</span>
        </p>
      </li>
      <li class="flex-1 text-center">
        <p :class="comClass">
          团队人数
        </p>
        <p class="my-4 leading-[50px] text-2xl">
          0
        </p>
        <p class="text-sm">
          今日
          <span class="text-orange">+ 0个</span>
        </p>
      </li>
    </ul>

    <ShareQr class="my-3" />

    <TeamAward />
  </div>
</template>

<style>

</style>
