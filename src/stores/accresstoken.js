import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const acctoken = defineStore("acctoken", () => {
  const token = ref(null);
  const settoken = (mytoken) => {
    token.value=mytoken
}
  return { token,settoken };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(acctoken, import.meta.hot));
}

