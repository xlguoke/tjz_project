<script setup lang='ts'>
function onClickIcon() {}
function onClickButton() {}

definePage({
  meta: {
    title: '产品详情',
  },
})
</script>

<template>
  <div class="p-3 pb-[60px] flex flex-col gap-3">
    <div class="p-3 bg-white rounded-md flex gap-4">
      <img src="" class="w-14 h-14 rounded-md bg-white">
      <div class="flex-1">
        <h4 class="my-0 text-[16px]">
          产品名称
        </h4>
        <p>
          <span class="text-gray-4">最高额度(元)</span>
          <span class="text-orange"><span class="text-lg">100</span>万</span>
        </p>
        <p class="mt-1">
          <span class="text-gray-4">贷款期限：</span> 24期
        </p>
        <p class="mt-1">
          <span class="text-gray-4">每月利率：</span> 0.1%-0.2%
        </p>
        <p class="mt-1">
          <span class="text-gray-4">还款方式：</span> 等额本息
        </p>
      </div>
    </div>
    <div class="bg-white rounded-md">
      <h3 class="p-3 my-0 text-[16px]]">
        公告
      </h3>
      <div class="p-3 border-t-1 border-gray-2 border-t-solid">
        公告内容
      </div>
    </div>
    <div class="bg-white rounded-md">
      <h3 class="p-3 my-0 text-[16px]]">
        返佣说明
      </h3>
      <div class="p-3 border-t-1 border-gray-2 border-t-solid">
        返佣说明
        <p class="h-[500px]"></p>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" @click="onClickIcon" />
      <van-action-bar-icon icon="cart-o" text="申请流程" @click="onClickIcon" />
      <van-action-bar-icon icon="shop-o" text="进件资料" @click="onClickIcon" />
      <van-action-bar-icon icon="shop-o" text="视频讲解" @click="onClickIcon" />
      <van-action-bar-button type="danger" text="立即申请" @click="onClickButton" />
    </van-action-bar>
  </div>
</template>

<style>

</style>
