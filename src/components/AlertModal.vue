<script setup>
import router from '../router';
const props = defineProps({
    action: String,
    ok: Boolean,
    status: Number,
    message: String
})

defineEmits(['changeToggle', 'deleteAnnouncement'])
</script>
<template>
    <div class="w-full inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 absolute">
        <div class="max-w-2xl px-6 py-10 w-1/3 bg-white shadow-xl flex items-center flex-col rounded-lg space-y-6">
            <div class="flex items-center">
                <img src="/icons/error.svg" alt="">
            </div>
            <div class="flex items-center justify-between">
                <h3 v-if="props.ok === false" class="text-2xl text-center">{{ props.message }}</h3>
                <!-- <h3 v-if="props.action==='add' && props.status !== false" class="text-2xl text-center">Add Announcement Success!</h3>
                <h3 v-else-if="props.status === false && props.action === 'add'" class="text-2xl text-center">Error, cannot add announcement!</h3>
                <h3 v-else-if="props.action === 'edit' && props.status !== false" class="text-2xl text-center">Edit Announcement Success!</h3>
                <h3 v-else-if="props.status === false && props.action === 'edit'" class="text-2xl text-center">Error, cannot edit announcement!</h3> -->
            </div>
            <div class="flex items-center">
                <button class="px-4 py-2 border border-emerald-500 bg-white text-emerald-500 rounded hover:bg-emerald-500 hover:text-white duration-100 font-bold text-lg" @click="router.push('/announcement')">
                    Back
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>