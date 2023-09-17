<script setup>
import { ref } from 'vue';
import { getAllUser, deleteUserData } from '../../composable/userdata';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue'
import Swal from 'sweetalert2'
import AddIcon from '../../components/icon/AddIcon.vue';
import BurgerIcon from '../../components/icon/BurgerIcon.vue'
import CloseIcon from '../../components/icon/CloseIcon.vue'
import { useView } from '../../stores/adminView';

const { params } = useRoute()
const myView = useView()
onBeforeMount(async () => {
    const receivedData = ref([]);
    receivedData.value = await getAllUser();
    receivedData.value.forEach((x) => userList.value.push(x));
    myView.view = 'user'
});
const userList = ref([])

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

const status = ref(true)

const showAlert = (id) => {
    Swal.fire({
        title: 'Delete this user?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(id)
            Swal.fire(
                'Deleted!',
                'This user has been delete',
                'success'
            ).then(() => {
                location.reload()
            })
        }
    })
}

const deleteUser = async (id) => {
    status.value = await deleteUserData(id)
}

const isBurgerToggle = ref(false)
const toggleBurger = () => isBurgerToggle.value = !isBurgerToggle.value
</script>

<template>
    <!-- Desktop -->
    <div class="w-screen h-screen bg-slate-50 flex flex-row font-noto pb-16 pt-4 max-lg:visible">
        <div class="w-1/5 h-full pl-12 pr-8 space-y-2 sticky">
            <div class="flex flex-row items-center ann-app-title w-full h-1/6">
                <div class="flex items-center space-x-4 w-full">
                    <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                    <div class="flex flex-col">
                        <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                        <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                    </div>
                </div>
            </div>
            <SideBar />
        </div>
        <div class="w-4/5 h-full bg-slate-50 rounded-2xl flex flex-col pr-12 space-y-2">
            <div class="flex flex-row items-center ann-app-title w-full h-1/6">
                <div class="flex flex-col items-center w-full h-full">
                    <div class="flex flex-col justify-center items-center w-full h-2/3">
                        <p class="text-4xl font-extrabold ann-title">User Management</p>
                    </div>
                    <div class="w-full h-1/3 text-start flex flex-row items-center justify-between pb-4">
                        <p class="font-bold ann-timezone">
                            Date/Time shown in Timezone: <span class="underline">{{ timezoneName }}</span>
                        </p>
                        <button
                            class="bg-emerald-500 rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 transition duration-100 hover:cursor-pointer text-base text-white font-bold ann-button"
                            @click="router.push('/admin/user/add')">
                            <AddIcon />&nbsp;Add User
                        </button>
                    </div>
                </div>
            </div>
            <div class="w-full h-5/6 bg-white shadow-md rounded-2xl overflow-y-scroll">
                <table class="w-full table-fixed">
                    <thead class="">
                        <tr class="bg-custom-blue text-gray-50 text-lg font-bold sticky top-0">
                            <th class="w-1/12 py-4">No.</th>
                            <th class="w-1/6 py-4">Username</th>
                            <th class="w-1/4 py-4">Name</th>
                            <th class="w-1/4 py-4">Email</th>
                            <th class="w-1/6 py-4">Role</th>
                            <th class="w-1/5 py-4">Created On</th>
                            <th class="w-1/5 py-4">Updated On</th>
                            <th class="w-1/5 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr v-for="(user, index) in userList" :key="user.id"
                            class="text-gray-500 font-bold border-b last:border-0 ann-item">
                            <td class="py-2">{{ index + 1 }}</td>
                            <td class="py-2 ann-username">{{ user.username }}</td>
                            <td class="py-2 ann-name">{{ user.name }}</td>
                            <td class="py-2 ann-email">{{ user.email }}</td>
                            <td class="py-2 ann-role">{{ user.role }}</td>
                            <td class="py-2 ann-created-on">{{ dateformat(user.createdOn) }}</td>
                            <td class="py-2 ann-updated-on">{{ dateformat(user.updatedOn) }}</td>
                            <td class="flex items-center justify-center space-x-2 py-2">
                                <button class="rounded-lg px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white ann-button"
                                    @click="router.push(`/admin/user/${user.id}/edit`)">edit</button>
                                <button class="rounded-lg hover:bg-red-700 px-4 py-2 bg-red-500 text-white ann-button"
                                    @click="showAlert(user.id)">delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Mobile -->
    <div class="w-screen h-screen font-noto bg-slate-50 hidden">
        <div class="w-full flex flex-col justify-center py-6 px-8 space-y-2 bg-white sticky top-0">
            <div class="flex flex-row items-center ann-app-title w-full h-full">
                <div class="flex items-center space-x-4 w-full">
                    <img src="/images/logo.png" alt="SIT Logo" class="h-14 w-14">
                    <div class="flex flex-col">
                        <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                        <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                    </div>
                </div>
                <div @click="toggleBurger" class="h-[2em]">
                    <BurgerIcon v-if="isBurgerToggle === false" />
                    <CloseIcon v-if="isBurgerToggle === true" />
                </div>
            </div>
            <SideBar v-if="isBurgerToggle === true"/>
        </div>
        <div class="w-full flex-col py-4 px-8 space-y-6 overflow-y-scroll">
            <div class="flex flex-col justify-center items-center w-full">
                <p class="text-3xl font-extrabold ann-title">User Management</p>
            </div>
            <div class="flex flex-row items-center w-full justify-between overflow-y-scroll">
                <p class="font-bold ann-timezone text-sm w-2/3">
                    Date/Time shown in Timezone: <span class="underline">{{ timezoneName }}</span>
                </p>
                <button
                    class="bg-emerald-500 rounded-full py-2 px-4 flex justify-center items-center text-xs text-white font-bold ann-button"
                    @click="router.push('/admin/user/add')">
                    <AddIcon />&nbsp;Add User
                </button>
            </div>
            <div v-for="(user, index) in userList" :key="user.id" class="w-full flex flex-col rounded-2xl shadow-md space-y-1 py-3 px-4 bg-gradient-to-tr from-custom-blue to-sky-500 text-white">
                <div class="w-full flex flex-row space-x-6">
                    <span class="font-bold">#{{ index + 1 }}</span>
                    <span class="font-extrabold">{{ user.username }}</span>
                </div>
                <div>
                    <p class="w-full text-sm">Name : {{ user.name }}</p>
                    <p class="w-full text-sm">Role : {{ user.role }}</p>
                    <p class="w-full text-sm">Email : {{ user.email }}</p>
                    <p class="w-full text-sm">Created On : {{ dateformat(user.createdOn) }}</p>
                    <p class="w-full text-sm">Updated On : {{ dateformat(user.updatedOn) }}</p>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="rounded-full px-4 py-1 bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-sm font-bold ann-button"
                        @click="router.push(`/admin/user/${user.id}/edit`)">Edit</button>
                    <button class="rounded-full px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold ann-button"
                        @click="showAlert(user.id)">Delete</button>
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
    text-align: left;
}

th:last-child {
    text-align: center
}

td {
    padding: 1.5rem;
    text-align: left;
}

::-webkit-scrollbar {
    display: none;
}
</style>