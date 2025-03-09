<script setup lang="ts">
definePage({
  meta: {
    title: '首页',
    authName: 'admin',
  },
})
</script>

<template>
  <h1>欢迎您！</h1>

  <div class="bg-blue box"></div>
  <div class="bg-blue w-[100px] h-[100px]"></div>
</template>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: #aaa;
}
</style>
