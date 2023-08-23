<script setup>
import { ref, computed } from 'vue';
import { getAnnouncement, getCategory, deleteannocement } from '../../../composable/data.js';
import { onBeforeMount } from 'vue';
import router from '../../../router/index.js'
import Swal from 'sweetalert2'
import pluss from '../../../components/icon/IcRoundAddCircle.vue'
import SideBar from '../../../components/SideBar.vue';
onBeforeMount(async () => {
    const receivedData = ref([]);
    receivedData.value = await getAnnouncement();
    receivedData.value.forEach((x) => allAnnouncement.value.push(x));
    const receivedCategory = await getCategory();
    receivedCategory.forEach((category) => allCategory.value.push(category));
});
const category = ref(0);
const newdata = ref([]);
const allCategory = ref([]);
const allAnnouncement = ref([]);
const searchkeyword = ref('')
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
const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

const showAlert = (id) => {
    Swal.fire({
        title: 'Delete this announcement?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteanno(id)
            Swal.fire(
                'Deleted!',
                'This announcement has been delete',
                'success'
            ).then(() => {
                location.reload()
            })
        }
    })
}

const deleteanno = async (id) => {
    status.value = await deleteannocement(id)
}

const changeCategory = async () => {
    await fetchData();
};

const fetchData = async () => {
    newdata.value = [];
    const receivedData = await getAnnouncement(
        "admin",
        category.value
    );
    receivedData.forEach((x) => newdata.value.push(x));
    if (newdata.value == 0) {
        alert("ไม่พบข้อมูล")
        let data = await getAnnouncement("admin", 0)
        category.value = 0
        allAnnouncement.value = data
    } else {
        allAnnouncement.value = newdata.value;
    }
};

const searchtitle = computed(() => {
    if (searchkeyword.value == "") {
        return 'Search...'
    } else {
        return ''
    }
})

const searchvalue = computed(() => {
    return allAnnouncement.value.filter((x) => x.announcementTitle.toLowerCase().includes(searchkeyword.value.toLowerCase()))
})

const status = ref(true)
</script>
<template>
    <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        <!-- Header -->
        <div class="flex items-center justify-between p-8">
            <div class="flex items-center space-x-4">
                <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                    <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow px-8 py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <!-- Sidebar -->
            <SideBar />

            <!-- User Table -->
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md  h-[47rem] overflow-auto">
                <table class="w-full  table-fixed" v-if="allAnnouncement.length != 0">
                    <thead>
                        <tr class="bg-custom-blue text-gray-50 text-lg font-bold ">
                            <th class="w-1/12 py-4 text-center">No.</th>
                            <th class="w-2/6 py-4 text-left">Title</th>
                            <th class="w-1/6 py-4 text-left">Category</th>
                            <th class="w-1/6 py-4 text-left">Publish Date</th>
                            <th class="w-1/6 py-4 text-left">Close Date</th>
                            <th class="w-1/12 py-2 text-center">Display</th>
                            <th class="w-1/12 py-2 text-center">View</th>
                            <th class="w-1/6 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ann, index) in searchvalue" :key="index"
                            class="text-gray-500 font-bold border-b last:border-0">
                            <td class="py-2 text-center">{{ index + 1 }}</td>
                            <td class="py-2 text-left">{{ ann.announcementTitle }}</td>
                            <td class="py-2 text-left">{{ ann.announcementCategory }}</td>
                            <td class="py-2 text-left">{{ dateformat(ann.publishDate) }}</td>
                            <td class="py-2 text-left">{{ dateformat(ann.closeDate) }}</td>
                            <td class="py-2 text-center">{{ ann.announcementDisplay }}</td>
                            <td class="py-2 text-center">{{ ann.viewCount }}</td>
                            <td class="flex items-center justify-center space-x-2 py-2">
                                <button class="rounded-lg hover:bg-sky-700 px-4 py-2 bg-sky-600 text-white "
                                    @click="router.push(`/admin/announcement/${ann.id}`)">View</button>
                                <button class="rounded-lg hover:bg-red-900 px-4 py-2 bg-red-500 text-white"
                                    @click="showAlert(ann.id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                    <div class="w-16 h-16 bg-emerald-500 rounded-full flex justify-center items-center absolute top-20 right-5 z-10 hover:scale-110 transition duration-100 hover:cursor-pointer"
                        @click="router.push('/admin/announcement/add')">
                        <h1 class="text-xl text-white">+</h1>
                    </div>
                </table>

                <div v-else class="w-full h-full  flex flex-col justify-center bg-white">
                    <div class="flex justify-center items-center"><img src="/images/empty.png" class="w-3/12 h-3/12"></div>

                    <h1 class="text-4xl flex w-full items-center justify-center font-noto text-sky-900">
                        No Announcements
                    </h1>
                    <div class="w-full flex justify-center mt-6">
                        <button @click="router.push('/admin/announcement/add')"
                            class=" w-2/6 rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-600 flex justify-center noad">
                            <pluss class="e"></pluss> <span class="f">ADD THE FIRST ANNOUNCEMENT</span>
                        </button>
                    </div>
                </div>
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
}

th:last-child {
    text-align: center
}

td {
    padding: 1.5rem;
}</style>