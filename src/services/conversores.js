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
    let num = parseFloat(valor);
    /*let preRedondeo = Number((Math.abs(num) * 100).toPrecision(15));
    console.log("preRedondeo", preRedondeo);
    let final = (Math.round(preRedondeo) / 100) * Math.sign(num);*/
    return num.toFixed(3) + "%";
  },
  formatPorcentaje2(valor) {
    let num = parseFloat(valor) * 100;
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
