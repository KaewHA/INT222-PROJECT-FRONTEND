<script setup>
import { ref } from "vue";
import SideBar from "../../components/SideBar.vue";
import Swal from "sweetalert2";
import { Authenfund } from '../../composable/userdata.js';
const User = ref({
  username: "".trim(),
  password: "".trim(),
});



const check = async () => {
  let result = await Authenfund(User.value);
  if (result == true) {
    Swal.fire({
      icon: "success",
      title: "PASSWORD IS MATCH",
      confirmButtonText: "Continue",
      customClass: {
        container: 'your-custom-class',
        title: 'your-title-class',
        content: 'your-content-class',
        confirmButton: 'your-confirm-button-class',
        cancelButton: 'font-noto',
      },
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "PASSWORD IS NOT MATCH",
      confirmButtonText: "Continue",
      customClass: {
        container: 'your-custom-class',
        title: 'font-noto text-red-500',
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
    <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
            <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
          </div>
        </div>
      </div>
      <SideBar />
    </div>
    <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6"></div>
      <!-- content  -->
      <div
        class="w-full h-5/6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100 via-slate-200 to-slate-400 shadow-md rounded-2xl">
        <!-- setup space -->
        <div class="w-full h-full flex justify-center items-center">
          <!-- content space  -->
          <div class="w-3/5 h-5/6 bg-white rounded-2xl shadow-2xl">
            <!--  head -->
            <div class="mt-5 flex flex-col justify-center items-center w-full">
              <p class="text-4xl font-extrabold ann-title text-custom-black">
                Match Password
              </p>
            </div>
            <!-- input -->
            <div class="w-full h-3/6 flex justify-center items-center">
              <div class="flex-col w-4/5">
                <div class="relative mb-6">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512">
                      <path fill="#58abe5"
                        d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z" />
                    </svg>
                  </div>
                  <input v-model="User.username" type="text"
                    class="bg-gray-50 border border-gray-300 text-custom-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username" />
                </div>
                <div class="relative mb-6">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                      <path fill="#58abe5"
                        d="M7 15q1.25 0 2.125-.875T10 12q0-1.25-.875-2.125T7 9q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15Zm0 3q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q2.025 0 3.538 1.15T12.65 10h8.375L23 11.975l-3.5 4L17 14l-2 2l-2-2h-.35q-.625 1.8-2.175 2.9T7 18Z" />
                    </svg>
                  </div>
                  <input v-model="User.password" type="password"
                    class="bg-gray-50 border border-gray-300 text-custom-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Password" />
                </div>
                <div class="w-full flex items-center justify-center">
                  <button @click="check()"
                    class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span
                      class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Match
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
