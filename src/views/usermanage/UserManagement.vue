<script setup>
import { ref } from 'vue';
import { getAllUser, deleteUserData } from '../../composable/userdata';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router/index.js'
import SideBar from '../../components/SideBar.vue'
import Swal from 'sweetalert2'

const { params } = useRoute()

onBeforeMount(async () => {
    const receivedData = ref([]);
    receivedData.value = await getAllUser();
    receivedData.value.forEach((x) => userList.value.push(x));
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

</script>

<template>
    <div class="min-h-screen bg-slate-50 flex flex-col font-noto">
        <!-- Header -->
        <div class="flex flex-row items-center p-8 ann-app-title space-x-6">
            <div class="flex items-center space-x-4 w-1/5">
                <img src="/images/sit.png" alt="SIT Logo" class="h-14 w-14">
                <div class="flex flex-col">
                    <h1 class="text-4xl font-bold text-custom-black">SAS</h1>
                    <h2 class="text-custom-blue font-bold">SIT Announcement System</h2>
                </div>
            </div>
            <div class="flex flex-col justify-center items-center w-full">
                <p class="text-4xl font-extrabold ann-title">User Management</p>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow px-8 py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <!-- Sidebar -->
            <SideBar />

            <!-- User Table -->
            <div class="w-full h-full md:w-4/5 bg-white rounded-2xl shadow-md overflow-y-hidden">
                <div class="w-full h-[49.5rem] overflow-y-scroll">
                    <table class="w-full table-fixed">
                        <thead class="">
                            <tr class="bg-custom-blue text-gray-50 text-lg font-bold sticky top-0">
                                <th class="w-1/12 py-4">No.</th>
                                <th class="w-1/6 py-4">Username</th>
                                <th class="w-1/6 py-4">Name</th>
                                <th class="w-1/4 py-4">Email</th>
                                <th class="w-1/6 py-4">Role</th>
                                <th class="w-1/6 py-4">Created On</th>
                                <th class="w-1/6 py-4">Updated On</th>
                                <th class="w-1/6 py-4">Action</th>
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
                        <button
                            class="w-12 h-12 bg-emerald-500 rounded-full flex justify-center items-center absolute top-20 right-9 hover:scale-110 transition duration-100 hover:cursor-pointer text-2xl text-white font-bold ann-button"
                            @click="router.push('/admin/user/add')">add
                        </button>
                        <p class="top-28 absolute font-bold ann-timezone">Date/Time shown in Timezone: <span
                                class="underline">{{ timezoneName }}</span></p>
                    </table>
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
}</style>