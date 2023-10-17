import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const useToken = defineStore("acctoken", () => {
  const token = ref(null);
  const settoken = (mytoken) => {
    token.value = mytoken;
  };
  const gettoken = () => {
    return token.value;
  };

  const jwtPayload = ref(null);
  const decodeJwt = () => {
    if (token.value) {
      const base64Url = token.value.split(".")[1];
      const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      jwtPayload.value = JSON.parse(jsonPayload);
    }
  }
  return { token, settoken, gettoken, jwtPayload, decodeJwt };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToken, import.meta.hot));
}
