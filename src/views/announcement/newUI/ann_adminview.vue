<script setup>
import { ref, computed } from "vue";
import {
  getAnnouncement,
  getCategory,
  deleteannocement,
} from "../../../composable/annAuth.js";
import { onBeforeMount } from "vue";
import router from "../../../router/index.js";
import Swal from "sweetalert2";
import AddIcon from "../../../components/icon/AddIcon.vue";
import SideBar from "../../../components/Sidebar.vue";
import { useView } from "../../../stores/adminView";
import { useToken } from "../../../stores/accresstoken.js";
import { getToken, checkToken } from "../../../composable/Auth.js";
import { getfileslist } from '../../../composable/filetransfer.js'
const myToken = useToken();
const fileslist=ref(null)
onBeforeMount(async () => {
  myView.view = "announcement";
  if (localStorage.getItem("token") != null || localStorage.getItem("token") != undefined) {
    let result = await checkToken(localStorage.getItem("token"));
    if (result == 200) {
      ///
    } else {
      let newtoken = await getToken();
      if (newtoken == 401) {
        localStorage.clear()
        router.push('/login')
      } else {
        localStorage.setItem("token", newtoken);
      }
    }
  } else {
    router.push('/login')
  }
  
  // let newtoken = localStorage.getItem("token")
  // myToken.settoken(newtoken)
  // myToken.decodeJwt()
  //////////////////////
  const receivedData = ref([]);
  receivedData.value = await getAnnouncement();
  receivedData.value.forEach((x) => allAnnouncement.value.push(x));
  const receivedCategory = await getCategory();
  receivedCategory.forEach((category) => allCategory.value.push(category));
  // console.log(receivedData.value)
  // console.log(myToken.jwtPayload);
});
myToken.settoken(localStorage.getItem("token"))
myToken.decodeJwt()
const userRole = ref(myToken.jwtPayload.roles)
const username = ref(myToken.jwtPayload.sub)

const category = ref(0);
const newdata = ref([]);
const allCategory = ref([]);
const allAnnouncement = ref([]);
const searchkeyword = ref("");
const options = {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};
const myView = useView();

const dateformat = (date) => {
  if (date === null) {
    return "-";
  } else {
    let mydate = new Date(date);
    return mydate.toLocaleDateString("en-GB", options);
  }
};
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

const showAlert = (id) => {
  Swal.fire({
    title: "Delete this announcement?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteanno(id);
      if (status.value == true) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "This announcement has been delete",
          confirmButtonText: "OK",
        }).then(() => {
          location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Can't Deleted!",
          text: "SOMETHING WENT WRONG",
          confirmButtonText: "Back",
        });
      }
    }
  });
};

const deleteanno = async (id) => {
  status.value = await deleteannocement(id, myToken.gettoken());
  if (status.value == false) {
    let newtoken = await getToken();
    if (newtoken == 401) {
      Swal.fire({
        icon: "error",
        title: "YOUR TOKEN HAS EXPIRE",
        text: "PLESE LOGIN AND TRY AGAIN",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/login");
      });
    } else {
      myToken.settoken(newtoken);
      status.value = await deleteannocement(id, myToken.gettoken());
    }
  }
};

const changeCategory = async () => {
  await fetchData();
};

const fetchData = async () => {
  newdata.value = [];
  const receivedData = await getAnnouncement("admin", category.value);
  receivedData.forEach((x) => newdata.value.push(x));
  if (newdata.value == 0) {
    alert("ไม่พบข้อมูล");
    let data = await getAnnouncement("admin", 0);
    category.value = 0;
    allAnnouncement.value = data;
  } else {
    allAnnouncement.value = newdata.value;
  }
};

const searchtitle = computed(() => {
  if (searchkeyword.value == "") {
    return "Search...";
  } else {
    return "";
  }
});

const searchvalue = computed(() => {
  return allAnnouncement.value.filter((x) =>
    x.announcementTitle
      .toLowerCase()
      .includes(searchkeyword.value.toLowerCase())
  );
});

const status = ref(true);
</script>
<template>
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4">
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
      <SideBar :username="username" :role="userRole" />
    </div>
    <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex flex-col items-center w-full h-full">
          <div class="flex flex-col justify-center items-center w-full h-2/3">
            <p class="text-4xl font-medium ann-title">
              Announcement Management
            </p>
          </div>
          <div class="w-full h-1/3 text-start flex flex-row items-center justify-between pb-4">
            <p class="font-normal ann-timezone">
              Date/Time shown in Timezone:
              <span class="underline">{{ timezoneName }}</span>
            </p>
            <button
              class="bg-emerald-500 rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 transition duration-100 hover:cursor-pointer text-base text-white font-medium ann-button"
              @click="router.push('/admin/announcement/add')">
              <AddIcon />&nbsp;Add Announcement
            </button>
          </div>
        </div>
      </div>
      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl overflow-y-scroll">
        <table class="w-full table-fixed">
          <thead class="w-full">
            <tr class="bg-custom-blue text-gray-50 text-lg font-medium sticky top-0">
              <th class="w-1/12 py-4">No.</th>
              <th class="w-1/4 py-4">Title</th>
              <th class="w-1/6 py-4">Category</th>
              <th class="w-1/6 py-4">Publish Date</th>
              <th class="w-1/6 py-4">Close Date</th>
              <th class="w-1/6 py-4 text-center">Display</th>
              <th v-if="userRole === 'admin'" class="w-1/6 py-4">Owner</th>
              <th class="w-1/6 py-4">Action</th>
            </tr>
          </thead>
          <tbody class="w-full">
            <tr v-for="(ann, index) in searchvalue" :key="index"
              class="text-custom-black font-normal border-b last:border-0 ann-item">
              <td class="w-1/12 py-2">{{ index + 1 }}</td>
              <td class="w-1/4 py-2 truncate">{{ ann.announcementTitle }}</td>
              <td class="w-1/6 py-2">{{ ann.announcementCategory }}</td>
              <td class="w-1/6 py-2 text-center">
                {{ dateformat(ann.publishDate) }}
              </td>
              <td class="w-1/6 py-2 text-center">{{ dateformat(ann.closeDate) }}</td>
              <td class="w-1/6 py-2">{{ ann.announcementDisplay }}</td>
              <td v-if="userRole === 'admin'" class="w-1/6 py-2">{{ ann.announcementOwner }}</td>
              <td class="w-auto flex py-2 space-x-2 justify-center">
                <button class="rounded-lg px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white ann-button"
                  @click="router.push(`/admin/announcement/${ann.id}`)">
                  View
                </button>
                <button class="rounded-lg hover:bg-red-700 px-4 py-2 bg-red-500 text-white ann-button"
                  @click="showAlert(ann.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

tbody tr:hover {
  background-color: rgba(107, 114, 128, 0.05);
}

th {
  padding: 1.5rem;
  text-align: left;
}

th:last-child {
  text-align: center;
}

td {
  padding: 1.5rem;
  text-align: left;
}

::-webkit-scrollbar {
  display: none;
}
</style>
