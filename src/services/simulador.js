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
  getProductosCreditos(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "simulador_credito_producto", data);
  },
  simularCredito(data) {
    let formattedData = qs.stringify(data);
    return axios.post(URL_API + "simulador_credito_calculo", formattedData);
  },
  solicitarCredito(data) {
    let formattedData = qs.stringify(data);
    return axios.post(URL_API + "simulador_credito_guardar", formattedData);
  },

  getProductosDaps(rut) {
    let data = qs.stringify({
      rut: rut,
    });
    return axios.post(URL_API + "simulador_dap_producto", data);
  },
  getProductosDapsDetalle(id_prod, accion) {
    let data = qs.stringify({
      procm_s_id: id_prod,
      accion: accion,
    });
    return axios.post(URL_API + "simulador_dap_producto_condicion", data);
  },
  simularDap(data) {
    let formattedData = qs.stringify(data);
    return axios.post(
      URL_API + "simulador_dap_producto_simular",
      formattedData
    );
  },
  enviarCorreo(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "simulador_envio_correo", data);
  },
};
