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
  guardarDatosPersonales(rut, direc_s_id, form){
    form.rut = rut;
    form.direc_s_id = direc_s_id;
    form.accion = 10;
    let data = qs.stringify(form)
    console.log(data);
    return axios.post(URL_API + "datos_cliente_actualizar", data);
  },
  guardarDatosBancarios(rut, direc_s_id, form){
    let data= qs.stringify({
        'rut': rut,
        'direc_s_id':direc_s_id,
        'accion':11,
     })
     return axios.post(URL_API + "datos_cliente_actualizar_bancario", data);
  },

  datosCliente(rut, direc_s_id, accion, add){
    let data = qs.stringify({
        'rut': rut,
        'direc_s_id':direc_s_id,
        'accion':accion,
        'adicional':add

     })
     //const user = { rut, password };
     return axios.post(URL_API + "datos_cliente", data);
  },

  generarClave(rut,correo,telefono){
    let data = qs.stringify({
      'usuario': rut,
      'mail': correo,
      'telefono': telefono 
     })
     return axios.post(URL_API + "info_cliente", data);
  },
  cambiarClave(rut, cl_actual,cl_nueva){
    let data = qs.stringify({
      'usuario': rut,
      'clave_old': cl_actual,
      'clave': cl_nueva 
     })
     return axios.post(URL_API + "cambiar_clave", data);
  }
};