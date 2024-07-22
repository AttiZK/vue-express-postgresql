import axios from "./axios";
import { shallowRef } from "vue";
import { store } from "./store";

export const hasErrorOccured = shallowRef(false);
export const errorMessage = shallowRef(null);
export const emailError = shallowRef(false);
export const passwordError = shallowRef(false);
export const passwordErrorMessge = shallowRef(null);

export const useFetch = async (path, userData) => {
  try {
    const response = await axios.post(path, userData);
    localStorage.setItem("token", response.data.token);
    store.updateHasLogin(true);
  } catch (err) {
    console.log("error: ", err.response ? err.response.data : err.message);
    if (err.response) {
      if (err.response.data.error == "Az email cím megadása kötelező") {
        emailError.value = true;
      } else if (err.response.data.error == "Az jelszó megadása kötelező") {
        passwordErrorMessge.value = null;
        passwordError.value = true;
      } else if (err.response.data.error == "Helytelen jelszó!") {
        passwordError.value = true;
        passwordErrorMessge.value = err.response.data.error;
      } else {
        hasErrorOccured.value = true;
        errorMessage.value = err.response.data.error;
      }
    } else {
      hasErrorOccured.value = true;
      errorMessage.value = err.message;
    }
  }
};

export const turnOffError = () => {
  emailError.value = false;
  passwordError.value = false;
  hasErrorOccured.value = false;
};
