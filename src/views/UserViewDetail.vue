<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getAnnouncementByIduser } from "../composable/data.js"
import router from '../router/index.js'
import cdate from '../components/icon/TeenyiconsCalendarNoAccessOutline.vue'
import categoryico from '../components/icon/MdiListBox.vue'
import back from '../components/icon/back.vue'
import views from '../components/icon/IcBaselineRemoveRedEye.vue'
import AlertModal from '../components/AlertModal.vue';
const { params } = useRoute()
const announcement = ref('')
onBeforeMount(async () => {
    announcement.value = await getAnnouncementByIduser(params.id)
    console.log(announcement.value);
})

const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
const dateformat = (date) => {
    if (date === null) {
        return "-"
    } else {
        let mydate = new Date(date)
        return mydate.toLocaleDateString('en-GB', options)
    }
}

</script>

<template>
    <div class="w-screen font-noto h-screen">
        <div v-if="announcement" class="w-full h-full  flex-row justify-center items-center">
            <div class="w-full flex justify-center bg-sky-600 pt-7 ">
                <div class="flex justify-start w-full items-center ">
                    <div class="w-full flex justify-center">
                        <div class="w-full flex justify-start items-center ml-5">
                            <button
                                class=" rounded-md text-center text-lg bg-sky-600 border my-2 w-20 h-10 text-white ann-button -mt-7 hover:bg-sky-400"
                                @click="router.go(-1)">
                                <back class="x"></back><span class="y">Back</span>
                            </button>
                            <div class="w-full flex justify-center">
                                <span class="text-left text-3xl mb-4 -ml-8 text-white">Announcement Detail</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="w-full flex justify-center mt-10">
                <div class="border-2  flex justify-center items-center w-3/4 h-3/4 rounded-2xl shadow-2xl">
                    <div class="ann-item w-full">
                        <div class="flex-row justify-end mt-5 pl-4 ">
                            <div class="flex text-black justify-end mr-10 ann-counter">
                                <views class="mt-1 mr-3"></views>VIEW : {{ announcement.viewCount }}
                            </div>
                            <div class="flex text-white justify-end" v-if="announcement.closeDate">
                                <span class="bg-red-400 flex rounded-3xl w-72 border ann-close-date">
                                    <cdate class=" ml-3 mt-1 mr-3"></cdate>
                                    <div class="font-extrabold">Close On : </div>{{ dateformat(announcement.closeDate) }}
                                </span>
                            </div>
                        </div>
                        <div class="ann-category flex justify-center -mt-2 text-xl"><span
                                class="bg-sky-400 flex rounded-3xl p-1 text-white">
                                <categoryico></categoryico><span>{{ announcement.announcementCategory }}</span>
                            </span></div>
                        <div class="text-3xl flex justify-center ann-title mt-4 overflow-x-auto">
                            <span>{{ announcement.announcementTitle }}</span>
                        </div>
                        <div
                            class="ann-description text-xl flex justify-center mt-10 h-96 overflow-y-auto bg-slate-200 rounded-2xl ql-editor">
                            <span class="mt-3" v-html="announcement.announcementDescription"></span>
                        </div>

                    </div>
                </div>
            </div>
            <div class="fixed bottom-0 left-0 flex justify-between p-4">
            </div>
        </div>
        <AlertModal v-if="announcement.ok === false" :ok="announcement.ok" :status="announcement.status" :message="announcement.message">
        </AlertModal>
    </div>
</template>

<style scoped>
tr {
    padding: 10px;
}

td {
    padding: 10px;
}

.ann-button:hover .x {
    display: inline;
}

.ann-button:hover .y {
    display: none;
}

.ann-button .x {
    display: none;
}

.ann-button .y {
    display: inline;
}

h1 {

    font-size: 2em;
}

h2 {
    font-size: 1.5em;
}

h3 {
    font-size: 1.5em;
}

h4 {
    font-size: 1.17em;
}

h5 {
    font-size: .83em;
}

h6 {
    font-size: .67em;
}</style>