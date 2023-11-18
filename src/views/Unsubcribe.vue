<script setup>
import { RouterView, useRoute } from 'vue-router'
import router from '../router';
import { onBeforeMount ,ref} from 'vue';
import { unsubcribe ,preunsubcribe} from '../composable/subscribe';
const route = useRoute()

let dataFromURL = route.query.data
let verify=ref(false)
let canunsub=ref(false)
let cantunsub=ref(false)
let res=ref(false)
onBeforeMount(async () => {
    verify.value = await preunsubcribe(dataFromURL)
    res.value=false
    cantunsub.value=false
    canunsub.value=false
});


const unsubcribeAction = async () => {
    let result=await unsubcribe(dataFromURL)
    if(result){
        canunsub.value=true
    }else{
        cantunsub.value=true
    }
    res.value=true
    // router.push('/announcement')
}
</script>

<template>
    <div class="w-screen h-screen flex justify-center items-center bg-slate-200">
        <div class="w-[30%] h-[38%] flex flex-col justify-center items-center font-noto shadow-xl bg-white py-8 px-4 rounded-xl" v-if="verify&&!res">
            <div>
                <img src="/images/brokenEmail.png" alt="" width="128">
            </div>
            <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Do you want to unsubcribe?</h1>
            <h1 class="text-center text-sm font-semibold text-gray-400 mt-3">If you cancel your subscription, you can always subscribe again.</h1>
            <div class="flex flex-row text-center font-medium text-sm space-x-4 mt-5">
                <button @click="unsubcribeAction" class="bg-custom-blue/90 py-2 px-4 rounded-md text-white hover:bg-custom-blue">Yes, unsubcribe it.</button>
                <button @click="router.push('/announcement')" class="bg-sky-100 py-2 px-4 rounded-md text-gray-500 hover:bg-sky-100/70">No, keep subcribe.</button>
            </div>
        </div>

        <div class="w-[30%] h-[38%] flex flex-col justify-center items-center font-noto shadow-xl bg-white py-8 px-4 rounded-xl" v-if="!verify&&!res" >
            <div>
                <img src="/images/nofoundsub.png" alt="" width="128">
            </div>
            <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Unable to Unsubscribe</h1>
            <h1 class="text-center text-sm font-semibold text-gray-400 mt-3">Your subscription was not found.</h1>
            <div class="flex flex-row text-center font-medium text-sm space-x-4 mt-5">
                <button @click="router.push('/announcement')" class="bg-custom-blue/90 py-2 px-4 rounded-md text-white hover:bg-custom-blue">BACK</button>
            </div>
        </div>

        <div class="w-[30%] h-[38%] flex flex-col justify-center items-center font-noto shadow-xl bg-white py-8 px-4 rounded-xl" v-if="canunsub&&res" >
            <div>
                <img src="/images/check.png" alt="" width="128">
            </div>
            <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Unsubscribe Succress</h1>
            <h1 class="text-center text-sm font-semibold text-gray-400 mt-3">you can always subscribe again</h1>
            <div class="flex flex-row text-center font-medium text-sm space-x-4 mt-5">
                <button @click="router.push('/announcement')" class="bg-custom-blue/90 py-2 px-4 rounded-md text-white hover:bg-custom-blue">Okay</button>
            </div>
        </div>

        <div class="w-[30%] h-[38%] flex flex-col justify-center items-center font-noto shadow-xl bg-white py-8 px-4 rounded-xl" v-if="cantunsub&&res" >
            <div>
                <img src="/images/cross.png" alt="" width="128">
            </div>
            <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Can not Unsubscribe</h1>
            <h1 class="text-center text-sm font-semibold text-gray-400 mt-3">Something is Wrong!</h1>
            <div class="flex flex-row text-center font-medium text-sm space-x-4 mt-5">
                <button @click="router.push('/announcement')" class="bg-custom-blue/90 py-2 px-4 rounded-md text-white hover:bg-custom-blue">Okay</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
