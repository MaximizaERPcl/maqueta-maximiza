import axios from "axios";
import qs from "qs";

const URL_API_PAGO =
  process.env.NODE_ENV === "production"
    ? window.location.protocol +
      "//" +
      window.location.host +
      process.env.VUE_APP_API_URL_PAGO
    : process.env.VUE_APP_API_URL_PAGO;

export default {
  generar_pago(form) {
    form.producto_pagar = JSON.stringify(form.producto_pagar);
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "generar_pago", data);
  },
  info_producto(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "info_producto", data);
  },
  obtener_token_tb(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "obtener_token_tb", data);
  },
  obtener_estado_tb(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "resultado_tb", data);
  },
  rescata_sesion_pago(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "rescata_sesion_pago", data);
  },
  detalle_pago(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "detalle_pago", data);
  },
  pagar_producto(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "pagar_producto", data);
  },
  reversar_pago(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API_PAGO + "anular_pago_transbank", data);
  },
};
