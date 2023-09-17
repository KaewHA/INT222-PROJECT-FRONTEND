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
</script>

<template>
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto">
    <div class="w-full h-full bg-slate-50 rounded-2xl flex flex-col space-y-2">
      <div
        class="w-full h-full bg-white shadow-md rounded-2xl overflow-y-scroll"
      >
        <div
          class="flex flex-row mt-8 w-full justify-center first:justify-start"
        >
          <span
            @click="router.push('/announcement')"
            class="material-symbols-outlined flex items-center justify-center ml-12 p-2 text-slate-500 fixed cursor-pointer hover:rounded-full hover:bg-blue-500 hover:text-white duration-150"
            >arrow_back</span
          >
          <p
            class="text-center flex justify-center items-center absolute right-16 font-extrabold text-base rounded-3xl text-white px-4 py-2 from-cyan-500 to-blue-500 bg-gradient-to-r"
          >
            <span class="material-symbols-outlined">visibility</span
            >&nbsp;&nbsp;
            {{ announcement.viewCount }}
          </p>
          <p
            class="text-center flex justify-center items-center absolute right-44 font-extrabold text-base rounded-3xl text-white px-4 py-2 bg-gradient-to-r"
            :class="
              announcement.announcementDisplay !== 'Y'
                ? 'from-rose-700 to-red-600'
                : 'from-green-500 to-emerald-600'
            "
          >
            <span
              v-if="announcement.announcementDisplay === 'Y'"
              class="material-symbols-outlined"
              >check_circle</span
            >
            <span v-else class="material-symbols-outlined">cancel</span>
            &nbsp;&nbsp;{{ announcement.announcementDisplay }}
          </p>
        </div>
        <div class="w-full py-4 px-14 flex flex-row">
          <div class="w-full space-y-9">
            <h2 class="text-2xl text-gray-600 font-bold w-full pt-6">
              {{ announcement.announcementTitle }}
            </h2>
            <div class="w-full flex flex-row space-x-8">
              <p
                class="w-1/12 font-bold py-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center"
              >
                {{ announcement.announcementCategory }}
              </p>
            </div>
            <div class="w-full flex flex-row ">
              <p
                class="w-1/3 flex justify-center items-center font-bold py-2 rounded-3xl bg-gradient-to-r from-rose-700 to-red-600 text-white text-center space-x-4"
              >
                <span class="material-symbols-outlined">event_busy</span>
                <span>Close on : {{ dateformat(announcement.closeDate) }}</span>
              </p>
            </div>
            <div
              class="w-full h-80 overflow-y-scroll text-lg font-bold text-gray-700 border rounded-md py-6 px-8"
            >
              <p
                class="indent-8"
                v-html="announcement.announcementDescription"
              ></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  
</template>

<style scoped>
tr {
  padding: 10px;
}

td {
  padding: 10px;
}

.ann-button:hover .x {
  display: inline;
}

.ann-button:hover .y {
  display: none;
}

.ann-button .x {
  display: none;
}

.ann-button .y {
  display: inline;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.5em;
}

h4 {
  font-size: 1.17em;
}

h5 {
  font-size: 0.83em;
}

h6 {
  font-size: 0.67em;
}
</style>
