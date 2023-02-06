import axios from "axios";
import qs from "qs";

const URL_API =
  process.env.NODE_ENV === "production"
    ? window.location.protocol +
      "//" +
      window.location.host +
      process.env.VUE_APP_API_URL
    : process.env.VUE_APP_API_URL;

export default {
  estado_credito(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "credito_resumen", data);
  },
  obtener_documentacion(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "credito_resumen_detalle", data);
  },
  guardar_documentacion(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "guardar_documentos", data);
  },
  documentos_firmar(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "estado_documentos_firmar", data);
  },
  acepta_rechaza(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "acepta_rechaza_credito", data);
  },
  listar_firmados(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "adminitracion_doc_firmados_ver", data);
  },
};
