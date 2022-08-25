import axios from "axios";
import qs from "qs";

const URL_API = "http://201.217.242.24:8090/apirest_demo/";

export default {
    getProductosCreditos(rut){
        let data = qs.stringify({
            'rut': rut,
        })
         return axios.post(URL_API + "simulador_credito_producto", data);
    },
    simularCredito(data){
        let formattedData = qs.stringify(data)
        return axios.post(URL_API + "simulador_credito_calculo", formattedData);
    },

    getProductosDaps(rut){
        let data = qs.stringify({
            'rut': rut,
        })
         return axios.post(URL_API + "simulador_dap_producto", data);
    },
    getProductosDapsDetalle(id_prod, accion){
        let data = qs.stringify({
            'procm_s_id': id_prod,
            'accion':accion
        })
         return axios.post(URL_API + "simulador_dap_producto_condicion", data);
    },
    simularDap(data){
        let formattedData = qs.stringify(data)
        return axios.post(URL_API + "simulador_dap_producto_simular", formattedData);
    },
    
}