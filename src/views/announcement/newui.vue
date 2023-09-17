<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { getuserAnnouncement, getCategory } from "../../composable/data.js";
import { useMode } from "../../stores/mode.js";
import { useView } from "../../stores/adminView";
import { RouterLink } from "vue-router";
import router from "../../router";
import Swal from 'sweetalert2'
import earth from '../../components/icon/SystemUiconsGlobe.vue'

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

const showAlert = async () => {
  const { value: fruit } = await Swal.fire({
    title: 'Select your category',
    input: 'select',
    inputOptions: {
      'Category': {
        all: 'ทั้งหมด',
        general: 'ทั่วไป',
        intern: 'ฝึกงาน',
        jobs: 'หางาน',
        scholarship: 'ทุนการศึกษา'
      },
    },
    //   inputPlaceholder: 'Choose Category',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value === 'all') {
          category.value = 0
          changeCategory()
          resolve()
        } else if (value === 'scholarship') {
          let x = allCategory.value.find((x) => x.categoryName == "ทุนการศึกษา")
          category.value = x.categoryID
          changeCategory()
          resolve()
        } else if (value === 'general') {
          let x = allCategory.value.find((x) => x.categoryName == "ทั่วไป")
          category.value = x.categoryID
          changeCategory()
          resolve()
        } else if (value === 'intern') {
          let x = allCategory.value.find((x) => x.categoryName == "ฝึกงาน")
          category.value = x.categoryID
          changeCategory()
          resolve()
        } else if (value === 'jobs') {
          let x = allCategory.value.find((x) => x.categoryName == "หางาน")
          category.value = x.categoryID
          changeCategory()
          resolve()
        }
      })
    }
  })

  // if (fruit) {
  //   Swal.fire(`You selected: ${fruit}`)
  // }
}
</script>

<template>
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4">
    <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
            <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
            <h1 class="text-custom-black flex">
              <span class="font-bold">Timezone :</span>
              <earth class=""></earth>
              {{ timezoneName }}
            </h1>
          </div>

        </div>
      </div>


      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 max-lg:hidden">
        <a href="#" @click="changeMode('active')"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu"
          :class="myMode.mode == 'active' ? 'text-emerald-500' : ''">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">task_alt</span>
          <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Active</span>
        </a>
        <a href="#" @click="changeMode('close')"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group ann-menu"
          :class="myMode.mode == 'close' ? 'text-red-500' : ''">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">cancel</span>
          <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Close</span>
        </a>
      </div>

      <div class="w-full bg-white rounded-2xl shadow-md text-gray-400 max-lg:hidden">
        <a href="#" @click="showAlert"
          class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group ann-menu">
          <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
          <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">list</span>
          <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Choose Category</span>
        </a>
      </div>


    </div>
    <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex flex-col items-center w-full h-full">
          <div class="flex flex-col justify-center items-center w-full h-full">
          </div>
          <div class="w-full justify-end flex font-noto">
            <nav aria-label="Page navigation example" v-if="allAnnouncement.length != 0">
              <ul class="inline-flex -space-x-px text-base h-10">
                <li>
                  <button
                    class="flex items-center justify-center px-4 h-10 ml-0 leading-tight
       text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-custom-blue hover:text-white disabled:bg-sky-700 disabled:text-zinc-400"
                    @click="previousPage" :disabled="firstpage">Previous</button>
                </li>
                <li v-for="(value, index) in setOfPage" :key="index" @click="goToPage(value - 1)">
                  <a href="#" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500  border border-gray-30
       hover:text-gray-700 " :class="value - 1 === currentpage
         ? `bg-custom-blue text-white ann-page-${index}`
         : `text-custom-black hover:bg-slate-400 ann-page-${index}`
         ">{{ value }}</a>
                </li>
                <li>
                  <button class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border 
      border-gray-300 rounded-r-lg hover:bg-custom-blue hover:text-white disabled:bg-sky-700 disabled:text-zinc-300"
                    @click="nextPage" :disabled="lastpage">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl ">
        <div v-if="allAnnouncement.length != 0">
          <div v-for="(announcement, index) in allAnnouncement" :key="index" class="w-full h-full hover:cursor-pointer">
            <div class="" @click="router.push(`/announcement/${announcement.id}`)" @mouseover="moveup(index)"
              @mouseleave="movedown(index)">
              <div class="w-full  border hover:shadow-xl duration-500 "
                :class="index == 0 ? 'rounded-t-2xl' : '', index == 4 ? 'rounded-b-2xl' : ''">
                <div class="w-full flex h-[8.72rem] flex-col pl-10 pt-5 ">
                  <h1 class="font-noto text-4xl">#{{ index + 1 + currentpage * pageSize }} <span> {{
                    announcement.announcementTitle }}</span></h1>
                  <div class="flex mt-3">
                    <div class="rounded-xl bg-custom-blue text-white font-noto  p-1.5"><span
                        class=" material-symbols-outlined  text-base">list</span>{{ announcement.announcementCategory }}
                    </div>
                    <div v-if="myMode.mode === 'close'" class="p-2">Close ON : <span class="text-red-600">{{
                      dateformat(announcement.closeDate) }}</span></div>
                  </div>
                  <div class="w-full flex justify-end -ml-24 -mt-11 "><span
                      class="material-symbols-outlined duration-200  rounded-full p-2.5 text-custom-blue"
                      :id="index">navigate_next</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex w-full  h-full items-center justify-center  text-custom-black">
          <h1 class="text-4xl text-center font-noto">No Announcements</h1>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>