<script setup>
import { getCategory, addAnnouncement, deleteannocement } from "../../../composable/annAuth.js";
import { onMounted, ref, computed, onBeforeMount } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import router from "../../../router/index.js";
import Swal from "sweetalert2";
import SideBar from "../../../components/Sidebar.vue";
import Error from "../../../components/icon/Error.vue";
import Correct from "../../../components/icon/Correct.vue";
import { useToken } from "../../../stores/accresstoken.js";
import { getToken } from "../../../composable/Auth.js";
import { tranferfile } from "../../../composable/filetransfer.js";
import { useView } from "../../../stores/adminView";
import Login from "../../login.vue";

const myView = useView();

const myToken = useToken();
onBeforeMount(async () => {
  // let newtoken = localStorage.getItem("token")
  // myToken.settoken(newtoken)
});
onMounted(async () => {
  myView.view = "announcement";
  const receivedData = ref([]);
  receivedData.value = await getCategory();
  receivedData.value.forEach((data) => categoryAll.value.push(data));
});
myToken.settoken(localStorage.getItem("token"));
myToken.decodeJwt();
const userRole = ref(myToken.jwtPayload.roles);
const username = ref(myToken.jwtPayload.sub);

const categoryAll = ref([]);
const publishDate = ref(null);
const publishTime = ref(null);
const closeDate = ref(null);
const closeTime = ref(null);
const display = ref("");
const fillcurdatepb = ref(false);
const fillcurdatecl = ref(false);

const convertDate = (date, time, deftime) => {
  if (date === null || date === "") {
    return null;
  } else {
    try {
      return new Date(date + "T" + (time === null ? deftime : time))
        .toISOString()
        .replace(".000Z", "Z");
    } catch (error) {
      console.error(error);
    }
  }
};

const newAnnouncement = ref({
  announcementTitle: "",
  categoryId: "",
  announcementDisplay: "",
  announcementDescription: "",
  publishDate: null,
  closeDate: null,
});

const showErrorMessageT = ref(false);
const showErrorMessageC = ref(false);
const showErrorMessageD = ref(false);

function createdate(data) {
  let dateStr = data;
  let [day, month, year] = dateStr.split("/");
  let years = parseInt(year);
  year = years.toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }

  return year + "-" + day + "-" + month;
}

let opt = { year: "numeric", month: "numeric", day: "numeric" };

const startdate = computed(() => {
  const currentDate = new Date();
  let DATE = currentDate.toLocaleDateString("en-US", opt);
  return createdate(DATE);
});
const enddate = computed(() => {
  if (closeDate.value == "" || closeDate.value == null) {
    return "";
  }
  const currentDate = new Date(closeDate.value);
  let DATE = currentDate.toLocaleDateString("en-US", opt);
  return createdate(DATE);
});
const closestartdate = computed(() => {
  if (publishDate.value == "" || publishDate.value == null) {
    const currentDate = new Date();
    let opt = { year: "numeric", month: "numeric", day: "numeric" };
    let DATE = currentDate.toLocaleDateString("en-US", opt);
    return createdate(DATE);
  } else {
    const currentDate = new Date(publishDate.value);
    let DATE = currentDate.toLocaleDateString("en-US", opt);
    return createdate(DATE);
  }
});

const isDisabled = computed(() => {
  const checkfill = () => {
    const emptyValue = [];
    for (const [key, value] of Object.entries(newAnnouncement.value)) {
      if (!key.includes("Date") && !key.includes("Display") && value == "") {
        emptyValue.push(key);
      }
    }
    return emptyValue.length > 0 ? true : false;
  };
  const lencheck = () => {
    if (newAnnouncement.value.announcementTitle.trim().length == 0) {
      return true;
    }
    if (newAnnouncement.value.announcementDescription.trim().length == 0) {
      return true;
    }
    if (newAnnouncement.value.announcementTitle.length > 200) {
      return true;
    }
    if (newAnnouncement.value.announcementDescription.length > 10000) {
      return true;
    }
    return false;
  };
  const datecheckpb = () => {
    if (publishDate.value != "" && publishDate.value != null) {
      let currentdate = Date.now();
      let mydate = new Date(
        convertDate(publishDate.value, publishTime.value, "06:00")
      ).getTime();
      if (currentdate > mydate) {
        fillcurdatepb.value = true;
        return true;
      } else {
        fillcurdatepb.value = false;
      }
      return false;
    }
  };
  const datecheckcl = () => {
    if (publishDate.value == "" || publishDate.value == null) {
      if (closeDate.value != "" && closeDate.value != null) {
        let currentdate = Date.now();
        let mydate = new Date(
          convertDate(closeDate.value, closeTime.value, "18:00")
        ).getTime();
        if (currentdate > mydate) {
          fillcurdatecl.value = true;
          return true;
        } else {
          fillcurdatecl.value = false;
          return false;
        }
      }
    } else {
      if (closeDate.value != "" && closeDate.value != null) {
        let currentdate = Date.now();
        let mydate = new Date(
          convertDate(closeDate.value, closeTime.value, "18:00")
        ).getTime();
        let publishdd = new Date(
          convertDate(publishDate.value, publishTime.value, "06:00")
        ).getTime();
        if (currentdate > mydate || mydate < publishdd) {
          fillcurdatecl.value = true;
          return true;
        } else {
          fillcurdatecl.value = false;
          return false;
        }
      }
    }
    return false;
  };
  if (
    publishDate.value != null &&
    publishDate.value != "" &&
    publishTime.value == null
  ) {
    publishTime.value = "06:00";
  }
  if (
    closeDate.value != null &&
    closeDate.value != "" &&
    closeTime.value == null
  ) {
    closeTime.value = "18:00";
  }
  return checkfill() || lencheck() || datecheckpb() || datecheckcl();
});

const addnewdata = async () => {
  newAnnouncement.value.publishDate = convertDate(
    publishDate.value,
    publishTime.value
  );
  newAnnouncement.value.closeDate = convertDate(
    closeDate.value,
    closeTime.value
  );
  newAnnouncement.value.announcementDisplay = display.value == true ? "Y" : "N";
  result.value = await addAnnouncement(
    newAnnouncement.value,
    myToken.gettoken()
  );
  if (result.value.status == false) {
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
      localStorage.setItem("token", newtoken);
      result.value = await addAnnouncement(
        newAnnouncement.value,
        myToken.gettoken()
      );
    }
  } else {
    if (filedataslot.value >= 5) {
      showAlert();
    } else {
      let mydata = await result.value.data
      var formData = new FormData();
      formData.append('id', mydata.id)
      for (var i = 0; i < prefiledata.value.length; i++) {
        formData.append('files', prefiledata.value[i])
      }
      let filestatus = await tranferfile(formData, myToken.gettoken())
      if (filestatus == true) {
        showAlert();
      } else {
        await deleteannocement(mydata.id, myToken.gettoken());
        Swal.fire({
          icon: "error",
          title: "Cant create announcement",
          text: "Cannot attach file",
          confirmButtonText: "Try again",
        });
      }
      ////////////////////////////////////////////////FILEEEEEEE/////////////////////////////////////
    }
    //  showAlert();
  }
};
function clearcd() {
  closeDate.value = null;
  fillcurdatecl.value = false;
  if (closeTime != null || closeTime != "") {
    closeTime.value = null;
  }
}

function clearpd() {
  publishDate.value = null;
  fillcurdatepb.value = false;
  if (publishTime != null || publishTime != "") {
    publishTime.value = null;
  }
}

const result = ref(true);
const showAlert = () => {
  if (result.value.status === true) {
    Swal.fire({
      icon: "success",
      title: "Create Announcement Success!",
      confirmButtonText: "Continue",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      text: "Cannot create announcement.",
      confirmButtonText: "Back",
    });
  }
  router.push("/admin/announcement");
};

////////////////////////////////////////////

const filedataslot = ref(5);
const filemanage = ref(false);
const prefiledata = ref([]);
const filemnopen = () => {
  filemanage.value = true;
  var dropArea = document.getElementById("dropArea");
  var fileInput = document.getElementById("fileInput");
  var icon = document.getElementById("iconupload");
  dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropArea.classList.add("highlight");
    icon.classList.remove("text-gray-300");
    icon.classList.add("text-custom-blue");
  });

  // Remove the highlight when the drag leaves the drop area
  dropArea.addEventListener("dragleave", function () {
    dropArea.classList.remove("highlight");
    icon.classList.remove("text-custom-blue");
    icon.classList.add("text-gray-300");
  });

  // Handle dropped files
  dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    dropArea.classList.remove("highlight");
    icon.classList.remove("text-custom-blue");
    icon.classList.add("text-gray-300");
    var files = e.dataTransfer.files;
    validate(files)
  });

  // Clicking on the drop area triggers the hidden file input
  dropArea.addEventListener("click", function () {
    fileInput.click();
  });

  // Handle selected files when using the file input
  fileInput.addEventListener("change", function () {
    var listF = fileInput.files;
    validate(listF)
  });
  function validate(files) {
    let cheekun = 0
    let checksum = 0;
    let namevalid = 0;
    for (var i = 0; i < files.length; i++) {
      // console.log(files[i].size);
      if (files[i].size > 20971520) {
        checksum++;
      }
      let oo = prefiledata.value.find((x) => x.name == files[i].name)
      if (oo != undefined) {
        cheekun++
      }
      if (files[i].name.includes("%")) {
        namevalid++
      }
    }
    if (checksum <= 0 && cheekun <= 0 && namevalid <= 0) {
      if (files.length > filedataslot.value) {
        Swal.fire({
          icon: "warning",
          title: "Cant insert file",
          text: "Maximum 5 file",
          confirmButtonText: "Continue",
        });
      } else {
        handleFiles(files);
        filedataslot.value = filedataslot.value - files.length;
      }
      //  let selectedFiles = Array.from(files).slice(0, 5);
    } else {
      if (checksum > 0) {
        Swal.fire({
          icon: "warning",
          title: "File is too large!",
          text: "Supports files up to 20 MB",
          confirmButtonText: "Continue",
        });
      } else if (cheekun > 0) {
        Swal.fire({
          icon: "warning",
          title: "You have attached the file",
          text: "Duplicate file attachments are not allowed",
          confirmButtonText: "Continue",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "File name is not valid",
          text: "Not support file name include % ",
          confirmButtonText: "Continue",
        });
      }
    }
  }
  // Function to handle dropped or selected files
  function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
      prefiledata.value.push(files[i]);
    }
  }

};

const bytetokb = (input) => {
  let resl = input / 1024;
  return resl.toFixed(2);
};
const removefile = (index) => {
  prefiledata.value.splice(index, 1)
  filedataslot.value++

}

const enableinsertarea = computed(() => {
  return filedataslot.value > 0;
});

const getFileImage = (file) => {
  if (file.type.startsWith('image/')) {
    return 'imageImg'
  } else if (file.name.endsWith('zip') || file.name.endsWith('rar')) {
    return 'rarImg'
  } else return 'fileImg'
}
</script>

<template>
  <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4">
    <div class="w-1/5 h-full pl-12 pb-2 pr-8 space-y-2 sticky">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex items-center space-x-4 w-full">
          <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <h1 class="text-4xl font-semibold text-custom-black">SAS</h1>
            <h2 class="text-custom-blue font-medium">
              SIT Announcement System
            </h2>
          </div>
        </div>
      </div>
      <SideBar :username="username" :role="userRole" />
    </div>
    <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
      <div class="flex flex-row items-center ann-app-title w-full h-1/6">
        <div class="flex w-full h-full justify-start items-end">
          <p class="font-bold text-2xl">Create Announcement</p>
        </div>
      </div>

      <div class="w-full h-5/6 bg-white shadow-md rounded-2xl overflow-y-auto relative">
        <!-- <div class="absolute top-3 right-3 rounded-full  hover:scale-110 shadow-2xl cursor-pointer transition duration-150 z-50" @click="filemanage=false"><img src="/images/cross.png" alt="logo.png" class="h-14 w-14" v-if="filemanage"></div> -->
        <div class="w-full h-full bg-white" v-show="filemanage">
          <div class="w-full flex justify-center text-3xl pt-5 absolute h-1/5 items-start">
            <h1>File Attachments</h1>
          </div>
          <div class="flex h-full w-full items-center">
            <div class="w-full flex justify-center h-[70%]">
              <div class="flex w-full space-x-3 pr-3 pl-3">
                <div
                  class="border w-[60%] h-full flex flex-col rounded-l-2xl rounded-r-2xl items-center  pb-3 bg-white shadow-lg overflow-y-auto">
                  <h1 class="w-full text-center text-3xl bg-custom-blue text-white rounded-t-2xl pt-2 ">Uploaded Files
                  </h1>
                  <div v-for="(file, index) in prefiledata" :key="index"
                    class="flex flex-row w-full justify-center items-center py-3 px-4 border-b">
                    <img v-if="file.type !== null && getFileImage(file) === 'fileImg'" src="../../../assets/img/file.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
                    <img v-else-if="file.type !== null && getFileImage(file) === 'imageImg'" src="../../../assets/img/imagefile.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
                    <img v-else-if="file.type !== null && getFileImage(file) === 'rarImg'" src="../../../assets/img/rar.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
                    <img v-else src="../../../assets/img/file.png" alt="" width="52" height="52" class="w-[52px] h-[52px] mr-6">
                    <div class="flex flex-col w-full">
                      <p class="font-bold">{{ file.name }}</p>
                      <p class="text-sm">{{ file.type }}</p>
                      <p class="text-xs">{{ bytetokb(file.size) }} KB</p>
                    </div>
                    <button class="material-symbols-outlined pt-2 text-gray-400 hover:text-red-500"
                      @click="removefile(index)">
                      delete
                    </button>
                  </div>
                </div>
                <div id="dropArea" class="drop-area w-[40%] h-full flex items-center justify-center rounded-2xl"
                  v-show="enableinsertarea">
                  <div class="flex-col">
                    <span class="material-symbols-outlined text-6xl transition-colors duration-200 text-gray-300"
                      id="iconupload">cloud_upload</span>
                    <p class="text-gray-300">
                      Drag and drop files here or click this area to select
                      files
                    </p>
                    <p class="text-gray-300">Maximum file size is 20MB</p>
                  </div>
                  <input type="file" id="fileInput" multiple style="display: none" />
                </div>
                <div id="filemax" class=" w-[40%] h-full flex items-center justify-center rounded-2xl "
                  v-show="!enableinsertarea">
                  <div class="flex-col">
                    <span class="material-symbols-outlined text-6xl transition-colors duration-200 text-red-500"
                      id="iconupload">block</span>
                    <p class="text-custom-black">File is maximum : 5 file</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute top-3 right-4 hover:scale-110 transition duration-200 cursor-pointer"
            @click="filemanage = false">
            <img src="/images/cross.png" alt="Close" class="h-14 w-14" />
          </div>
        </div>
        <div class="create" v-show="!filemanage">
          <div class="flex flex-col w-full px-4 py-2 space-y-1">
            <label for="title" class="flex text-base font-bold">Title
              <Correct v-show="newAnnouncement.announcementTitle.trim().length >= 1" class="mt-0.5 ml-1 mr-1" />
              <span v-show="newAnnouncement.announcementTitle.trim().length >= 1" class="text-green-500">Title is
                valid</span>
            </label>
            <input v-model="newAnnouncement.announcementTitle" @click="
              showErrorMessageT =
              newAnnouncement.announcementTitle.trim().length === 0
              " type="text" id="title" maxlength="200" class="rounded-md placeholder:text-gray-400"
              placeholder="Learning Exchanging" />
            <p class="flex justify-end">
              {{ newAnnouncement.announcementTitle.trim().length }}/200
            </p>

            <p class="flex text-red-600 pb-4 font-bold" v-show="showErrorMessageT">

            <div>
              <span v-show="newAnnouncement.announcementTitle.trim().length === 0" class="flex">
                <Error />PLEASE FILL THE TITLE
              </span>
            </div>
            </p>
          </div>

          <div class="flex -mt-5">
            <div class="flex flex-col w-full px-4 py-2 space-y-1">
              <label class="text-base font-bold">Publish Date</label>
              <div class="flex flex-row space-x-4">
                <input v-model="publishDate" type="date" placeholder="01/05/2023" :min="startdate" :max="enddate"
                  class="border rounded-md bg-slate-100 text-lg py-2 px-4 ann-publish-date border-gray-600 text-gray-600"
                  id="publishDate" />
                <input :disabled="!publishDate" v-model="publishTime" type="time" placeholder="12:30"
                  class="border rounded-md bg-slate-100 text-lg py-2 px-4 ann-publish-time border-gray-600 text-gray-600"
                  id="publishDate" />
                <button :disabled="!publishDate"
                  class="px-4 py-2 rounded-md bg-orange-400 text-white text-base font-bold disabled:hidden"
                  @click="clearpd()">
                  clear
                </button>
              </div>
              <div class="flex text-red-500 ml-3 font-bold" v-show="fillcurdatepb">
                <Error></Error><span>publishdate must be a future</span>
              </div>
            </div>
            <div class="flex flex-col w-full px-4 py-2 space-y-1 -ml-96">
              <label class="text-base font-bold">Close Date</label>
              <div class="flex flex-row space-x-4">
                <input v-model="closeDate" type="date" placeholder="01/05/2023" :min="closestartdate"
                  class="border rounded-md bg-slate-100 text-lg py-2 px-4 ann-close-date border-gray-600 text-gray-600"
                  id="closeDate" />
                <input :disabled="!closeDate" v-model="closeTime" type="time" placeholder="12:30"
                  class="border rounded-md bg-slate-100 text-lg py-2 px-4 ann-close-time border-gray-600 text-gray-600"
                  id="closeDate" />
                <button :disabled="!closeDate"
                  class="px-4 py-2 rounded-md bg-orange-400 text-white text-base font-bold disabled:hidden"
                  @click="clearcd()">
                  clear
                </button>
              </div>
              <div class="flex text-red-500 ml-3 font-bold" v-show="fillcurdatecl">
                <Error></Error><span>must be later than publish date</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-1/6 px-4 py-2 space-y-1">
            <label for="category-select" class="flex text-base font-bold w-60">Category
              <Correct v-show="newAnnouncement.categoryId !== ''" class="mt-0.5 ml-1 mr-1" />
              <span v-show="newAnnouncement.categoryId !== ''" class="text-green-500">Category is valid</span>
            </label>
            <select v-model="newAnnouncement.categoryId" name="category" id="category-select"
              class="border rounded-md bg-slate-100 text-lg py-2 px-4 ann-category placeholder:text-gray-400"
              @click="showErrorMessageC = newAnnouncement.categoryId == ''">
              <option value="" disabled>Select a category</option>
              <option v-for="(item, index) in categoryAll" :key="index" :value="item.categoryID">
                {{ item.categoryName }}
              </option>
            </select>
          </div>
          <p class="flex text-red-600 py-2 pl-4 font-bold" v-show="showErrorMessageC">
            <Error />PLEASE SELECT CATEGORY
          </p>
          <div class="flex space-x-3">
            <div
              class="rounded-full bg-slate-100 px-4 py-1 justify-start hover:bg-custom-blue hover:text-white shadow-2xl cursor-pointer transition-colors duration-150 w-[10%] flex ml-3 text-gray-400 space-x-1 mt-2"
              id="filemanagement" @click="filemnopen">
              <span class="material-symbols-outlined">attach_file</span>
              <p>Attach File</p>
            </div>
            <p class="pt-3 text-green-500 font-bold" v-show="5 - filedataslot > 0">Attached {{ 5 - filedataslot }} File
            </p>
          </div>
          <div class="flex flex-col w-full h-2/6 px-4 py-2 space-y-1">
            <label class="flex text-base font-bold">Description
              <Correct v-show="newAnnouncement.announcementDescription.trim().length >= 1
                " class="mt-0.5 ml-1 mr-1" />
              <span v-show="newAnnouncement.announcementDescription.trim().length >= 1
                " class="text-green-500">Description is valid</span>
            </label>
            <QuillEditor v-model:content="newAnnouncement.announcementDescription" theme="snow" toolbar="full"
              contentType="html"
              class="h-[11.8rem] overflow-y-auto rounded-md placeholder:text-gray-400 border-gray-600 shadow-gray-500"
              @click="
                showErrorMessageD =
                newAnnouncement.announcementDescription.trim().length == 0
                "></QuillEditor>
            <p class="flex justify-end">
              {{ newAnnouncement.announcementDescription.trim().length }}/10000
            </p>
          </div>

          <div class="flex flex-col w-full px-4 py-2 space-y-1 -mt-8">
            <div>
              <p class="flex text-red-600 pb-2 font-bold" v-show="showErrorMessageD">
                <span class="flex" v-show="newAnnouncement.announcementDescription.trim().length === 0
                  ">
                  <Error />PLEASE FILL THE DESCRIPTION
                </span>
              </p>
            </div>

            <div class="space-x-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" v-model="display" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                </div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Display Announcement</span>
              </label>
            </div>
          </div>

          <div class="w-full flex justify-start p-4 space-x-2">
            <button :disabled="isDisabled"
              class="px-4 py-2 rounded-md bg-green-500 text-white text-base font-bold disabled:bg-zinc-500 ann-button"
              @click="addnewdata()">
              submit
            </button>
            <button class="px-4 py-2 rounded-md bg-red-500 text-white text-base font-bold"
              @click="router.push('/admin/announcement')">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  border: 4px solid #3182ce;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

::-webkit-scrollbar {
  display: none;
}

#dropArea {
  border: 2px dashed #ccc;
  text-align: center;
  cursor: pointer;
}

#filemax {
  border: 2px dashed #ff0000;
  text-align: center;
  cursor: default;
}

#dropArea.highlight {
  border-color: #2196f3;
}

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

/* th:last-child {
  text-align: center;
} */

td {
  padding: 1.5rem;
  text-align: left;
}
</style>