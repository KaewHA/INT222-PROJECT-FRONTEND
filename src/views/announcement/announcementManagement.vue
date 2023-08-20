<script setup>
import { ref } from 'vue';
import { getAnnouncement,getCategory } from '../../composable/data.js';
import { onBeforeMount } from 'vue';
import router from '../../router/index.js'

onBeforeMount(async () => {
    const receivedData = ref([]);
    receivedData.value = await getAnnouncement();
    receivedData.value.forEach((x) => allAnnouncement.value.push(x));
    const receivedCategory = await getCategory();
    receivedCategory.forEach((category) => allCategory.value.push(category));
});
const allAnnouncement = ref([])
const allCategory = ref([])
//date///
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


</script>

<template>  
    <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        <!-- Header -->
        <div class="flex items-center justify-between p-8">
            <div class="flex items-center space-x-4">
                <img src="/images/sit.png" alt="SIT Logo" class="h-14 w-14">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                    <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow px-8 py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <!-- Sidebar -->
            <div class="w-full md:w-1/5 bg-white rounded-2xl shadow-md text-gray-400">
                <a href="#" @click="router.push('/admin/announcement')"
                    class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 rounded-t-2xl hover:text-custom-blue active:text-custom-blue group">
                    <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                    <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">campaign</span>
                    <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">Announcement</span>
                </a>
                <a href="#" @click="router.push('/admin/user')"
                    class="py-8 pr-4 text-xl flex items-center space-x-2 hover:bg-slate-100 hover:text-custom-blue active:text-custom-blue group">
                    <span class="w-4 h-8 bg-custom-blue invisible group-hover:visible rounded-r-lg"></span>
                    <span class="text-4xl duration-200 material-symbols-outlined group-hover:ml-4">person</span>
                    <span class="flex items-center text-lg duration-200 font-bold group-hover:ml-4">User</span>
                </a>
            </div>

            <!-- User Table -->
            <div class="w-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-hidden">
                <table class="w-full table-fixed">
                    <thead>
                        <tr class="bg-custom-blue text-gray-50 text-lg font-bold">
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
                        <tr v-for="(ann, index) in allAnnouncement" :key="index" class="text-gray-500 font-bold border-b last:border-0">
                            <td class="py-2 text-center">{{ index + 1 }}</td>
                            <td class="py-2 text-left">{{ ann.announcementTitle  }}</td>
                            <td class="py-2 text-left">{{ ann.announcementCategory }}</td>
                            <td class="py-2 text-left">{{ dateformat(ann.publishDate) }}</td>
                            <td class="py-2 text-left">{{ dateformat(ann.closeDate) }}</td>
                            <td class="py-2 text-center">{{ ann.announcementDisplay }}</td>
                            <td class="py-2 text-center">{{ ann.viewCount }}</td>
                            <td class="flex items-center justify-center space-x-2 py-2">
                                <button class="rounded-lg bg-slate-200 px-4 py-2">Edit</button>
                                <button class="rounded-lg bg-slate-200 px-4 py-2">Delete</button>
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
}

th:last-child {
    text-align: center
}

td {
    padding: 1.5rem;
}
</style>