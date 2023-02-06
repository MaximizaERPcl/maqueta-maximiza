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
    //var expireTime = new Date(new Date().getTime() + 14.95 * 60 * 1000);
    //sessionStorage.setItem("userImageMxz", userLogged.imagen_b64);
    //delete userLogged.imagen_b64;
    var usuarioEncriptado = CryptoJS.AES.encrypt(
      JSON.stringify(userLogged),
      process.env.VUE_APP_CRYPT_KEY
    ).toString();
    Cookies.set(
      "userLoggedMxz",
      usuarioEncriptado /*, {
      expires: expireTime,
    }*/
    );
    //store.dispatch("updateBits");
    //Cookies.set("userLoggedExpired", expireTime);
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
    Cookies.remove("userLoggedMxz");
  },
  isAuthenticated() {
    return Cookies.get("userLoggedMxz") !== undefined;
  },

  userInfo(id_cliente) {
    let data = qs.stringify({
      usuario: id_cliente,
    });
    return axios.post(URL_API + "info_cliente", data);
  },
  guardarDatosPersonales(rut, direc_s_id, form) {
    form.rut = rut;
    form.direc_s_id = direc_s_id;
    form.accion = 10;
    let data = qs.stringify(form);
    return axios.post(URL_API + "datos_cliente_actualizar", data);
  },
  guardarDatosBancarios(rut, direc_s_id /*, form*/) {
    let data = qs.stringify({
      rut: rut,
      direc_s_id: direc_s_id,
      accion: 11,
    });
    return axios.post(URL_API + "datos_cliente_actualizar_bancario", data);
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
};
