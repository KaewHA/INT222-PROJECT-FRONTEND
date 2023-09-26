<script setup>
import router from '../router';
import Swal from "sweetalert2";
import { useView } from '../stores/adminView';
import { acctoken } from "../stores/accresstoken.js";
const myView = useView()
const token=acctoken()
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
            token.settoken(null)
            router.push('/login')   
        }
    })
}
</script>

<template>
    <!-- Desktop -->
    <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 max-lg:hidden">
        <a href="#" @click="router.push('/admin/announcement')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu"
            :class="myView.view === 'announcement' ? 'text-custom-blue' : ''">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">campaign</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Announcement</span>
        </a>
        <a href="#" @click="router.push('/admin/user')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
            :class="myView.view === 'user' ? 'text-custom-blue' : ''">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">person</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">User</span>
        </a>
        <a href="#" @click="router.push('/admin/user/match')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
            :class="myView.view === 'password' ? 'text-custom-blue' : ''">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">key</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Match Password</span>
        </a>
        <a href="#" @click="showAlert()"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">logout</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Logouts</span>
        </a>
    </div>

    <!-- Mobile -->
    <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 xl:hidden">
        <a href="#" @click="router.push('/admin/announcement')"
            class="py-4 pr-2 text-xl flex items-center space-x-2 justify-center ann-menu">
            <span class="text-2xl material-symbols-outlined">campaign</span>
            <span class="flex items-center text-base font-bold">Announcement</span>
        </a>
        <a href="#" @click="router.push('/admin/user')"
            class="py-4 pr-2 text-xl flex items-center space-x-2 justify-center ann-menu">
            <span class="text-2xl material-symbols-outlined">person</span>
            <span class="flex items-center text-base font-bold">User</span>
        </a>
    </div>
</template>

<style scoped></style>