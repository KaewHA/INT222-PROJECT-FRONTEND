<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getAnnouncementById } from '../../../composable/annAuth.js';
import { onBeforeMount } from 'vue';
import router from '../../../router/index.js'
import Swal from 'sweetalert2'
import SideBar from '../../../components/SideBar.vue';
import { acctoken } from "../../../stores/accresstoken.js";
import {  getToken,checkToken} from "../../../composable/Auth.js";
const { params } = useRoute()
const announcement = ref('')
const status = ref(true)
const token=acctoken()
onBeforeMount(async () => {
    let result= await checkToken(token.token)
    if(result==200){
      //
    }else{
      let newtoken= await getToken()
      if(newtoken==401){
        Swal.fire({
      icon: 'error',
      title: 'YOUR TOKEN HAS EXPIRE',
      text: 'PLESE LOGIN AGAIN',
      confirmButtonText: 'OK',
    }).then(()=>{
      router.push("/login");
    })
      }else{
        token.settoken(newtoken)
      }
    }
    /////////////////////
    announcement.value = await getAnnouncementById(params.id)
    status.value = announcement.value.ok
    if (status.value === false) { showAlert() }
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

const showAlert = () => {
    if (status.value === false) {
        Swal.fire({
            icon: 'error',
            title: announcement.value.message,
            confirmButtonText: 'Back',
        }).then(() => router.push('/admin/announcement'))
    }
}
</script>
<template>
    <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4">
        <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
            <div class="flex flex-row items-center ann-app-title w-full h-1/6">
                <div class="flex items-center space-x-4 w-full">
                    <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                    <div class="flex flex-col">
                        <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                        <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                    </div>
                </div>
            </div>
            <SideBar />
        </div>
        <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
            <div class="flex flex-row items-center ann-app-title w-full h-1/6">
                <div class="flex flex-col items-center w-full h-full">
                    <div class="flex flex-col justify-center items-center w-full h-2/3">
                        
                    </div>
                </div>
            </div>
            <div class="w-full h-5/6 bg-white shadow-md rounded-2xl overflow-y-scroll">
                <div class="flex flex-row mt-8 w-full justify-center first:justify-start">
                    <span @click="router.push('/admin/announcement')"
                        class="material-symbols-outlined flex items-center justify-center ml-12 p-2
                    text-slate-500 fixed cursor-pointer hover:rounded-full hover:bg-blue-500 hover:text-white duration-150">arrow_back</span>
                    <h1 class="font-extrabold text-gray-600 text-3xl text-center w-full">Announcement Detail</h1>
                    <p class="text-center flex justify-center items-center absolute right-16 font-extrabold text-base rounded-3xl 
                      text-white px-4 py-2 from-cyan-500 to-blue-500 bg-gradient-to-r">
                        <span class="material-symbols-outlined">visibility</span>&nbsp;&nbsp;
                        {{ announcement.viewCount }}
                    </p>
                    <p class="text-center flex justify-center items-center absolute right-44 font-extrabold text-base rounded-3xl 
                      text-white px-4 py-2 bg-gradient-to-r"
                        :class="announcement.announcementDisplay !== 'Y' ? 'from-rose-700 to-red-600' : 'from-green-500 to-emerald-600'">
                        <span v-if="announcement.announcementDisplay === 'Y'"
                            class="material-symbols-outlined">check_circle</span>
                        <span v-else class="material-symbols-outlined">cancel</span>
                        &nbsp;&nbsp;{{ announcement.announcementDisplay }}
                    </p>
                </div>
                <div class="w-full py-4 px-14 flex flex-row">
                    <div class="w-full space-y-9">
                        <h1 class="text-2xl text-gray-600 font-bold w-full">{{ announcement.announcementTitle }}</h1>
                        <div class="w-full flex flex-row space-x-8">
                            <p
                                class="w-1/12 font-bold py-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center">
                                {{ announcement.announcementCategory }}
                            </p>
                        </div>
                        <div class="w-full flex flex-row space-x-6">
                            <p
                                class="w-1/3 flex justify-center items-center font-bold py-2 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center space-x-4">
                                <span class="material-symbols-outlined">event_available</span>
                                <span>Published on : {{ dateformat(announcement.publishDate) }}</span>
                            </p>
                            <p
                                class="w-1/3 flex justify-center items-center font-bold py-2 rounded-3xl bg-gradient-to-r from-rose-700 to-red-600 text-white text-center space-x-4">
                                <span class="material-symbols-outlined">event_busy</span>
                                <span>Close on : {{ dateformat(announcement.closeDate) }}</span>
                            </p>
                        </div>
                        <div
                            class="w-full h-80 overflow-y-scroll text-lg font-bold text-gray-700 border rounded-md py-6 px-8">
                            <p class="indent-8" v-html="announcement.announcementDescription"></p>
                        </div>
                    </div>
                </div>
                <div class="w-16 h-16 bg-blue-500 rounded-full flex justify-center items-center absolute bottom-[5rem] right-16 hover:scale-110 transition duration-75 cursor-pointer hover:bg-blue-700"
                    @click="router.push(`/admin/announcement/${params.id}/edit`)">
                    <span class="material-symbols-outlined text-white">edit</span>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        
        <div class="flex items-center justify-between p-8">
            <div class="flex items-center space-x-4">
                <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                    <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                </div>
            </div>
        </div>

        
        <div class="flex-grow px-8 py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
         
            <div class="w-full md:w-1/5 bg-white rounded-2xl shadow-md text-gray-400">
                <a href="#" @click="router.push('/admin/announcement')"
                    class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group">
                    <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                    <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">campaign</span>
                    <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Announcement</span>
                </a>
                <a href="#" @click="router.push('/admin/user')"
                    class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group">
                    <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                    <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">person</span>
                    <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">User</span>
                </a>
            </div>

         
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden space-y-8">
                <div class="flex flex-row mt-8 w-full justify-center first:justify-start">
                    <span @click="router.push('/admin/announcement')"
                        class="material-symbols-outlined flex items-center justify-center ml-12 p-2
                    text-slate-500 fixed cursor-pointer hover:rounded-full hover:bg-blue-500 hover:text-white duration-150">arrow_back</span>
                    <h1 class="font-extrabold text-gray-600 text-3xl text-center w-full">Announcement Detail</h1>
                    <p class="text-center flex justify-center items-center absolute right-16 font-extrabold text-base rounded-3xl 
                      text-white px-4 py-2 from-cyan-500 to-blue-500 bg-gradient-to-r">
                        <span class="material-symbols-outlined">visibility</span>&nbsp;&nbsp;
                        {{ announcement.viewCount }}
                    </p>
                    <p class="text-center flex justify-center items-center absolute right-44 font-extrabold text-base rounded-3xl 
                      text-white px-4 py-2 bg-gradient-to-r"
                        :class="announcement.announcementDisplay !== 'Y' ? 'from-rose-700 to-red-600' : 'from-green-500 to-emerald-600'">
                        <span v-if="announcement.announcementDisplay === 'Y'"
                            class="material-symbols-outlined">check_circle</span>
                        <span v-else class="material-symbols-outlined">cancel</span>
                        &nbsp;&nbsp;{{ announcement.announcementDisplay }}
                    </p>
                </div>
                <div class="w-full py-4 px-14 flex flex-row">
                    <div class="w-full space-y-9">
                        <h1 class="text-2xl text-gray-600 font-bold w-full">{{ announcement.announcementTitle }}</h1>
                        <div class="w-full flex flex-row space-x-8">
                            <p
                                class="w-1/12 font-bold py-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center">
                                {{ announcement.announcementCategory }}
                            </p>
                        </div>
                        <div class="w-full flex flex-row space-x-6">
                            <p
                                class="w-1/3 flex justify-center items-center font-bold py-2 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center space-x-4">
                                <span class="material-symbols-outlined">event_available</span>
                                <span>Published on : {{ dateformat(announcement.publishDate) }}</span>
                            </p>
                            <p
                                class="w-1/3 flex justify-center items-center font-bold py-2 rounded-3xl bg-gradient-to-r from-rose-700 to-red-600 text-white text-center space-x-4">
                                <span class="material-symbols-outlined">event_busy</span>
                                <span>Close on : {{ dateformat(announcement.closeDate) }}</span>
                            </p>
                        </div>
                        <div
                            class="w-full h-80 overflow-y-scroll text-lg font-bold text-gray-700 border rounded-md py-6 px-8">
                            <p class="indent-8" v-html="announcement.announcementDescription"></p>
                        </div>
                    </div>
                </div>
                <div class="w-16 h-16 bg-blue-500 rounded-full flex justify-center items-center absolute bottom-10 right-14 hover:scale-110 transition duration-75 cursor-pointer hover:bg-blue-700"
                    @click="router.push(`/admin/announcement/${params.id}/edit`)">
                    <span class="material-symbols-outlined text-white">edit</span>
                </div>
            </div>
        </div> -->
</template>
<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

tbody tr:hover {
    background-color: rgba(107, 114, 128, 0.05);
}

th {
    padding: 1.5rem;
}

th:last-child {
    text-align: center
}

td {
    padding: 1.5rem;
}

/* width */
::-webkit-scrollbar {
    width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: rgb(55, 65, 81);
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: rgb(31, 41, 55);
}
</style>