import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const useView = defineStore('adminView', () => {
    const view = ref(null)
    return { view }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useView, import.meta.hot))
}