<script setup>
import router from '../router';
import earth from './icon/SystemUiconsGlobe.vue'
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

<template>
    <div class="w-screen font-noto rounded-2xl">
        <div class="w-full h-full flex p-2 bg-white" >
            <div class="flex items-center space-x-4 w-full p-2">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
            <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
          </div>
        </div>
            
        </div>
    </div>
    <hr>
</template>

<style scoped></style>
