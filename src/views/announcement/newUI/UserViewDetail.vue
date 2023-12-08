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
import { getfileslist } from '../../../composable/filetransfer.js'
const { params } = useRoute()
const announcement = ref('')
const status = ref(true)
const fileslist = ref(null)
onBeforeMount(async () => {
  announcement.value = await getAnnouncementByIduser(params.id)
  status.value = announcement.value.ok
  if (status.value === false) {
    showAlert()
  }
  fileslist.value = await getfileslist(params.id)
  console.log(fileslist.value);
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
    submodal.value = false
  }, 300)
}
const submodal = ref(false)


const isAuthenticated = localStorage.getItem('refreshtoken')
const isExpired = async () => {
  const token = localStorage.getItem('token')

  let result = await checkToken(token);
  if (result !== 200) {
    let newToken = await getToken()
    if (newToken === 401) {
      router.push('/login')
    } else {
      localStorage.setItem('token', newToken)
      router.push('/admin/announcement')
    }
  } else {
    router.push('/admin/announcement')
  }
}
const bytetokb = (input) => {
  let resl = input / 1024;
  return resl.toFixed(2);
};

function download(id, filename) {
  // เปิดหน้าในแท็บใหม่
  window.open(`${import.meta.env.VITE_BASE_URL}/api/file/download?id=${id}&file=${filename}`, "_blank");
}

const getFileImage = (file) => {
  if (file.type.startsWith('image/')) {
    return 'imageImg'
  } else if (file.name.endsWith('zip') || file.name.endsWith('rar')) {
    return 'rarImg'
  } else return 'fileImg'
}
</script>

<template>
  <modalsub @closeme="closemodal" v-if="submodal" />
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4 max-[768px]:hidden">
    <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6 ">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <div class="flex space-x-8 relative">
              <h1
                class="font-semibold text-custom-black min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">
                SAS</h1>
              <div
                class="bg-slate-200 rounded-full hover:bg-custom-blue hover:text-white  transition duration-100 text-gray-500 hover:translate-x-1 "
                v-if="!isAuthenticated" @click="router.push('login')">
                <button class="  h-full flex items-center px-3  " id="loginbt"><span
                    class="material-symbols-outlined mr-3 ">login</span>Login</button>
              </div>

            </div>
            <h2 class="text-custom-blue font-medium min-[769px]:text-sm min-[1025px]:text-base">SIT Announcement System
            </h2>
            <h1 class="text-custom-black flex min-[769px]:text-sm min-[1025px]:text-base">
              <span class="">Timezone:</span><span class="material-symbols-outlined  font-thin">language</span>&nbsp;{{
                timezoneName }}
            </h1>
          </div>
        </div>
      </div>
      <div class="relative  h-[85%] space-y-2">
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

        <div class="w-full flex flex-col bg-white rounded-2xl   shadow-md  absolute bottom-0"
          v-show="!(fileslist == false)">
          <h1 class="w-full flex justify-center text-2xl pt-2 bg-custom-blue text-white rounded-t-2xl p-1">File Attach
          </h1>
          <div class="h-[22rem] overflow-y-auto">
            <div v-for="(file, index) in fileslist" :key="index"
              class="flex flex-row w-full justify-center items-center py-3 px-4 border-b">
              <img v-if="file.type !== null && getFileImage(file) === 'fileImg'" src="../../../assets/img/file.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
              <img v-else-if="file.type !== null && getFileImage(file) === 'imageImg'" src="../../../assets/img/imagefile.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
              <img v-else-if="file.type !== null && getFileImage(file) === 'rarImg'" src="../../../assets/img/rar.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
              <img v-else src="../../../assets/img/file.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
              <div class="flex flex-col w-full">
                <p class="font-semibold text-sm">{{ file.name }}</p>
                <p class="text-xs">{{ bytetokb(file.size) }} KB</p>
              </div>
              <button class="material-symbols-outlined pt-2 text-gray-400 hover:text-custom-blue"
                @click="download(params.id, file.name)">
                download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2 mt-10">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex flex-col items-center w-full h-full">
          <div class="flex flex-col justify-center items-center w-full h-full"></div>
          <div class="w-full justify-end flex font-noto relative">
            <p class="absolute left-0">
              <span class="">CATEGORIES : </span><span class="text-custom-blue font-bold">{{
                announcement.announcementCategory
              }}</span>
            </p>
            <p>
              <span class="font-bold text-custom-blue">{{
                announcement.viewCount
              }}</span><span class="">&nbsp; VIEWS</span>
            </p>
          </div>
        </div>
      </div>
      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl">
        <div class="relative w-full h-full">
          <div class="h-full rounded-2xl">
            <div class="w-full h-1/6 rounded-t-2xl flex items-center justify-center overflow-x-auto">
              <div class="text-3xl">{{ announcement.announcementTitle }}</div>
            </div>
            <div class="w-full flex justify-center items-center font-bold text-base">
              DESCRIPTION
            </div>
            <div class="w-full h-[35rem] rounded-t-2xl rounded-b-2xl overflow-y-auto flex justify-center">
              <div class="indent-8 break-words ql-editor mr-7" v-html="announcement.announcementDescription"></div>
            </div>
          </div>
          <div class="w-full absolute bottom-0 bg-red-700 h-5 rounded-b-2xl"
            v-if="dateformat(announcement.closeDate) != '-' && closedateshow()">
            <h1 class="text-white text-center">
              this Announcement Close On :
              {{ dateformat(announcement.closeDate) }}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="w-screen h-screen bg-white flex flex-row font-noto mt-4 min-[769px]:hidden">
    <div class="w-full h-full flex flex-col">
      <div class="w-2/6 h-14 bg-slate-100 rounded-2xl shadow-md text-gray-400 border ml-4 min-[426px]:w-1/5">
        <a href="#" @click="router.push('/announcement')"
          class="text-xl flex items-center rounded-t-2xl text-gray-500 group">
          <div class="flex flex-row mt-2 ml-3">
            <span
              class="text-2xl duration-200 material-symbols-outlined flex items-center justify-center max-[426px]:text-xl">arrow_back</span>
            <span
              class="flex items-center justify-center text-base duration-200 font-bold ml-2 pr-2 min-[426px]:text-base min-[426px]:ml-1">BACK</span>
          </div>
        </a>
      </div>

      <div
        class="w-[90%] h-full bg-white rounded-2xl flex flex-col mt-4 max-[769px]:w-11/12 max-[769px]:ml-7 max-[426px]:w-5/6 max-[426px]:ml-9 max-[376px]:w-5/6 max-[376px]:ml-8">
        <div class="flex flex-row items-center ann-app-title w-full h-1/6">
          <div class="flex flex-col items-center w-full h-full space-y-1">
            <div class="w-full justify-end flex font-noto relative min-[425px]:text-xs min-[320px]:text-xs">
              <p class="absolute left-0">
                <span class="">CATEGORIES : </span><span class="text-custom-blue font-bold">{{
                  announcement.announcementCategory
                }}</span>
              </p>
              <p>
                <span class="font-bold text-custom-blue">{{
                  announcement.viewCount
                }}</span><span class="">&nbsp; VIEWS</span>
              </p>
            </div>
            <div
              class="flex flex-col justify-center items-center w-full h-full bg-custom-blue rounded-tl-lg rounded-tr-lg">
              <div
                class="text-3xl font-bold min-[768px]:text-lg min-[320px]:text-lg flex items-center justify-center text-white pl-4">
                {{ announcement.announcementTitle }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-5/6 bg-white shadow-md rounded-bl-lg rounded-br-lg">
          <div class="relative w-full h-full">
            <div class="h-full rounded-2xl mt-4">
              <div
                class="w-full flex justify-center items-center font-bold text-base min-[426px]:text-base min-[376px]:text-base">
                DESCRIPTION
              </div>
              <div
                class="w-full h-[35rem] rounded-t-2xl rounded-b-2xl overflow-y-auto flex justify-center min-[426px]:text-sm">
                <div class="break-words flex justify-center pl-2" v-html="announcement.announcementDescription"></div>
              </div>
            </div>
            <div class="w-full absolute bottom-0 bg-red-700 h-5 rounded-b-2xl" v-if="dateformat(announcement.closeDate) != '-' && closedateshow()
              ">
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
