import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
import CryptoJS from "crypto-js";

const URL_API = "http://201.217.242.24:8090/apirest_demo/";

export default {
  login(rut, password) {
    let data = qs.stringify({
       'usuario': rut,
       'clave': password
    })
    //const user = { rut, password };
    return axios.post(URL_API + "login", data);
  },
  setUserLogged(userLogged) {
    var usuarioEncriptado = CryptoJS.AES.encrypt(
        JSON.stringify(userLogged),
        "maximizaDemo"
      ).toString();

    Cookies.set("userLogged", usuarioEncriptado);

  },
  getUserLogged() {
    let usuarioEncriptado = Cookies.get("userLogged");
    var bytes = CryptoJS.AES.decrypt(usuarioEncriptado, "maximizaDemo");
    var usuario = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(usuario);
  },

  deleteUserLogged() {
    Cookies.remove('userLogged');
  },
  isAuthenticated(){
    return (Cookies.get('userLogged') !== undefined);
  },

  userInfo(id_cliente){
    let data = qs.stringify({
        'usuario': id_cliente,
     })
     //const user = { rut, password };
     return axios.post(URL_API + "info_cliente", data);
  },
  generarClave(rut,correo,telefono){
    let data = qs.stringify({
      'usuario': rut,
      'mail': correo,
      'telefono': telefono 
     })
     return axios.post(URL_API + "info_cliente", data);
  }
};