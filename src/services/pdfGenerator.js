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
  },
  exportToPdfCredito(cab,tab,obj,title){  
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
    console.log(obj.data)
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(['Nombre', obj.user.nombre, 'Rut', formatterRut(obj.user.rut)]);
    datos.push(['Producto', obj.data.tipo_credito, 'Estado', obj.data.estado]);
    datos.push(['Fecha Otorgamiento', obj.data.fecha_otorgamiento, 'Monto Solicitado', conv.formatMonto(obj.credito.capital, true)])
    datos.push(['Valor Cuota', conv.formatMonto(obj.data.valor_cuota, true), 'N° de cuotas', obj.data.cuotas]);
    datos.push(['Tasa de Interés', conv.formatPorcentaje(obj.data.tasa), 'N° Pagaré', obj.data.credito]);
    datos.push(['Total prepago', conv.formatMonto(obj.credito.saldo, true), 'CAE', conv.formatPorcentaje(obj.data.cae)]);

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
  },
  exportToPdfCtaAhorro(cab,tab,obj,title){  
    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/inicio/logo.png');
    doc.addImage(img, 'png', 0, 0, 252, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 75);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 10, 70);

    doc.setFontSize(12)
    doc.text('Datos del producto:', 40, 95);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(['Nombre', obj.user.nombre, 'Rut', formatterRut(obj.user.rut)]);
    datos.push(['Producto', obj.data.nombre, 'Estado', obj.data.estado]);
    datos.push(['Tasa de interés', conv.formatPorcentaje(obj.data.tasa_interes), 'Saldo Disponible', conv.formatMonto(obj.data.saldo, true)])
    datos.push(['Fecha de apertura', obj.data.f_apertura]);
    
    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head:[],
      body:datos,
      margin: {top: 100},
      theme:'grid' 
    })

    doc.text('Datos del convenio:', 40, 203);
    var datos2 = [];
    datos2.push(['Forma de pago', obj.data.forma_pago]);
    datos2.push(['Monto de abono pactado', conv.formatMonto(obj.data.abono_pactado, true)])

    doc.autoTable({
      head:[],
      body:datos2,
      margin: {top: 10},
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
  },

  exportToPdfRemanente(cab,tab,obj,title){  
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
    datos.push(['Producto', obj.data.Producto, 'N° Cuenta', obj.data.Cuenta]);
    datos.push(['Estado', obj.data.estado, 'Fecha de apertura', obj.data.Fecha_Apertura])
    datos.push(['Saldo Disponible', conv.formatMonto(obj.data.vistd_m_monto,true)]);
    
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
  },
}