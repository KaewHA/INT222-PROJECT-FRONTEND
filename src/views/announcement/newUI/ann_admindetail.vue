<script setup>
import { ref ,computed} from 'vue';
import { useRoute } from 'vue-router';
import {getAnnouncementById } from '../../../composable/data.js';
import { onBeforeMount } from 'vue';
import router from '../../../router/index.js'
import Swal from 'sweetalert2'
const { params } = useRoute()
const announcement = ref('')
const status = ref(true)
onBeforeMount(async () => {
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
    <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        <!-- Header -->
        <div class="flex items-center justify-between p-8">
            <div class="flex items-center space-x-4">
                <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                    <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow px-8 py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <!-- Sidebar -->
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

            <!-- User Table -->
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden">
                    <div class="text-3xl flex justify-center   mt-8">
                            <span>Announcement Detail</span>
                        </div>

             
                        <div class="w-16 h-16 bg-blue-500 rounded-full flex justify-center items-center absolute  bottom-10 right-14"></div>
            </div>
        </div>
    </div>
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
</style>