import moment from "moment";
export default {
  //Retorna si se está trabajando o no en produccion
  prod() {
    return process.env.NODE_ENV === "production";
  },
  //Compara dos fechas
  compareFn(a, b, format) {
    format = format ? format : "DD/MM/YYYY";
    let aParse = moment(a, format).format("YYYY-MM-DD");
    let bParse = moment(b, format).format("YYYY-MM-DD");
    if (aParse < bParse) {
      return -1;
    }
    if (aParse > bParse) {
      return 1;
    }
    return 0;
  },
  //Compara dos valores numéricos
  compareValue(a, b) {
    let aParse = Math.abs(a);
    let bParse = Math.abs(b);
    if (aParse < bParse) {
      return -1;
    }
    if (aParse > bParse) {
      return 1;
    }
    return 0;
  },
  validateEmail(email) {
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  },
};
