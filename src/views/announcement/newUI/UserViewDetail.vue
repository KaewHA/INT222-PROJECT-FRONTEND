<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAnnouncementByIduser } from '../../../composable/data.js'
import router from '../../../router/index.js'
import cdate from '../../../components/icon/TeenyiconsCalendarNoAccessOutline.vue'
import categoryico from '../../../components/icon/MdiListBox.vue'
import back from '../../../components/icon/back.vue'
import views from '../../../components/icon/IcBaselineRemoveRedEye.vue'
import Swal from 'sweetalert2'
import earth from '../../../components/icon/SystemUiconsGlobe.vue'
import modalsub from '../../../components/modalsunscribe.vue'
const { params } = useRoute()
const announcement = ref('')
const status = ref(true)
onBeforeMount(async () => {
  announcement.value = await getAnnouncementByIduser(params.id)
  status.value = announcement.value.ok
  if (status.value === false) {
    showAlert()
  }
})

const options = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
}
const dateformat = (date) => {
  if (date === null) {
    return '-'
  } else {
    let mydate = new Date(date)
    return mydate.toLocaleDateString('en-GB', options)
  }
}

const showAlert = () => {
  if (status.value === false) {
    Swal.fire({
      icon: 'error',
      title: announcement.value.message,
      confirmButtonText: 'Back',
    }).then(() => router.push('/announcement'))
  }
}
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone

const closedateshow = () => {
  const targetTime = new Date(announcement.value.closeDate)
  const currentTime = Date.now()
  if (targetTime < currentTime) {
    return true
  } else {
    return false
  }
}
const closemodal = () => {
  console.log("ss");
  setTimeout(() => {
    submodal.value=false
  }, 300)
}
const submodal=ref(false)
</script>

<template>
  <modalsub @closeme="closemodal" v-if="submodal"/>
  <div
    class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4 max-[768px]:hidden"
  >
    <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col space-x-1">
            <div class="text-3xl font-bold text-custom-black">SAS</div>
            <div class="text-custom-blue font-bold">
              SIT Announcement System
            </div>
            <div class="text-custom-black flex">
              <span class="font-bold w-full">Timezone :</span>
              <span class="material-symbols-outlined font-extralight">language</span>
              {{ timezoneName }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 ">
        <a href="#" @click="router.push('/announcement')"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span
            class="duration-200 material-symbols-outlined group-hover:ml-4 min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">arrow_back</span>
          <span
            class="flex items-center duration-200 font-medium group-hover:ml-4 min-[769px]:text-base min-[1025px]:text-base min-[1441px]:text-lg">BACK</span>
        </a>
      </div>
      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 ">
        <a href="#" @click="submodal = !submodal"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span
            class="duration-200 material-symbols-outlined group-hover:ml-4 min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">stars</span>
          <span
            class="flex items-center duration-200 font-medium group-hover:ml-4 min-[769px]:text-base min-[1025px]:text-base min-[1441px]:text-lg">Subscribe</span>
        </a>
      </div>
     
      
    </div>
    <div
      class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2 mt-10"
    >
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex flex-col items-center w-full h-full">
          <div
            class="flex flex-col justify-center items-center w-full h-full"
          ></div>
          <div class="w-full justify-end flex font-noto relative">
            <p class="absolute left-0">
              <span class="">CATEGORIES : </span
              ><span class="text-custom-blue font-bold">{{
                announcement.announcementCategory
              }}</span>
            </p>
            <p>
              <span class="font-bold text-custom-blue">{{
                announcement.viewCount
              }}</span
              ><span class="">&nbsp; VIEWS</span>
            </p>
          </div>
        </div>
      </div>
      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl">
        <div class="relative w-full h-full">
          <div class="h-full rounded-2xl">
            <div
              class="w-full h-1/6 rounded-t-2xl flex items-center justify-center overflow-x-auto"
            >
              <div class="text-3xl">{{ announcement.announcementTitle }}</div>
            </div>
            <div
              class="w-full flex justify-center items-center font-bold text-base"
            >
              DESCRIPTION
            </div>
            <div
              class="w-full h-[35rem] rounded-t-2xl rounded-b-2xl overflow-y-auto flex justify-center"
            >
              <div
                class="indent-8 break-words ql-editor mr-7"
                v-html="announcement.announcementDescription"
              ></div>
            </div>
          </div>
          <div
            class="w-full absolute bottom-0 bg-red-700 h-5 rounded-b-2xl"
            v-if="dateformat(announcement.closeDate) != '-' && closedateshow()"
          >
            <h1 class="text-white text-center">
              this Announcement Close On :
              {{ dateformat(announcement.closeDate) }}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="w-screen h-screen bg-white flex flex-row font-noto mt-4 min-[769px]:hidden"
  >
    <div class="w-full h-full flex flex-col">
      <div
        class="w-2/6 h-14 bg-slate-100 rounded-2xl shadow-md text-gray-400 border ml-4 min-[426px]:w-1/5"
      >
        <a
          href="#"
          @click="router.push('/announcement')"
          class="text-xl flex items-center rounded-t-2xl text-gray-500 group"
        >
          <div class="flex flex-row mt-2 ml-3">
            <span
              class="text-2xl duration-200 material-symbols-outlined flex items-center justify-center max-[426px]:text-xl"
              >arrow_back</span
            >
            <span
              class="flex items-center justify-center text-base duration-200 font-bold ml-2 pr-2 min-[426px]:text-base min-[426px]:ml-1"
              >BACK</span
            >
          </div>
        </a>
      </div>

      <div
        class="w-[90%] h-full bg-white rounded-2xl flex flex-col mt-4 max-[769px]:w-11/12 max-[769px]:ml-7 max-[426px]:w-5/6 max-[426px]:ml-9 max-[376px]:w-5/6 max-[376px]:ml-8"
      >
        <div class="flex flex-row items-center ann-app-title w-full h-1/6">
          <div class="flex flex-col items-center w-full h-full space-y-1">
            <div
              class="w-full justify-end flex font-noto relative min-[425px]:text-xs min-[320px]:text-xs"
            >
              <p class="absolute left-0">
                <span class="">CATEGORIES : </span
                ><span class="text-custom-blue font-bold">{{
                  announcement.announcementCategory
                }}</span>
              </p>
              <p>
                <span class="font-bold text-custom-blue">{{
                  announcement.viewCount
                }}</span
                ><span class="">&nbsp; VIEWS</span>
              </p>
            </div>
            <div
              class="flex flex-col justify-center items-center w-full h-full bg-custom-blue rounded-tl-lg rounded-tr-lg"
            >
              <div
                class="text-3xl font-bold min-[768px]:text-lg min-[320px]:text-lg flex items-center justify-center text-white pl-4"
              >
                {{ announcement.announcementTitle }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full h-5/6 bg-white shadow-md rounded-bl-lg rounded-br-lg"
        >
          <div class="relative w-full h-full">
            <div class="h-full rounded-2xl mt-4">
              <div
                class="w-full flex justify-center items-center font-bold text-base min-[426px]:text-base min-[376px]:text-base"
              >
                DESCRIPTION
              </div>
              <div
                class="w-full h-[35rem] rounded-t-2xl rounded-b-2xl overflow-y-auto flex justify-center min-[426px]:text-sm"
              >
                <div
                  class="break-words flex justify-center pl-2"
                  v-html="announcement.announcementDescription"
                ></div>
              </div>
            </div>
            <div
              class="w-full absolute bottom-0 bg-red-700 h-5 rounded-b-2xl"
              v-if="
                dateformat(announcement.closeDate) != '-' && closedateshow()
              "
            >
              <h1 class="text-white text-center">
                this Announcement Close On :
                {{ dateformat(announcement.closeDate) }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
