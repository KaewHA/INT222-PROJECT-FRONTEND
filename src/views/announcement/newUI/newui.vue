<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { getuserAnnouncement, getCategory } from "../../../composable/data.js";
import { useMode } from "../../../stores/mode.js";
import router from "../../../router";
import Swal from 'sweetalert2'
import earth from '../../../components/icon/SystemUiconsGlobe.vue'
import { getToken, checkToken } from "../../../composable/Auth";
import { sendOTP, CHECKOTP, ADDNEWSUB } from "../../../composable/subscribe";
import jwtDecode from "jwt-decode";
import modalsub from '../../../components/modalsunscribe.vue'
const totalpage = ref(0);
const pageSize = ref(0);
const currentpage = ref(0);
const allAnnouncement = ref([]);
const allCategory = ref([]);
const category = ref(0);
const newdata = ref([]);
const myMode = useMode();
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
const lastpage = ref(false);
const firstpage = ref(false);

const setOfPage = computed(() => {
  const totalPages = totalpage.value;
  const currentPage = currentpage.value;
  const range = 10

  if (totalPages <= range) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  let start = Math.max(currentPage - Math.floor(range / 2), 1);
  let end = start + range - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - range + 1, 1);
  }

  // Adjust start and end if currentPage is greater than range/2
  if (currentPage > Math.floor(range / 2)) {
    start = currentPage - Math.floor(range / 2);
    end = start + range - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - range + 1, 1);
    }
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
const setOfpagex = computed(() => {
  let range = 10
  let page = currentpage.value + 1
  let pagelist = []
  if (totalpage.value > 10) {
    if (page < range) {
      for (let i = 1; i <= 10; i++) {
        pagelist.push(i)
      }
    } else if (page >= range) {
      for (let i = 1; i <= 10; i++) {
        pagelist.push(i + (page - range))
      }
    }
  } else {
    for (let i = 1; i <= totalpage.value; i++) {
      pagelist.push(i)
    }
  }
  return pagelist
})

const nextPage = async () => {
  if (currentpage.value < totalpage.value) {
    currentpage.value++;
    await fetchData();
  }
};

const previousPage = async () => {
  if (currentpage.value > 0) {
    currentpage.value--;
    await fetchData();
  }
};

const goToPage = async (page) => {
  currentpage.value = page;
  await fetchData();
};

const changeMode = async (mode) => {
  currentpage.value = 0;
  myMode.changeMode(mode);
  await fetchData();
};

const changeCategory = async () => {
  currentpage.value = 0;
  await fetchData();
};

const fetchData = async () => {
  newdata.value = [];
  const receivedData = await getuserAnnouncement(
    myMode.mode,
    currentpage.value,
    category.value
  );
  receivedData.content.forEach((x) => newdata.value.push(x));
  pageSize.value = receivedData.size;
  totalpage.value = receivedData.totalPages;
  lastpage.value = receivedData.last;
  firstpage.value = receivedData.first;
  allAnnouncement.value = newdata.value;
};

onBeforeMount(async () => {
  await fetchData();
  const receivedCategory = await getCategory();
  receivedCategory.forEach((category) => allCategory.value.push(category));
});
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

const moveup = (index) => {
  let icon = document.getElementById(index.toString())
  icon.classList.remove("text-custom-blue")
  icon.classList.add("text-white")
  icon.classList.add("bg-custom-blue")

}

const movedown = (index) => {
  let icon = document.getElementById(index.toString())
  icon.classList.remove("bg-custom-blue")
  icon.classList.remove("text-white")
  icon.classList.add("text-custom-blue")
}

// const showAlert = async () => {
//   const { value: fruit } = await Swal.fire({
//     title: 'Select your category',
//     input: 'select',
//     inputOptions: {
//       'Category': {
//         all: 'ทั้งหมด',
//         general: 'ทั่วไป',
//         intern: 'ฝึกงาน',
//         jobs: 'หางาน',
//         scholarship: 'ทุนการศึกษา'
//       },
//     },
//     //   inputPlaceholder: 'Choose Category',
//     showCancelButton: true,
//     inputValidator: (value) => {
//       return new Promise((resolve) => {
//         if (value === 'all') {
//           category.value = 0
//           changeCategory()
//           resolve()
//         } else if (value === 'scholarship') {
//           let x = allCategory.value.find((x) => x.categoryName == "ทุนการศึกษา")
//           category.value = x.categoryID
//           changeCategory()
//           resolve()
//         } else if (value === 'general') {
//           let x = allCategory.value.find((x) => x.categoryName == "ทั่วไป")
//           category.value = x.categoryID
//           changeCategory()
//           resolve()
//         } else if (value === 'intern') {
//           let x = allCategory.value.find((x) => x.categoryName == "ฝึกงาน")
//           category.value = x.categoryID
//           changeCategory()
//           resolve()
//         } else if (value === 'jobs') {
//           let x = allCategory.value.find((x) => x.categoryName == "หางาน")
//           category.value = x.categoryID
//           changeCategory()
//           resolve()
//         }
//       })
//     }
//   })
// }
const isActiveAnn = ref(true)
const handleCheckboxChange = () => {
  isActiveAnn.value = !isActiveAnn.value
  if (myMode.mode === 'close') {
    changeMode('active')
  } else {
    changeMode('close')
  }
}

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
const categoryselect = (id) => {
  if (id === 1) {
    category.value = 0
    changeCategory()
  } else if (id === 2) {
    let x = allCategory.value.find((x) => x.categoryName == "ทั่วไป")
    category.value = x.categoryID
    changeCategory()
  }
  else if (id === 3) {
    let x = allCategory.value.find((x) => x.categoryName == "ทุนการศึกษา")
    category.value = x.categoryID
    changeCategory()
  }
  else if (id === 4) {
    let x = allCategory.value.find((x) => x.categoryName == "ฝึกงาน")
    category.value = x.categoryID
    changeCategory()
  }
  else if (id === 5) {
    let x = allCategory.value.find((x) => x.categoryName == "หางาน")
    category.value = x.categoryID
    changeCategory()
  }
  closemodal("#Choose")
}
const closemodal = (id) => {
  const content = document.querySelector(id)
  content.classList.add('hidemodal-content')
  setTimeout(() => {
    Choosecategory.value = false
  }, "230");
}
const Choosecategory = ref(false)
const submodal=ref(false)
const closemodals = () => {
  setTimeout(() => {
    submodal.value=false
  }, 300)
}
</script>

<template>
<modalsub @closeme="closemodals" v-if="submodal"/>
  <div class="fixed inset-0 bg-black bg-opacity-25 z-30 flex justify-center items-center" v-if="Choosecategory">
    <div class="modal-overlay bg-transparent w-full h-full z-40 modalscope" @click="closemodal('#Choose')">
    </div>
    <div class="w-2/5 h-2/6 bg-white rounded-xl z-50 absolute modal-content" id="Choose">
      <div class="w-full flex justify-center items-center space-x-3 text-custom-blue pt-6">
        <span class="material-symbols-outlined text-4xl">list</span>
        <p class="text-3xl font-bold font-noto">Choose Category</p>
      </div>
      <h2 class="text-gray-500 text-sm text-center">Select the category of announcements you want to display.</h2>
      <div class="w-full h-5/6 flex flex-wrap space-x-3 justify-center items-center text-gray-400">
        <div
          class="w-2/12 h-3/6 hover:bg-custom-blue rounded-xl bg-white transition duration-300 flex justify-center items-center flex-col shadow-md cursor-pointer"
          @click="categoryselect(1)">
          <div
            class="hover:-translate-y-1 w-full h-full flex justify-center items-center flex-col transition hover:text-white duration-500">
            <span class="material-symbols-outlined">apps</span>
            <p>ทั้งหมด</p>
          </div>
        </div>
        <div
          class="w-2/12 h-3/6 hover:bg-custom-blue rounded-xl bg-white transition duration-300 flex justify-center items-center flex-col shadow-md cursor-pointer"
          @click="categoryselect(2)">
          <div
            class="hover:-translate-y-1 w-full h-full flex justify-center items-center flex-col transition hover:text-white duration-500">
            <span class="material-symbols-outlined ">info</span>
            <p>ทั่วไป</p>
          </div>
        </div>
        <div
          class="w-2/12 h-3/6 hover:bg-custom-blue rounded-xl bg-white transition duration-300 flex justify-center items-center flex-col shadow-md cursor-pointer"
          @click="categoryselect(3)">
          <div
            class="hover:-translate-y-1 w-full h-full flex justify-center items-center flex-col transition hover:text-white duration-500">
            <span class="material-symbols-outlined ">attach_money</span>
            <p>ทุนการศึกษา</p>
          </div>
        </div>
        <div
          class="w-2/12 h-3/6 hover:bg-custom-blue rounded-xl bg-white transition duration-300 flex justify-center items-center flex-col shadow-md cursor-pointer"
          @click="categoryselect(4)">
          <div
            class="hover:-translate-y-1 w-full h-full flex justify-center items-center flex-col transition hover:text-white duration-500">
            <span class="material-symbols-outlined ">work_history</span>
            <p>ฝึกงาน</p>
          </div>
        </div>
        <div
          class="w-2/12 h-3/6 hover:bg-custom-blue rounded-xl bg-white transition duration-300 flex justify-center items-center flex-col shadow-md cursor-pointer"
          @click="categoryselect(5)">
          <div
            class="hover:-translate-y-1 w-full h-full flex justify-center items-center flex-col transition hover:text-white duration-500">
            <span class="material-symbols-outlined ">work</span>
            <p>หางาน</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4 max-[768px]:hidden">
    <div class="h-full pl-12 pr-8 space-y-2 sticky min-[769px]:w-2/6 min-[1025px]:w-[25%] min-[1441px]:w-1/5">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <div class="flex space-x-8 relative">
            <h1 class="font-semibold text-custom-black min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">SAS</h1>
            <div class="bg-slate-200 rounded-full hover:bg-custom-blue hover:text-white  transition duration-100 text-gray-500 hover:translate-x-1 " v-if="!isAuthenticated" @click="router.push('login')" >
              <button class="  h-full flex items-center px-3  " id="loginbt"><span class="material-symbols-outlined mr-3 " >login</span>Login</button></div>
            
            </div>
            <h2 class="text-custom-blue font-medium min-[769px]:text-sm min-[1025px]:text-base">SIT Announcement System</h2>
            <h1 class="text-custom-black flex min-[769px]:text-sm min-[1025px]:text-base">
              <span class="">Timezone:</span><span class="material-symbols-outlined  font-thin">language</span>&nbsp;{{ timezoneName }}
            </h1>
          </div>
        </div>
      </div>
      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400">
        <a href="#" @click="changeMode('active')"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu"
          :class="myMode.mode == 'active' ? 'text-emerald-500' : ''">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span
            class="duration-200 material-symbols-outlined group-hover:ml-4 min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">task_alt</span>
          <span
            class="flex items-center duration-200 font-medium group-hover:ml-4 min-[769px]:text-base min-[1025px]:text-base min-[1441px]:text-lg">Active</span>
        </a>
        <a href="#" @click="changeMode('close')"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
          :class="myMode.mode == 'close' ? 'text-red-500' : ''">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span
            class="duration-200 material-symbols-outlined group-hover:ml-4 min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">cancel</span>
          <span
            class="flex items-center duration-200 font-medium group-hover:ml-4 min-[769px]:text-base min-[1025px]:text-base min-[1441px]:text-lg">Close</span>
        </a>
      </div>
     
      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 ">
        <a href="#" @click="Choosecategory = !Choosecategory"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span
            class="duration-200 material-symbols-outlined group-hover:ml-4 min-[769px]:text-2xl min-[1025px]:text-3xl min-[1441px]:text-4xl">list</span>
          <span
            class="flex items-center duration-200 font-medium group-hover:ml-4 min-[769px]:text-base min-[1025px]:text-base min-[1441px]:text-lg">Choose
            Category</span>
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
      <button @click="isExpired" v-if="isAuthenticated"
        class="absolute bottom-0 text-center text-lg text-gray-600 rounded-xl border-2 py-3 px-7 hover:bg-custom-blue hover:text-white">BACK</button>
    </div>
    <div
      class="h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2 min-[769px]:w-4/6 min-[1025px]:w-[75%] min-[1440px]:w-4/5">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex flex-col items-center w-full h-full">
          <div class="flex flex-col justify-center items-center w-full h-full">
          </div>
          <div class="w-full justify-end flex font-noto">
            <nav aria-label="Page navigation example " v-if="allAnnouncement.length != 0">
              <ul class="inline-flex -space-x-px text-base h-10" >
                <li>
                  <button class="flex items-center justify-center px-4 h-10 ml-0 leading-tight
       text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-custom-blue hover:text-white disabled:bg-sky-700 disabled:text-zinc-400
        min-[769px]:text-sm min-[1025px]:text-base" @click="previousPage" :disabled="firstpage">Previous</button>
                </li>
                <li v-for="(value, index) in setOfPage" :key="index" @click="goToPage(value - 1)">
                  <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 border border-gray-30 
                  hover:text-gray-700 min-[769px]:text-sm min-[1025px]:text-base" :class="value - 1 === currentpage
                    ? `bg-custom-blue text-white ann-page-${index}`
                    : `text-custom-black hover:bg-slate-400 ann-page-${index}`
                    ">{{ value }}</a>
                </li>
                <li>
                  <button class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border text-sm
      border-gray-300 rounded-r-lg hover:bg-custom-blue hover:text-white disabled:bg-sky-700 disabled:text-zinc-300 
        min-[769px]:text-sm min-[1025px]:text-base" @click="nextPage" :disabled="lastpage">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl overflow-auto">
        <div v-if="allAnnouncement.length != 0">
          <div v-for="(announcement, index) in allAnnouncement" :key="index" class="w-full h-auto hover:cursor-pointer">
            <div class="" @click="router.push(`/announcement/${announcement.id}`)" @mouseover="moveup(index)"
              @mouseleave="movedown(index)">
              <div class="w-full border hover:shadow-xl duration-500 relative"
                :class="index == 0 ? 'rounded-t-2xl' : '', index == 4 ? 'rounded-b-2xl' : ''">
                <div class="w-full flex flex-col 
                min-[769px]:pt-3 min-[769px]:pl-6 min-[769px]:h-[7rem]
                min-[1025px]:pl-10 min-[1025px]:pt-5 min-[1025px]:h-[9rem]">
                  <h1 class="w-full font-noto min-[769px]:text-xl min-[1025px]:text-2xl truncate">#{{ index + 1 +
                    currentpage * pageSize }}
                    <span>{{ announcement.announcementTitle }}</span>
                  </h1>
                  <div class="flex mt-3">
                    <div class="flex justify-center items-center mt-3 rounded-xl bg-custom-blue text-white font-noto p-1.5
                      min-[769px]:text-sm
                      min-[1025px]:text-base">
                      <span class="material-symbols-outlined min-[769px]:text-sm min-[1025px]:text-base">list</span>{{
                        announcement.announcementCategory }}
                    </div>
                    <div v-if="myMode.mode === 'close'" class="p-2 flex justify-center items-center mt-3">Close ON :&nbsp;
                      <span class="text-red-600">{{ dateformat(announcement.closeDate) }}</span>
                    </div>
                  </div>
                  <div class="w-full flex justify-end -mt-11 min-[769px]:-ml-10 min-[1025px]:-ml-24"><span
                      class="material-symbols-outlined duration-200 rounded-full p-2.5 text-custom-blue"
                      :id="index">navigate_next</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex w-full  h-full items-center justify-center text-custom-black">
          <h1 class="text-4xl text-center font-noto">No Announcements</h1>
        </div>
      </div>
    </div>
  </div>

  <!-- Moblie & Tablet -->
  <div class="w-screen h-screen min-[769px]:hidden font-noto relative">
    <header class="w-full flex flex-col top-0">
      <div class="w-full flex flex-row shadow-md h-1/6 p-4 justify-center items-center space-x-1">
        <img src="/images/logo.png" alt="logo.png" class="h-9 w-9">
        <h1 class="text-center font-semibold text-3xl text-sky-800">SAS</h1>
      </div>
    </header>
    <section class="w-full px-5 relative">
      <div class="w-full pt-6 space-y-3 mb-3">
        <h1 class="text-center text-3xl text-gray-500 font-semibold">Announcement</h1>
      </div>
      <div class="w-full flex flex-row justify-evenly items-center text-lg mb-5 text-slate-500">
        <div class="flex flex-row space-x-2">
          <label class="flex text-slate-500 text-base items-center font-bold">Category : </label>
          <select name="categories" class="border-gray-400 rounded-sm text-sm py-1">
            <option selected>ทั้งหมด</option>
            <option @click="changeCategory" v-for="category in allCategory" :value="category.categoryName">{{
              category.categoryName }}</option>
          </select>
        </div>
        <div class="flex flex-col justify-center">
          <p v-if="myMode.mode === 'active'" class="text-xs text-center font-bold">Switch to Closed</p>
          <p v-else class="text-xs text-center font-bold">Switch to Active</p>
          <label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none justify-center items-center'>
            <input type='checkbox' :checked="isActiveAnn" @click="handleCheckboxChange" class='sr-only' />
            <span class="slider mx-4 flex h-[1.2rem] w-10 items-center rounded-full p-1 duration-200"
              :class="isActiveAnn ? 'bg-emerald-600' : 'bg-red-700'">
              <span class="dot h-3 w-3 rounded-full bg-white duration-200"
                :class="isActiveAnn ? 'translate-x-[20px]' : ''"></span>
            </span>
          </label>
        </div>
      </div>
      <div v-if="allAnnouncement.length != 0" v-for="(announcement, index) in allAnnouncement" :key="index"
        @click="router.push(`/announcement/${announcement.id}`)" class="w-full h-1/5 flex flex-row mb-3 relative">
        <p class="w-[12%] flex p-3 bg-sky-600 text-white text-center justify-center items-center rounded-l-md">
          {{ index + 1 + currentpage * pageSize }}
        </p>
        <div class="w-[88%] flex flex-col py-2 px-3 bg-slate-50 justify-center rounded-r-md space-y-2">
          <p class="font-semibold truncate text-slate-600 pr-5">{{ announcement.announcementTitle }}</p>
          <p class="text-sm text-slate-600">Category : <span class="text-sky-600 font-semibold">{{
            announcement.announcementCategory }}</span>
          </p>
        </div>
        <span class="material-symbols-outlined duration-200 absolute right-2 top-3 rounded-full p-2.5 text-custom-blue"
          :id="index">navigate_next</span>
      </div>
      <h1 v-else class="w-full text-center text-2xl">No Announcements</h1>
      <div v-if="totalpage > 1" class="w-full flex flex-row justify-center items-center absolute left-0 -bottom-11">
        <ul class="inline-flex space-x-2">
          <li>
            <button class="text-slate-400 text-center w-8 h-8 font-bold text-lg"
              :class="firstpage ? 'invisible' : 'visible'" @click="previousPage" :disabled="firstpage">
              &lt;
            </button>
          </li>
          <li v-for="(value, index) in setOfPage" :key="index" @click="goToPage(value - 1)">
            <a href="#" class="flex items-center justify-center rounded-md w-8 h-8 font-bold"
              :class="value - 1 === currentpage ? `bg-sky-600 text-white` : `text-slate-400`">
              {{ value }}
            </a>
          </li>
          <li>
            <button class="text-slate-400 text-center w-8 h-8 font-bold text-lg"
              :class="lastpage ? 'invisible' : 'visible'" @click="nextPage" :disabled="lastpage">
              &gt;
            </button>
          </li>
        </ul>
      </div>
    </section>
    <footer class="w-full absolute bottom-0 bg-sky-600 p-1">
      <h3 class="w-full flex flex-row justify-center text-center text-sm text-white">Timezone :&nbsp;
        <span class="flex items-center">
          <earth />
        </span>{{ timezoneName }}
      </h3>
    </footer>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}

.modalscope {
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  animation: pulse 0.3s ease-out;
}

.hidemodal-content {
  animation: pulsereverse 0.3s ease-out;
}

.hidemodal-contentslide {
  animation: pulsereverseslide 1s ease-out;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(.9);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulsereverse {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    opacity: 0;
    transform: scale(.3);
  }
}


@keyframes pulsereverseslide {
  0% {
    width: 100%;
  }

  50% {
    width: 0%;
  }

  65% {
    width: 0%;
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    width: 0%;
    opacity: 0;
    transform: scale(0);
  }
}






</style>