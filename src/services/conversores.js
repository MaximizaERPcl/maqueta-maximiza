import moment from "moment";
export default {
  formatMonto(monto, currency) {
    let intMonto = parseInt(parseFloat(monto));
    if (currency)
      return Intl.NumberFormat("es-CL", {
        currency: "CLP",
        style: "currency",
      }).format(Math.abs(intMonto));
    else
      return Intl.NumberFormat("es-CL", { currency: "CLP" }).format(
        Math.abs(intMonto)
      );
  },
  formatPorcentaje(valor) {
    valor = valor.replace(/,/g, ".");
    var num = parseFloat(valor);
    var preRedondeo = Number((Math.abs(num) * 100).toPrecision(15));
    var final = (Math.round(preRedondeo) / 100) * Math.sign(num);
    return final + "%";
  },
  formatPorcentaje2(valor) {
    var num = parseFloat(valor) * 100;
    return num.toFixed(2) + "%";
  },
  formatDias(valor) {
    return valor === "1" ? valor + " día" : valor + " días";
  },
  formatFecha(fecha) {
    return moment(new Date(fecha)).format("DD/MM/YYYY");
  },
  formatFecha2(fecha, srcFormat) {
    return moment(fecha, srcFormat).format("DD/MM/YYYY");
  },
  fechaNombreDocs() {
    return moment(new Date(Date.now())).format("DDMMYYHHmmss");
  },
  formatFechaHora(fecha, srcFormat) {
    return moment(fecha, srcFormat).format("DD/MM/YYYY HH:mm");
  },
  capitalizeString(texto) {
    let arr = texto.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
    }
    return arr.join(" ");
  },
  capitalizeFirtsString(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  },
  desmonetizar(monto) {
    return monto.replace("$", "").split(".").join("");
  },
};
