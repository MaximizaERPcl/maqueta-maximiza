import axios from "axios";
import qs from "qs";

const URL_API = "http://201.217.242.24:8090/apirest_demo/";

export default {
    //Creditos
    getCreditos(id_cliente){
        let data = qs.stringify({
            'clien_s_id': id_cliente,
         })
        return axios.post(URL_API + "creditos_socio", data);
    },

    getDetalleCreditos(id_cliente, accion){
        let data = qs.stringify({
            'clien_s_id': id_cliente,
            'accion': accion
        })
         return axios.post(URL_API + "socio_creditos", data);
    },

    getDap(id_cliente){
        let data = qs.stringify({
            'clien_s_id': id_cliente,
         })
         return axios.post(URL_API + "socio_depositos", data);
    },

    getLibretas(id_cliente){
        let data = qs.stringify({
            'clien_s_id': id_cliente,
         })
         return axios.post(URL_API + "socio_libreta", data);
    },

    getCuentaCapital(rut){
        let data = qs.stringify({
            'usuario': rut,
         })
         return axios.post(URL_API + "cuenta_capital", data);
    },

    getCuentaCapitalDetalle(id_cta_capital){
        let data = qs.stringify({
            'cuene_s_id': id_cta_capital,
         })
         return axios.post(URL_API + "cuenta_capital_detalle", data);
    },

    getProximoPago(id_credito){
        let data = qs.stringify({
            'creme_s_id': id_credito,
         })
         return axios.post(URL_API + "proximo_pago", data);
    },

    
}