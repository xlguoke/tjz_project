<script lang="ts" setup>
import { Footer, Header, Sider } from '@/layout'
</script>

<template>
  <a-layout h-screen>
    <Header />
    <a-layout>
      <Sider />
      <a-layout>
        <a-layout-content px-4 mt-4 overflow-auto>
          <div p-2 bg-white h-full overflow-hidden>
            <RouterView />
          </div>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
