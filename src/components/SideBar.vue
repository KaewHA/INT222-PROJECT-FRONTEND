<script setup>
import router from '../router';
</script>

<template>
    <!-- Desktop -->
    <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 max-lg:hidden">
        <a href="#" @click="router.push('/admin/announcement')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">campaign</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Announcement</span>
        </a>
        <a href="#" @click="router.push('/admin/user')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">person</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">User</span>
        </a>
        <a href="#" @click="router.push('/admin/user/match')"
            class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu">
            <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
            <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">person</span>
            <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Match Password</span>
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