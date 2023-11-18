<script setup>
import router from '../router/index.js'
import { ref, onBeforeMount } from 'vue'
import { Authenfund, getToken, checkToken } from '../composable/Auth.js'
import { useToken } from '../stores/accresstoken.js'

const myToken = useToken()
onBeforeMount(async () => {})

const User = ref({
  username: '',
  password: '',
})

const error = ref(false)
const nouser = ref(false)
const check = async () => {
  let from = document.querySelector('.loginform')
  let load = document.querySelector('.loading')
  from.classList.add('hidden')
  load.classList.remove('hidden')
  let result = await Authenfund(User.value)
  if (result == 401) {
    setTimeout(() => {
      nouser.value = false
      from.classList.remove('hidden')
      load.classList.add('hidden')
      error.value = true
    }, 1200)
    setTimeout(() => {
      error.value = false
    }, 4000)
  } else if (result == 404) {
    setTimeout(() => {
      error.value = false
      from.classList.remove('hidden')
      load.classList.add('hidden')
      nouser.value = true
    }, 1200)
    setTimeout(() => {
      nouser.value = false
    }, 4000)
  } else {
    setTimeout(() => {
      myToken.settoken(result)
      myToken.decodeJwt()
      router.push('/admin/announcement')
    }, 1200)
  }
}

const back = () => {
router.push('announcement')
}
</script>

<template>
  <div
    class="w-screen h-screen flex justify-center items-center bg-[url('/bk/loginbk2.jpg')] bg-cover font-noto max-[767px]:hidden"
  >
    <div
      class="w-[60%] h-full flex flex-row justify-center items-center loginform relative"
    >
      <div
        class="w-[60%] h-4/6 flex flex-col bg-white/30 backdrop-blur-3xl justify-center items-center rounded-l-3xl p-14"
      >
      <div
          class="absolute top-5 left-6 rounded-full cursor-pointer w-[5%]  bg-slate-200 hover:bg-sky-700 hover:-translate-x-3 transition duration-400 flex justify-center hover:text-white px-4"
          @click="back"><span class="material-symbols-outlined justify-center text-xl">arrow_back</span></div>
        <img src="/images/logo.png" class="w-[45%] mb-4 max-[769px]:w-full" />

        <h1
          class="w-full text-lg text-white mt-6 flex justify-center items-center max-[769px]:text-sm max-[769px]:mt-9"
        >
          SIT Announcement System
        </h1>
      </div>

      <div
        class="w-[40%] h-4/6 flex flex-col rounded-r-3xl bg-white bg-opacity-90 items-center relative"
      >
        <h1 class="w-[60%] flex text-2xl text-white tracking-wide  rounded-r-full absolute left-0 top-10 bg-custom-blue 
          pl-4 max-[1024px]:w-5/6 max-[1025px]:w-[70%] max-[1280px]:mr-28 max-[1280px]:ml-2 max-[1024px]:mr-12 max-[1025px]:text-xl 
          max-[1280px]:text-lg max-[769px]:w-6/7 max-[769px]:text-base max-[769px]:mr-10">Admin System</h1>
        <div class=" flex items-center h-full ">
          <div class="flex-col space-y-8">
          <h1 class="w-full text-2xl text-center text-gray-600 font-bold">
            Login
          </h1>
          <div class="w-full flex flex-col items-center space-y-6">
            <div
              class="w-[80%] flex flex-row items-center px-4 border-b-2 border-custom-blue"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
              >
                <path
                  fill="rgb(77 157 224)"
                  d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z"
                />
              </svg>
              <input
                type="text"
                v-model="User.username"
                class="w-full border-0 bg-transparent text-base text-custom-black focus:ring-0 placeholder:text-gray-500 placeholder:font-normal ml-2 ann-username max-[1025px]:text-xs"
                placeholder="Username"
              />
            </div>
            <div
              class="w-[80%] h-11 flex flex-row items-center px-4 py-2 border-b-2 border-custom-blue"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="rgb(77 157 224)"
                  d="M7 15q1.25 0 2.125-.875T10 12q0-1.25-.875-2.125T7 9q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15Zm0 3q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q2.025 0 3.538 1.15T12.65 10h8.375L23 11.975l-3.5 4L17 14l-2 2l-2-2h-.35q-.625 1.8-2.175 2.9T7 18Z"
                />
              </svg>
              <input
                type="password"
                v-model="User.password"
                class="w-full border-0 bg-transparent text-base text-custom-black focus:ring-0 placeholder:text-gray-500 placeholder:font-normal ml-2 ann-password max-[1025px]:text-xs"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="flex justify-center items-center">
            <button
              @click="check()"
              class="w-36 h-10 text-center text-white text-lg bg-sky-500 hover:bg-sky-600 rounded-full ann-button mt-2"
            >
              Login
            </button>
          </div>
        </div>
        </div>
      </div>
      <div
        class="w-auto flex absolute top-24 justify-center text-sky-800 font-bold text-base bg-white py-4 px-6 rounded-lg"
        v-if="error"
      >
        Password is Incorrect
      </div>
      <div
        class="w-auto flex absolute top-24 justify-center text-sky-800 font-bold text-base bg-white py-4 px-6 rounded-lg"
        v-if="nouser"
      >
        A user with the specified username DOES NOT exist
      </div>
    </div>
    <div class="loading hidden">
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-custom-blue"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>

  <!-- Moblie -->

  <div
    class="w-screen h-screen flex justify-center items-center bg-[url('/bk/loginbk2.jpg')] bg-cover font-noto min-[768px]:hidden"
  >
    <div
      class="w-full h-full flex flex-row justify-center items-center loginform relative"
    >
      <div
        class="w-4/5 h-[70%] flex flex-col justify-center items-center rounded-3xl bg-white bg-opacity-80 relative"
      >
      <div
          class="absolute top-5 left-6 rounded-full cursor-pointer w-[5%]  bg-slate-400 hover:bg-sky-700 hover:-translate-x-3 transition duration-400 flex justify-center hover:text-white px-4"
          @click="back"><span class="material-symbols-outlined justify-center text-xl">arrow_back</span></div>
        <img src="/images/logo.png" class="w-[25%] mb-6" />
        
        <div class="pl-14 pr-14">
          <h1
            class="w-full text-2xl text-center text-gray-600 font-extrabold justify-center items-center max-[375px]:text-lg"
          >
            Admin System
          </h1>
          <p
            class="flex justify-center items-center text-gray-500 text-xs mb-6 max-[375px]:text-"
          >
            SIT Announcement System
          </p>
          <div class="w-full flex flex-col items-center space-y-6">
            <div
              class="w-full flex flex-row items-center px-4 bg-white border-white rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
              >
                <path
                  fill="rgb(77 157 224)"
                  d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z"
                />
              </svg>
              <input
                type="text"
                v-model="User.username"
                class="w-full border-0 bg-transparent text-base text-custom-black focus:ring-0 placeholder:text-gray-500 placeholder:font-normal ml-2 ann-username max-[1025px]:text-xs"
                placeholder="Username"
              />
            </div>
            <div
              class="w-full h-9 flex flex-row items-center px-4 py-2 bg-white border-white rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="rgb(77 157 224)"
                  d="M7 15q1.25 0 2.125-.875T10 12q0-1.25-.875-2.125T7 9q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15Zm0 3q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q2.025 0 3.538 1.15T12.65 10h8.375L23 11.975l-3.5 4L17 14l-2 2l-2-2h-.35q-.625 1.8-2.175 2.9T7 18Z"
                />
              </svg>
              <input
                type="password"
                v-model="User.password"
                class="w-full border-0 bg-transparent text-base text-custom-black focus:ring-0 placeholder:text-gray-500 placeholder:font-normal ml-2 ann-password max-[1025px]:text-xs"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="flex justify-center items-center">
            <button
              @click="check()"
              class="w-36 h-10 text-center text-white text-lg bg-sky-500 hover:bg-sky-600 rounded-full ann-button mt-8"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-auto flex absolute top-24 justify-center text-sky-800 font-bold text-base bg-white py-4 px-6 rounded-lg"
        v-if="error"
      >
        Password is Incorrect
      </div>
      <div
        class="w-auto flex absolute top-24 justify-center text-sky-800 font-bold text-base bg-white py-4 px-6 rounded-lg"
        v-if="nouser"
      >
        A user with the specified username DOES NOT exist
      </div>
    </div>
    <div class="loading hidden">
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-custom-blue"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: whitesmoke;
  opacity: 1;
  /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: whitesmoke;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: whitesmoke;
}
</style>
