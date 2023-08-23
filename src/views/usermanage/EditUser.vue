<script setup>
import { ref, computed } from 'vue';
import { getUserDetail, updateUserById } from '../../composable/userdata.js';
import { useRoute } from 'vue-router';
import { onBeforeMount } from 'vue';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue'
import Correct from '../../components/icon/Correct.vue'
import Error from '../../components/icon/Error.vue'
import Info from '../../components/icon/Info.vue'
import Swal from 'sweetalert2'

const { params } = useRoute()
const oldUser = ref({})
const updatedUser = ref({})

onBeforeMount(async () => {
    const receivedData = await getUserDetail(params.id)
    Object.assign(updatedUser.value, receivedData)
    Object.assign(oldUser.value, receivedData)
})

const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false
};
const dateformat = (date) => {
    if (date === null) {
        return "-";
    } else {
        let mydate = new Date(date);
        return mydate.toLocaleDateString("en-GB", options);
    }
};
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

const validateUserUpdate = computed(() => {
    return (oldUser.value.username === updatedUser.value.username && oldUser.value.name === updatedUser.value.name 
    && oldUser.value.email === updatedUser.value.email && oldUser.value.role === updatedUser.value.role) || validateUsername.value || validateName.value || validateEmail.value
})
const validateUsername = computed(() => updatedUser.value.username?.trim().length > 45 || updatedUser.value.username?.trim().length <= 0 )
const validateName = computed(() => updatedUser.value.name?.trim().length > 100 || updatedUser.value.name?.trim().length <= 0 )
const validateEmail = computed(() => updatedUser.value.email?.trim().length > 150 || updatedUser.value.email?.trim().length <= 0 )

const status = ref(true)
const updateUser = async (user, id) => {
    status.value = await updateUserById(user, id)
    showAlert()
}

const showAlert = () => {
    if (status.value === true) {
        Swal.fire({
            icon: 'success',
            title: 'Update User Success!',
            confirmButtonText: 'Continue',
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong!',
            text: 'Cannot update user',
            confirmButtonText: 'Continue',
        })
    }
    router.push('/admin/user')
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        
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
            <SideBar />

            
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                <div class="w-full py-6 px-10 justify-center">
                    <h1 class="text-gray-600 text-3xl text-start font-bold">Update User</h1>
                </div>
                <div class="w-full text-xl py-4 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Username</p>
                    <input type="text" v-model="updatedUser.username" placeholder="SpringJava17" maxlength="45"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-username"
                        :class="validateUsername === true ? 'border-red-600 shadow-red-500' : 'border-green-500 shadow-green-500'">
                    <p class="flex items-center space-x-2">
                        <Correct v-if="validateUsername === false" />
                        <Error v-else />
                        <span class="text-center text-sm"
                            :class="validateUsername === true ? 'text-red-600' : 'text-green-500'">
                            {{ validateUsername === true ? 'Please provide a valid username' : 'Username is valid' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-4 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Name</p>
                    <input type="text" v-model="updatedUser.name" placeholder="Path Param" maxlength="45"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-name"
                        :class="validateName === true ? 'border-red-600 shadow-red-500' : 'border-green-500 shadow-green-500'">
                    <p class="flex items-center space-x-2">
                        <Correct v-if="validateName === false" />
                        <Error v-else />
                        <span class="text-center text-sm"
                            :class="validateName === true ? 'text-red-600' : 'text-green-500'">
                            {{ validateName === true ? 'Please enter name' : 'This name is valid' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-4 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Email</p>
                    <input type="text" v-model="updatedUser.email" placeholder="example@email.com" maxlength="45"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-email"
                        :class="validateEmail ? 'border-red-600 shadow-red-500' : 'border-green-500 shadow-green-500'">
                    <p class="flex items-center space-x-2">
                        <Correct v-if="validateEmail === false" />
                        <Error v-else />
                        <span class="text-center text-sm"
                            :class="validateEmail === true ? 'text-red-600' : 'text-green-500'">
                            {{ validateEmail === true ? 'Please provide a valid email' : 'Email is valid' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-4 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Role</p>
                    <div class="flex flex-row items-center space-x-4">
                        <select name="role" v-model="updatedUser.role"
                            class="w-1/3 rounded-md border-cyan-500 shadow-cyan-600 shadow-equal-shadow text-gray-600 ann-role">
                            <option value="announcer">announcer</option>
                            <option value="admin">admin</option>
                        </select>
                        <div class="flex flex-row space-x-2">
                            <Info />
                            <p class="text-center text-sm text-cyan-600">
                                Chosen role is <span class="underline">{{ updatedUser.role }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="w-full text-base py-4 px-10 font-bold flex flex-row space-x-28 text-slate-600">
                    <p>Created On &nbsp; <span class="underline text-gray-800 ann-created-on">{{ dateformat(updatedUser.createdOn) }}</span></p>
                    <p>Updated On &nbsp; <span class="underline text-gray-800 ann-updated-on">{{ dateformat(updatedUser.createdOn) }}</span></p>
                </div>
                <div class="w-full text-lg py-4 px-10 font-bold flex flex-row space-x-4">
                    <button class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="updateUser(updatedUser, updatedUser.id)" :disabled="validateUserUpdate">Update</button>
                    <button class="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-700 ann-button"
                        @click="router.push(`/admin/user/`)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.table-container {
    position: relative;
    overflow: hidden;
}

.table-container table {
    border-collapse: collapse;
    width: 100%;
}

.table-body {
    max-height: 300px;
    /* Set a max height for the tbody to enable scrolling */
    overflow-y: auto;
}
</style>