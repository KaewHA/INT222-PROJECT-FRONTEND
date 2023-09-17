<script setup>
import router from "../router/index.js";
import { ref } from "vue";
import { Authenfund } from "../composable/userdata.js";
const User = ref({
  username: "".trim(),
  password: "".trim(),
});
const error=ref(false)
const check = async () => {
  let from = document.querySelector(".loginform");
  let load = document.querySelector(".loading");
  from.classList.add("hidden");
  load.classList.remove("hidden");
  let result = await Authenfund(User.value);
  if (result == 200) {
    setTimeout(() => {
      router.push("/admin/announcement");
    }, 1200);
  } else {
    setTimeout(() => {
      from.classList.remove("hidden");
      load.classList.add("hidden");
      error.value=true
    }, 1200);
  }
};
</script>

<template>
  <div
    class="w-screen h-screen bg-[url('/bk/loginbk2.jpg')] bg-cover font-noto " 
  >
    <div
      class="absolute top-10 left-5 text-xl hover:text-custom-black text-white hover:cursor-pointer transition-colors duration-300"
      @click="router.push('/announcement')"
    >
      <div class="flex">
        <span class="material-symbols-outlined">west</span>
        <p class="ml-5">Go back to Announcement</p>
      </div>
    </div>
    <div class="w-full h-full flex justify-center items-center">
      <div class="w-2/5 h-3/5 bg-transparent rounded-2xl">
        <div class="w-full flex justify-center">
          <img src="/images/logo.png" class="w-1/6 h-auto mr-12" />
          <div
            class="flex flex-col justify-center text-4xl text-white font-bold"
          >
            <h1>ADMIN SYSTEM</h1>
            <h1>SIT Announcement System</h1>
          </div>
        </div>

        <div
          class="w-full h-full flex justify-center items-center flex-col space-y-11"
        >
          <div class="w-2/6 rounded-2xl space-y-11 loginform">
            <div class="w-full flex justify-center text-red-500 font-extrabold shadow-2xl bg-white bg-opacity-40" v-if="error">username or password is wrong !</div>
            <div class="w-full flex flex-row space-x-6 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#FFFFFF"
                  d="m448 362.7l-117.3-21.3C320 320 320 310.7 320 298.7c10.7-10.7 32-21.3 32-32c10.7-32 10.7-53.3 10.7-53.3c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h512c0-64-21.3-138.7-64-149.3z"
                />
              </svg>
              <input
                type="text"
                v-model="User.username"
                class="w-full border-x-0 border-t-0 border-b bg-transparent text-slate-50 border-slate-200 focus:ring-0 text-base focus:border-cyan-200 ann-username transition-colors duration-300"
                placeholder="Username"
              />
            </div>
            <div class="w-full flex flex-row space-x-6 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#FFFFFF"
                  d="M7 15q1.25 0 2.125-.875T10 12q0-1.25-.875-2.125T7 9q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15Zm0 3q-2.5 0-4.25-1.75T1 12q0-2.5 1.75-4.25T7 6q2.025 0 3.538 1.15T12.65 10h8.375L23 11.975l-3.5 4L17 14l-2 2l-2-2h-.35q-.625 1.8-2.175 2.9T7 18Z"
                />
              </svg>
              <input
                type="password"
                v-model="User.password"
                class="w-full border-x-0 border-t-0 border-b bg-transparent text-slate-50 border-slate-200 focus:ring-0 text-base focus:border-cyan-200 ann-password"
                placeholder="Password"
              />
            </div>
            <button
              @click="check()"  
              class="w-full font-bold text-center text-white text-lg py-4 rounded-2xl bg-sky-600 transition-colors hover:bg-blue-500 duration-100 ann-button"
            >
              Log-in
            </button>
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
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: whitesmoke;
  opacity: 1; /* Firefox */
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
