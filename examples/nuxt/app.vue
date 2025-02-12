<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
import markerSDK from '@marker.io/browser';

onMounted(async () => {
  if (process.client) {
    await markerSDK.loadWidget({
      project: 'YOUR_SITE_KEY_HERE',
    });
  }
})
</script>
