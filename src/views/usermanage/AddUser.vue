<script setup>
import { computed, ref,onBeforeMount} from 'vue';
import { addUser } from '../../composable/userdata.js';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue';
import Error from '../../components/icon/Error.vue';
import Correct from '../../components/icon/Correct.vue';
import Info from '../../components/icon/Info.vue';
import Swal from "sweetalert2";
import { acctoken } from "../../stores/accresstoken.js";
import {  getToken,checkToken} from "../../composable/Auth.js";
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
    
})
const newUser = ref({
    username: ''.trim(),
    name: ''.trim(),
    password: '',
    email: ''.trim().toLowerCase(),
    role: 'announcer'
})
const confirmPassword = ref('')

const addStatus = ref(true)
const errRes = ref({})
const addNewUser = async (user) => {
    addStatus.value = await addUser(user,token.gettoken().token)
    if(addStatus.value!=true){
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
        addStatus.value = await  addUser(user,token.gettoken().token)
      }
  }
    if (addStatus.value === true) {
        showAlert()
    } else {
        errRes.value = {}
        for (const err of addStatus.value) {
            errRes.value[err.field] = err.errorMessage
        }
        fieldValidWarn()
    }
}

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&!*])[A-Za-z\d@#$%^&!*]{8,}$/
const showPasswordPattern = ref(false)

const isAllFill = computed(() => {
    return newUser.value.username.trim().length <= 0 || newUser.value.name.trim().length <= 0 ||
        newUser.value.email.trim().length <= 0 || newUser.value.password.trim().length <= 0 ||
        confirmPassword.value.trim().length <= 0 || isPasswordMatch.value === false || newUser.value.email.match(emailPattern) === null
})
const isUsernameValid = ref(null)
const isNameValid = ref(null)
const isEmailValid = ref(null)
const isPasswordValid = ref(null)
const isPasswordMatch = computed(() => newUser.value.password.trim() === confirmPassword.value.trim())
const isPasswordPatternValid = computed(() => newUser.value.password.match(passwordPattern) !== null)

const fieldValidWarn = () => {
    isUsernameValid.value = newUser.value.username.trim().length <= 45 && newUser.value.username.trim().length > 0 && !errRes.value.username
    isNameValid.value = newUser.value.name.trim().length <= 100 && newUser.value.name.trim().length > 0 && !errRes.value.name
    isEmailValid.value = (newUser.value.email.trim().length <= 150 && newUser.value.email.trim().length > 0 &&
        newUser.value.email.match(emailPattern) !== null && !errRes.value.email)
    isPasswordValid.value = (newUser.value.password.trim().length <= 14 && newUser.value.password.trim().length > 7 &&
        isPasswordPatternValid.value && !errRes.value.password)
}

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
            <div class="w-full h-5/6 flex flex-col bg-white shadow-md rounded-2xl justify-evenly py-4">
                <div class="w-full justify-center px-10">
                    <h1 class="text-gray-600 text-3xl text-start font-bold">Add User</h1>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Username</p>
                    <input @keydown="isUsernameValid = null" type="text" v-model.trim="newUser.username"
                        placeholder="SpringJava17" maxlength="45" minlength="1"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-username" required>
                    <p v-if="isUsernameValid !== null" class="flex items-center space-x-2">
                        <Error v-if="isUsernameValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-username">
                            {{ isUsernameValid === false ? `${errRes.username}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Name</p>
                    <input @keydown="isNameValid = null" type="text" v-model.trim="newUser.name" placeholder="Path Param"
                        maxlength="100" minlength="1"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-name" required>
                    <p v-if="isNameValid !== null" class="flex items-center space-x-2">
                        <Error v-if="isNameValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-name ">
                            {{ isNameValid === false ? `${errRes.name}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full flex flex-col">
                    <div class="w-full flex flex-row px-10 py-2 space-x-10">
                        <div class="w-1/2 text-lg font-bold justify-center flex flex-col space-y-2">
                            <p class="text-slate-600">Password</p>
                            <input @click="showPasswordPattern = true" @keydown="isPasswordValid = null" type="password"
                                v-model.trim="newUser.password" placeholder="********" minlength="8" maxlength="14"
                                class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-password" required>
                        </div>
                        <div class="w-1/2 text-lg font-bold justify-center flex flex-col space-y-2">
                            <p class="text-slate-600">Confirm Password</p>
                            <input type="password" v-model.trim="confirmPassword" placeholder="********" minlength="8"
                                maxlength="14"
                                class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-confirm-password"
                                required>
                        </div>
                    </div>
                    <p v-if="isPasswordPatternValid === false && newUser.password.trim().length >= 0 && showPasswordPattern === true"
                        class="w-full flex items-center px-10 space-x-2 font-bold">
                    <div class="p-2">
                        <ul class="text-xs text-red-600 ">
                            <li v-if="newUser.password.trim().length < 8 || newUser.password.trim().length > 14" class="ann-error-password">&bull;
                                Password size must be between 8 and 14</li>
                            <li v-if="newUser.password.trim().match(/(?=.*[a-z])(?=.*[A-Z])/) === null" class="ann-error-password" >&bull; Password must
                                contain at least one upper case and one lower case letter.</li>
                            <li v-if="newUser.password.trim().match(/(?=.*\d)/) === null"  class="ann-error-password">&bull; Password must contain at
                                least one number.</li>
                            <li v-if="newUser.password.trim().match(/(?=.*[@#$%^&!*])/) === null"  class="ann-error-password">&bull; Password must
                                contain at least one special character.</li>
                            <!-- <li v-if="newUser.password.trim().length < 8 || newUser.password.trim().length > 14" class="ann-error-password">&bull;
                                Password size must be between 8 and 14
                            </li>
                            <li v-else="newUser.password.trim().length < 8 ||
                                newUser.password.trim().length > 14 ||
                                newUser.password.trim().match(/(?=.*[a-z])(?=.*[A-Z])/) === null ||
                                newUser.password.trim().match(/(?=.*\d)/) === null ||
                                newUser.password.trim().match(/(?=.*[@#$%^&!*])/) === null
                                " class="ann-error-password">&bull;
                                must be 8-14 characters long, at least 1 of uppercase, lowercase, number and special
                                characters'
                            </li> -->
                        </ul>
                    </div>
                    </p>
                    <p v-if="isPasswordMatch === false && newUser.password.trim().length > 0 && confirmPassword.trim().length > 0 && isPasswordPatternValid === true"
                        class="w-full flex items-center px-10 py-2 space-x-2 font-bold ann-error-password">
                        <Error />
                        <span v-if="isPasswordMatch === false" class="text-center text-sm text-red-600">
                            {{ isPasswordMatch === false ? 'The password DOES NOT match' : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Email</p>
                    <input @keydown="isEmailValid = null" type="email" v-model.trim="newUser.email"
                        placeholder="example@email.com" maxlength="150" minlength="1"
                        class="rounded-md shadow-equal-shadow placeholder:text-gray-400 ann-email" required>
                    <p class="flex items-center space-x-2">
                        <Error v-if="isEmailValid === false" />
                        <span class="text-center text-sm text-red-600 ann-error-email">
                            {{ isEmailValid === false ? `${errRes.email}` : '' }}
                        </span>
                    </p>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold justify-center flex flex-col space-y-2">
                    <p class="text-slate-600">Role</p>
                    <div class="flex flex-row items-center space-x-4">
                        <select name="role" v-model="newUser.role" class="w-1/3 rounded-md text-gray-600 ann-role">
                            <option value="announcer">announcer</option>
                            <option value="admin">admin</option>
                        </select>
                        <div class="flex flex-row space-x-2">
                            <Info />
                            <p class="text-center text-sm text-cyan-600">Chosen role is
                                <span class="underline">{{ newUser.role }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="w-full text-lg py-2 px-10 font-bold flex flex-row space-x-4">
                    <button
                        class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="addNewUser(newUser)" :disabled="isAllFill">Add</button>
                    <!-- <button
                        class="py-2 px-4 rounded-md bg-green-500 text-white disabled:bg-zinc-500 hover:bg-green-600 ann-button"
                        @click="addNewUser(newUser)" :class="isAllFill">Add</button> -->
                    <button class="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-700 ann-button"
                        @click="router.push('/admin/user')">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>.ann-password:hover .tooltip {
    visibility: visible;
}</style>