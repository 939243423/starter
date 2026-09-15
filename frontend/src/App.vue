<template>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- 全局 UI：在任意 js/vue 中通过 dialog.toast / dialog.confirm 调用 -->
  <GlobalDialog />
  <ToastList />
</template>

<script setup>
import GlobalDialog from './components/GlobalDialog.vue'
import ToastList from './components/ToastList.vue'
</script>
