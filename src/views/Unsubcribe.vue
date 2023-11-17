<script setup>
import { RouterView, useRoute } from 'vue-router'
import router from '../router';
import { unsubcribe } from '../composable/subscribe';
const route = useRoute()
let dataFromURL = route.query.data
const unsubcribeAction = async () => {
    await unsubcribe(dataFromURL)
    router.push('/announcement')
}
</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center bg-slate-50">
        <div class="w-[30%] h-[38%] flex flex-col justify-center items-center font-noto shadow-xl bg-white py-8 px-4 rounded-xl">
            <div>
                <img src="/images/brokenEmail.png" alt="" width="128">
            </div>
            <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Do you want to unsubcribe?</h1>
            <div class="flex flex-row text-center font-medium text-sm space-x-4 mt-5">
                <button @click="unsubcribeAction" class="bg-custom-blue/90 py-2 px-4 rounded-md text-white hover:bg-custom-blue">Yes, unsubcribe it.</button>
                <button @click="router.push('/announcement')" class="bg-sky-100 py-2 px-4 rounded-md text-gray-500 hover:bg-sky-100/70">No, keep subcribe.</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
