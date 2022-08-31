import { jsPDF} from "jspdf";
import "jspdf-autotable";
import conv from "@/services/conversores";
import { formatterRut } from 'chilean-formatter';

const COLOR_PRINCIPAL = "#4363a3";

export default {
  exportToPdfDAP(cab,tab,obj,title){  
    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/inicio/logo.png');
    doc.addImage(img, 'png', 0, 0, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 55);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 10, 70);

    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(['Nombre', obj.user.nombre, 'Rut', formatterRut(obj.user.rut)]);
    datos.push(['Descripción del producto', obj.data.producto, 'Descripción de tipo de renovación', obj.data.estado]);
    datos.push(['Descripción estado', obj.data.desc_estado, 'Plazo', conv.formatDias(obj.data.daple_n_dia_plazo)])
    datos.push(['Fecha de apertura', obj.data.f_apertura, 'Tasa de interés', conv.formatPorcentaje(obj.data.tasa_base)]);
    datos.push(['Custodia digital', obj.data.custodia_digital, 'Monto inicial', conv.formatMonto(obj.data.monto_inicial)]);
    datos.push(['Monto interés pactado', obj.data.monto_interes, 'Monto final', conv.formatMonto(obj.data.monto_final)]);
    datos.push(['Fecha de vencimiento', obj.data.f_vencimiento, 'Fecha de renovación', obj.data.f_renovacion_aut]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head:[],
      body:datos,
      margin: {top: 100},
      theme:'grid' 
    })

    //Se definen las cabeceras para las tablas
    var cabeceras = [];
    cab.forEach( item => {
      cabeceras.push({title: item.text, dataKey: item.value},)
    })

    //Se insertan la tabla con sus respectivos datos
    doc.autoTable({
      columns:cabeceras,
      body:tab,
      margin: {top: 100},
      theme:'grid',
      headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1},
    });
    doc.save("output.pdf");
  }
}