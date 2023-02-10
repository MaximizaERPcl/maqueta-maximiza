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
  //Creditos
  getCreditos(form) {
    let data = qs.stringify(form);
    return axios.post(URL_API + "creditos_socio", data);
  },

  getDetalleCreditos(id_cliente, accion) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
      accion: accion,
    });
    return axios.post(URL_API + "socio_creditos", data);
  },
  getDap(id_cliente) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
    });
    return axios.post(URL_API + "socio_depositos", data);
  },
  getDetalleDap(id_producto) {
    let data = qs.stringify({
      daple_s_id: id_producto,
    });
    return axios.post(URL_API + "socio_deposito_detalle", data);
  },

  getLibretas(id_cliente) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
    });
    return axios.post(URL_API + "socio_libreta", data);
  },
  getDetalleLibreta(id_producto) {
    let data = qs.stringify({
      libre_s_id: id_producto,
    });
    return axios.post(URL_API + "socio_libreta_detalle", data);
  },

  getCuentaCapital(rut) {
    let data = qs.stringify({
      usuario: rut,
    });
    return axios.post(URL_API + "cuenta_capital", data);
  },

  getCuentaCapitalDetalle(id_cta_capital) {
    let data = qs.stringify({
      cuene_s_id: id_cta_capital,
    });
    return axios.post(URL_API + "cuenta_capital_detalle", data);
  },

  getProximoPago(id_credito) {
    let data = qs.stringify({
      creme_s_id: id_credito,
    });
    return axios.post(URL_API + "proximo_pago", data);
  },
  getProximosPagos(id_cliente, accion) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
      accion: accion,
    });
    return axios.post(URL_API + "proximos_pagos", data);
  },

  getRemanentes(id_cliente) {
    let data = qs.stringify({
      clien_s_id: id_cliente,
    });
    return axios.post(URL_API + "saldo_a_favor", data);
  },
  getDetalleRemanente(id_producto) {
    let data = qs.stringify({
      viste_s_id: id_producto,
    });
    return axios.post(URL_API + "saldo_a_favor_detalle", data);
  },
};
