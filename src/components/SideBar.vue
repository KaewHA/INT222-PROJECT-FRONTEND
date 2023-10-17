<script setup>
import router from '../router';
import Swal from "sweetalert2";
import { useView } from '../stores/adminView';
import { useToken } from "../stores/accresstoken.js";
const myView = useView()
const myToken = useToken()

const props = defineProps({
    username: String,
    role: String
})
const showAlert = () => {
    Swal.fire({
        title: 'Confirm Logout ?',
        // text: "Confirm Logout ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sure ',
        cancelButtonText: 'No',
        customClass: {
            container: 'your-custom-class',
            title: 'font-noto',
            content: 'your-content-class',
            confirmButton: 'w-30 h-15 border-none',
            cancelButton: 'w-35 h-15',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            myToken.settoken(null)
            router.push('/login')
        }
    })
}
</script>

<template>
    <!-- Desktop -->
    <div class="w-full h-5/6 flex flex-col text-gray-400 max-lg:hidden justify-between relative">
        <div class="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md">
            <a href="#" @click="router.push('/announcement')"
                class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
                <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4 -rotate-[35deg]">campaign</span>
                <span class="flex items-center text-base duration-200 font-medium group-hover:ml-4">Announcement
                    (Viewer)</span>
            </a>
            <a href="#" @click="router.push('/admin/announcement')"
                class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
                :class="myView.view === 'announcement' ? 'text-custom-blue' : ''">
                <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4 relative -rotate-[35deg]">campaign
                    <span class="material-icons absolute text-xl -bottom-2 left-3">
                        settings
                    </span>
                </span>
                <span class="flex items-center text-lg duration-200 font-medium group-hover:ml-4">Announcement</span>
            </a>
            <a v-if="props.role === 'admin'" href="#" @click="router.push('/admin/user')"
                class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
                :class="myView.view === 'user' ? 'text-custom-blue' : ''">
                <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">manage_accounts</span>
                <span class="flex items-center text-lg duration-200 font-medium group-hover:ml-4">User</span>
            </a>
            <a v-if="props.role === 'admin'" href="#" @click="router.push('/admin/user/match')"
                class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
                :class="myView.view === 'match' ? 'text-custom-blue' : ''">
                <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">key</span>
                <span class="flex items-center text-lg duration-200 font-medium group-hover:ml-4">Match Password</span>
            </a>
        </div>
        <div class="w-full flex flex-row bg-white rounded-2xl overflow-hidden shadow-md">
            <div class="p-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                    <path fill="#9ca3af"
                        d="M5.85 17.1q1.275-.975 2.85-1.538T12 15q1.725 0 3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4Q8.675 4 6.337 6.337T4 12q0 1.475.488 2.775T5.85 17.1ZM12 13q-1.475 0-2.488-1.012T8.5 9.5q0-1.475 1.012-2.488T12 6q1.475 0 2.488 1.012T15.5 9.5q0 1.475-1.012 2.488T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" />
                </svg>
            </div>
            <div class="flex flex-col justify-center">
                <p class="text-lg capitalize">{{ props.username }}</p>
                <div @click="showAlert" class="flex flex-row items-center text-red-600 hover:scale-105 cursor-pointer">
                    <span class="text-xl duration-200 material-symbols-outlined group-hover:ml-4">logout</span>
                    <a href="#" class="text-sm">Logout</a>
                </div>
            </div>
        </div>
        <!-- <a href="#" @click="showAlert()"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">logout</span>
            <span class="flex items-center text-lg duration-200 font-medium group-hover:ml-4">Logouts</span>
        </a> -->
    </div>
</template>

<style scoped></style>