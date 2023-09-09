import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const useMode = defineStore('mode', () => {
    const mode = ref('active')
    const changeMode = (setmode) => {
        mode.value=setmode
    }
    return { mode, changeMode }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMode, import.meta.hot))
}