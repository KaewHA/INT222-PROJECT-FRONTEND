<script setup>
import { ref } from "vue";
import SideBar from "../../components/SideBar.vue";
import Swal from "sweetalert2";
import { Authenfund } from '../../composable/userdata.js';
import { onBeforeMount } from "vue";
import { useView } from '../../stores/adminView';
import { useToken } from "../../stores/accresstoken.js";
import { getToken, checkToken } from "../../composable/Auth.js";

const myView = useView()
const myToken = useToken()
onBeforeMount(async () => {
  myView.view = 'match'
    if (localStorage.getItem("token") != null || localStorage.getItem("token") != undefined) {
        let result = await checkToken(localStorage.getItem("token"));
        if (result == 200) {
            ///
        } else {
            let newtoken = await getToken();
            if (newtoken == 401) {
                router.push('/login')
            } else {
                localStorage.setItem("token", newtoken);
            }
        }
    } else {
        router.push('/login')
    }
    let newtoken = localStorage.getItem("token")
    myToken.settoken(newtoken)
})
myToken.settoken(localStorage.getItem("token"))
myToken.decodeJwt()
const userRole = ref(myToken.jwtPayload.roles)
const username = ref(myToken.jwtPayload.sub)

const User = ref({
  username: "",
  password: "",
});

const check = async () => {
  let result = await Authenfund(User.value);
  if (result == 200) {
    Swal.fire({
      icon: "success",
      title: "PASSWORD IS MATCH",
      confirmButtonText: "Continue",
      customClass: {
        container: 'your-custom-class',
        title: 'font-noto ann-message',
        content: 'your-content-class',
        confirmButton: 'your-confirm-button-class',
        cancelButton: 'font-noto',
      },
    });
  } else if(result === 404) {
    Swal.fire({
      icon: "error",
      title: "PASSWORD IS NOT MATCH",
      confirmButtonText: "Continue",
      customClass: {
        container: 'your-custom-class',
        title: 'font-noto text-red-500 ann-message',
        content: 'text-white',
        confirmButton: 'your-confirm-button-class',
        cancelButton: 'font-noto',
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "THE SPECIFIED USERNAME DOES NOT EXIST",
      confirmButtonText: "Continue",
      customClass: {
        container: 'your-custom-class',
        title: 'font-noto text-red-500 ann-message',
        content: 'text-white',
        confirmButton: 'your-confirm-button-class',
        cancelButton: 'font-noto',
      },
    });
  }
};
</script>

<template>
  <!-- Desktop -->
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4 max-lg:hidden">
    <div class="w-1/5 h-full pl-12 pb-2 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <h1 class="text-4xl font-semibold text-custom-black">SAS</h1>
            <h2 class="text-custom-blue font-medium">SIT Announcement System</h2>
          </div>
        </div>
      </div>
      <SideBar :username="username" :role="userRole"/>
    </div>
    <div class="w-4/5 h-full rounded-2xl flex flex-col pr-12 space-y-2">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6"></div>
      <!-- content  -->
      <div class="w-full flex h-5/6 bg-white shadow-md rounded-2xl">
        <div class="w-full flex flex-col justify-center items-center space-y-10">
          <div class="w-1/3 flex flex-col space-y-10 shadow-equal-shadow p-10 rounded-xl">
            <h1 class="text-4xl font-semibold ann-title text-center text-custom-black">Match Password</h1>
            <div class="w-full flex flex-row space-x-6 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512">
                <path fill="#58abe5"
                  d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z" />
              </svg>
              <input v-model="User.username" type="text"
                class="w-full border-x-0 border-t-0 border-b border-gray-400 text-custom-black focus:ring-0 text-base focus:border-b-2"
                placeholder="Username" />
            </div>
            <div class="w-full flex flex-row space-x-6 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path fill="#58abe5"
                  d="M7 15q1.25 0 2.125-.875T10 12q0-1.25-.875-2.125T7 9q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15Zm0 3q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q2.025 0 3.538 1.15T12.65 10h8.375L23 11.975l-3.5 4L17 14l-2 2l-2-2h-.35q-.625 1.8-2.175 2.9T7 18Z" />
              </svg>
              <input v-model="User.password" type="password"
                class="w-full border-x-0 border-t-0 border-b border-gray-600 text-custom-black focus:ring-0 text-base focus:border-b-2"
                placeholder="Password" />
            </div>
            <div class="w-full flex items-center justify-center">
              <button @click="check()"
                class="w-full font-bold text-center text-white text-lg py-4 rounded-xl bg-custom-blue transition-colors hover:bg-blue-500 duration-300 ann-button">
                  Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>