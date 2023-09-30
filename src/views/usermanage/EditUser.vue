<script setup>
import { ref, computed } from 'vue';
import { getUserDetail, updateUserById } from '../../composable/userdata.js';
import { useRoute } from 'vue-router';
import { onBeforeMount } from 'vue';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue'
import Error from '../../components/icon/Error.vue'
import Info from '../../components/icon/Info.vue'
import Swal from 'sweetalert2'
import { acctoken } from "../../stores/accresstoken.js";
import {  getToken,checkToken} from "../../composable/Auth.js";
const { params } = useRoute()
const oldUser = ref({})
const updatedUser = ref({})
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
    /////////
    const receivedData = await getUserDetail(params.id,token.gettoken().token)
    Object.assign(updatedUser.value, receivedData)
    Object.assign(oldUser.value, receivedData)
    // updatedUser.value = receivedData
    // oldUser.value = receivedData
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

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g

const validateUserUpdate = computed(() => {
    return (oldUser.value.username === updatedUser.value.username) && (oldUser.value.name === updatedUser.value.name) && 
            (oldUser.value.email === updatedUser.value.email || updatedUser.value.email.match(emailPattern) === null) && 
            (oldUser.value.role === updatedUser.value.role) || validateUsername.value || validateName.value || validateEmail.value
})
const validateUsername = computed(() => updatedUser.value.username?.trim().length > 45 || updatedUser.value.username?.trim().length <= 0)
const validateName = computed(() => updatedUser.value.name?.trim().length > 100 || updatedUser.value.name?.trim().length <= 0)
const validateEmail = computed(() => updatedUser.value.email?.trim().length > 150 || updatedUser.value.email?.trim().length <= 0)

const isUsernameValid = ref(null)
const isNameValid = ref(null)
const isEmailValid = ref(null)

const fieldValidWarn = () => {
    isUsernameValid.value = updatedUser.value.username.trim().length <= 45 && updatedUser.value.username.trim().length > 0 && !errRes.value.username
    isNameValid.value = updatedUser.value.name.trim().length <= 100 && updatedUser.value.name.trim().length > 0 && !errRes.value.name
    isEmailValid.value = (updatedUser.value.email.trim().length <= 150 && updatedUser.value.email.trim().length > 0 &&
        updatedUser.value.email.match(emailPattern) !== null && !errRes.value.email)
}

const status = ref(true)
const errRes = ref({})
const updateUser = async (user, id) => {
    status.value = await updateUserById(user, id,token.gettoken().token)
    if(status.value!=true){
    let newtoken= await getToken()
      if(newtoken==401){
        Swal.fire({
      icon: 'error',
      title: 'YOUR TOKEN HAS EXPIRE',
      text: 'PLESE LOGIN AND TRY AGAIN',
      confirmButtonText: 'OK',
    }).then(()=>{
      router.push("/login");
    })
      }else{
        token.settoken(newtoken)
        status.value = await updateUserById(user, id,token.gettoken().token)
      }
  }
    if (status.value === true) {
        showAlert()
    } else {
        errRes.value = {}
        for (const err of status.value) {
            errRes.value[err.field] = err.errorMessage
        }
        fieldValidWarn()
    }
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
                </div>
            </div>
            <div class="w-full h-5/6 flex flex-col bg-white shadow-md rounded-2xl justify-evenly">
                <div class="w-full px-10 justify-center">
                    <h1 class="text-gray-600 text-4xl text-start font-bold">Update User</h1>
                </div>
                <div class="w-full text-xl py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Username</p>
                    <input @keydown="isUsernameValid = null" type="text" v-model.trim="updatedUser.username" placeholder="SpringJava17" maxlength="45" minlength="1" required
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-username">
                    <p v-if="isUsernameValid !== null" class="flex items-center space-x-2">
                        <Error v-if="isUsernameValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-username">
                            {{ isUsernameValid === false ? `${errRes.username}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Name</p> 
                    <input @keydown="isNameValid = null" type="text" v-model.trim="updatedUser.name" placeholder="Path Param" maxlength="100" minlength="1" required
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-name">
                    <p v-if="isNameValid !== null" class="flex items-center space-x-2">
                        <Error v-if="isNameValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-name">
                            {{ isNameValid === false ? `${errRes.name}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Email</p>
                    <input @keydown="isEmailValid = null" type="text" v-model.trim="updatedUser.email" placeholder="example@email.com" maxlength="150" minlength="1" required
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-email">
                    <p v-if="isEmailValid !== null" class="flex items-center space-x-2">
                        <Error v-if="isEmailValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-email">
                            {{ isEmailValid === false ? `${errRes.email}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-xl py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Role</p>
                    <div class="flex flex-row items-center space-x-4">
                        <select name="role" v-model="updatedUser.role"
                            class="w-1/3 rounded-md shadow-equal-shadow text-gray-600 ann-role">
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
                <div class="w-full text-base py-2 px-10 font-bold flex flex-row space-x-28 text-slate-600">
                    <p>Created On &nbsp; <span class="underline text-gray-800 ann-created-on">{{
                        dateformat(updatedUser.createdOn) }}</span></p>
                    <p>Updated On &nbsp; <span class="underline text-gray-800 ann-updated-on">{{
                        dateformat(updatedUser.updatedOn) }}</span></p>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold flex flex-row space-x-4">
                    <button
                        class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="updateUser(updatedUser, updatedUser.id)" :disabled="validateUserUpdate">Update</button>
                        <!-- <button
                        class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="updateUser(updatedUser, updatedUser.id)" :class="validateUserUpdate">Update</button> -->
                    <button class="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-700 ann-button"
                        @click="router.push(`/admin/user/`)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<style scoped></style>