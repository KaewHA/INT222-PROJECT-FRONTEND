import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const reftoken = defineStore('reftoken', () => {
    const refreshtoken = ref(null)
    return {  refreshtoken }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(reftoken, import.meta.hot))
}