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
    return axios.post(URL_API + "login", data);
  },
  async setUserLogged(userLogged) {
    await this.getCryptKey()
    .then(response => {
      let data = response.data[0];
      if (data.codigo === "1"){
        var usuarioEncriptado = CryptoJS.AES.encrypt(
          JSON.stringify(userLogged),
          data.crypt_key
        ).toString();
        Cookies.set("userLoggedMxz", usuarioEncriptado);
      }
      else
        console.log('Error: '+data.msg)
    })
    .catch(error => console.log(error))
  },

  getUserLogged(key){
    let usuarioEncriptado = Cookies.get("userLoggedMxz");
    var bytes = CryptoJS.AES.decrypt(usuarioEncriptado, key);
    var usuario = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(usuario);
  },
  getCryptKey() {
    return axios.get(URL_API + "clave_encriptacion")
  },
  cerrarSesion() {
    Cookies.remove('userLoggedMxz');
  },
  isAuthenticated(){
    return (Cookies.get('userLoggedMxz') !== undefined);
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

  datosCliente(form){
    let data = qs.stringify(form);
     //const user = { rut, password };
     return axios.post(URL_API + "datos_cliente", data);
  },

  generarClave(rut,correo,telefono){
    let data = qs.stringify({
      'usuario': rut,
      'mail': correo,
      'telefono': telefono 
     })
     return axios.post(URL_API + "recuperar_clave", data);
  },
  cambiarClave(rut, cl_actual,cl_nueva, accion){
    let data = qs.stringify({
      'usuario': rut,
      'clave_old': cl_actual,
      'clave': cl_nueva,
      'accion': accion
     })
     return axios.post(URL_API + "cambiar_clave", data);
  }
};