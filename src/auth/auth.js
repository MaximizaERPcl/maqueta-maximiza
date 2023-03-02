import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
import CryptoJS from "crypto-js";

const URL_API =
  process.env.NODE_ENV === "production"
    ? window.location.protocol +
      "//" +
      window.location.host +
      process.env.VUE_APP_API_URL
    : process.env.VUE_APP_API_URL;

export default {
  login(rut, password) {
    let data = qs.stringify({
      usuario: rut,
      clave: password,
    });
    return axios.post(URL_API + "login", data);
  },
  async setUserLogged(userLogged) {
    var expireTime = new Date(new Date().getTime() + 14.95 * 60 * 1000);
    sessionStorage.setItem("userImageMxz", userLogged.imagen_b64);
    delete userLogged.imagen_b64;
    var usuarioEncriptado = CryptoJS.AES.encrypt(
      JSON.stringify(userLogged),
      process.env.VUE_APP_CRYPT_KEY
    ).toString();
    Cookies.set("userLoggedMxz", usuarioEncriptado, {
      expires: expireTime,
    });
    //store.dispatch("updateBits");
    Cookies.set("userLoggedExpired", expireTime);
  },

  getUserLogged() {
    let usuarioEncriptado = Cookies.get("userLoggedMxz");
    var bytes = CryptoJS.AES.decrypt(
      usuarioEncriptado,
      process.env.VUE_APP_CRYPT_KEY
    );
    var usuario = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(usuario);
  },
  cerrarSesion() {
    Cookies.remove("userLoggedExpired");
    Cookies.remove("userLoggedMxz");
  },
  isAuthenticated() {
    return Cookies.get("userLoggedMxz") !== undefined;
  },
  isExpireSet() {
    return Cookies.get("userLoggedExpired") !== undefined;
  },

  userInfo(id_cliente) {
    let data = qs.stringify({
      usuario: id_cliente,
    });
    return axios.post(URL_API + "info_cliente", data);
  },
  info_campanias(id_cliente) {
    let data = qs.stringify({
      id_cliente: id_cliente,
    });
    return axios.post(URL_API + "info_campanias", data);
  },
  datosCliente(form) {
    let data = qs.stringify(form);
    //const user = { rut, password };
    return axios.post(URL_API + "datos_cliente", data);
  },

  generarClave(rut, correo, telefono) {
    let data = qs.stringify({
      usuario: rut,
      mail: correo,
      telefono: telefono,
    });
    return axios.post(URL_API + "recuperar_clave", data);
  },
  cambiarClave(rut, cl_actual, cl_nueva, accion) {
    let data = qs.stringify({
      usuario: rut,
      clave_old: cl_actual,
      clave: cl_nueva,
      accion: accion,
    });
    return axios.post(URL_API + "cambiar_clave", data);
  },
  bitsCliente(id_cliente) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
    });
    return axios.post(URL_API + "bits_cliente", data);
  },
};
