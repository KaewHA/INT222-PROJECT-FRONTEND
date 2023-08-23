<script setup>
import { computed, ref } from 'vue';
import { addUser } from '../../composable/userdata.js';
import { onBeforeMount } from 'vue';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue';
import Error from '../../components/icon/Error.vue';
import Correct from '../../components/icon/Correct.vue';
import Info from '../../components/icon/Info.vue';
import Swal from "sweetalert2";

const newUser = ref({
    username: ''.trim(),
    name: ''.trim(),
    email: ''.trim(),
    role: 'announcer'
})

const addStatus = ref(true)

const addNewUser = async (user) => {
    addStatus.value = await addUser(user)
    showAlert();
}

const validateUsername = computed(() => newUser.value.username.trim().length > 45 || newUser.value.username.trim().length <= 0)
const validateName = computed(() => newUser.value.name.trim().length > 100 || newUser.value.name.trim().length <= 0)
const validateEmail = computed(() => newUser.value.email.trim().length > 150 || newUser.value.email.trim().length <= 0)
const validateNewUser = computed(() => validateUsername.value || validateName.value || validateEmail.value)

const showAlert = () => {
    if (addStatus.value === true) {
        Swal.fire({
            icon: "success",
            title: "Create User Success!",
            confirmButtonText: "Continue",
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Something went wrong!",
            text: "Cannot create user.",
            confirmButtonText: "Back",
        });
    }
    router.push("/admin/user");
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
            <SideBar />

            <!-- User Table -->
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                <div class="w-full py-6 px-10 justify-center">
                    <h1 class="text-gray-600 text-3xl text-start font-bold">Add User</h1>
                </div>
                <div class="w-full text-xl py-4 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Username</p>
                    <input type="text" v-model="newUser.username" placeholder="SpringJava17" maxlength="45"
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
                    <input type="text" v-model="newUser.name" placeholder="Path Param" maxlength="45"
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
                    <input type="text" v-model="newUser.email" placeholder="example@email.com" maxlength="45"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-email"
                        :class="validateName === true ? 'border-red-600 shadow-red-500' : 'border-green-500 shadow-green-500'">
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
                        <select name="role" v-model="newUser.role"
                            class="w-1/3 rounded-md border-cyan-500 shadow-cyan-600 shadow-equal-shadow text-gray-600 ann-role">
                            <option value="announcer">announcer</option>
                            <option value="admin">admin</option>
                        </select>
                        <div class="flex flex-row space-x-2">
                            <Info />
                            <p class="text-center text-sm text-cyan-600">Chosen role is <span class="underline">{{ newUser.role }}</span></p>
                        </div>
                    </div>
                </div>
                <div class="w-full text-lg py-4 px-10 font-bold flex flex-row space-x-4">
                    <button class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="addNewUser(newUser)" :disabled="validateNewUser">Add</button>
                    <button class="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-700 ann-button"
                        @click="router.push('/admin/user')">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>