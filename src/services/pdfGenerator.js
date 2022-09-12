import { jsPDF} from "jspdf";
import "jspdf-autotable";
import conv from "@/services/conversores";
import { formatterRut,cleanRut } from 'chilean-formatter';

const COLOR_PRINCIPAL = "#4285f4";

export default {
  exportToPdfDAP(cab,tab,obj,title){ 
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach(item => {
      item.monto_total = '$'+ item.monto_total;
      item.t_interes_r = conv.formatPorcentaje(item.t_interes_r);
      item.m_int_pactado = '$'+ item.m_int_pactado;
      item.v_renovacion = '$'+ item.v_renovacion;
    }); 
    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/logos/logo.png');
    doc.addImage(img, 'png', 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(['Nombre', obj.user.nombre, 'Rut', formatterRut(obj.user.rut)]);
    datos.push(['Descripción del producto', obj.data.producto, 'Descripción de tipo de renovación', obj.data.estado]);
    datos.push(['Descripción estado', obj.data.desc_estado, 'Plazo', conv.formatDias(obj.data.daple_n_dia_plazo)])
    datos.push(['Fecha de apertura', obj.data.f_apertura, 'Tasa de interés', conv.formatPorcentaje(obj.data.tasa_base)]);
    datos.push(['Custodia digital', obj.data.custodia_digital, 'Monto inicial', conv.formatMonto(obj.data.monto_inicial, true)]);
    datos.push(['Monto interés pactado', conv.formatMonto(obj.data.monto_interes,true), 'Monto final', conv.formatMonto(obj.data.monto_final, true)]);
    datos.push(['Fecha de vencimiento', obj.data.f_vencimiento, 'Fecha de renovación', obj.data.f_renovacion_aut]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head:[],
      didDrawPage: function(data) {
        doc.text("Datos del producto", data.settings.margin.left, data.settings.margin.top - 5);
      },
      body:datos,
      margin: {top: 120},
      theme:'grid' 
    })

    //Se definen las cabeceras para las tablas
    var cabeceras = [];
    cab.forEach( item => {
      cabeceras.push({title: item.text, dataKey: item.value},)
    })

    let temp = true;
    //Se insertan la tabla con sus respectivos datos
    doc.autoTable({
      columns:cabeceras,
      body:detalles,
      didDrawPage: function(data) {
        if(temp)
          doc.text("Detalles de renovaciones:", data.settings.margin.left, data.settings.startY - 5);
        temp = false
      },
      margin: {top: 10},
      startY: doc.lastAutoTable.finalY + 30,
      theme:'grid',
      headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1},
    });
    doc.save('dap_'+cleanRut(obj.user.rut,true)+'_'+conv.fechaNombreDocs()+'.pdf');
  },

  exportToPdfCredito(cab,tab,obj,title){
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach(item => {
      item.valor_cuota = conv.formatMonto(item.valor_cuota, true);
      item.pagado = conv.formatMonto(item.pagado, true);
      item.total_a_pagar = conv.formatMonto(item.total_a_pagar, true);
    });

    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/logos/logo.png');
    doc.addImage(img, 'png', 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    doc.setFontSize(13)
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
      didDrawPage: function(data) {
        doc.text("Datos del producto", data.settings.margin.left, data.settings.margin.top - 5);
      },
      margin: {top: 120},
      theme:'grid' 
    })

    //Se definen las cabeceras para las tablas
    var cabeceras = [];
    cab.forEach( item => {
      cabeceras.push({title: item.text, dataKey: item.value},)
    })

    let temp = true;
    //Se insertan la tabla con sus respectivos datos
    doc.autoTable({
      columns:cabeceras,
      body:detalles,
      didDrawPage: function(data) {
        if(temp)
          doc.text("Detalles de amortización:", data.settings.margin.left, data.settings.startY - 5);
        temp = false
      },
      startY: doc.lastAutoTable.finalY + 30,
      margin: {top: 10},
      theme:'grid',
      headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1},
    });
    doc.save('cred_'+cleanRut(obj.user.rut,true)+'_'+conv.fechaNombreDocs()+'.pdf');
  },
  
  exportToPdfCtaAhorro(cab,tab,obj,title){
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach(item => {
      item.saldo = conv.formatMonto(item.saldo, true);
      item.monto = conv.formatMonto(item.monto, true);
    });

    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/logos/logo.png');
    doc.addImage(img, 'png', 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(['Nombre', obj.user.nombre, 'Rut', formatterRut(obj.user.rut)]);
    datos.push(['Producto', obj.data.nombre, 'Estado', obj.data.estado]);
    datos.push(['Tasa de interés', conv.formatPorcentaje(obj.data.tasa_interes), 'Saldo Disponible', '$'+obj.data.saldo])
    datos.push(['Fecha de apertura', obj.data.f_apertura]);
    
    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head:[],
      didDrawPage: function(data) {
        doc.text("Datos del producto", data.settings.margin.left, data.settings.margin.top - 5);
      },
      body:datos,
      margin: {top: 120},
      theme:'grid',
    })

    var datos2 = [];
    datos2.push(['Forma de pago', obj.data.forma_pago]);
    datos2.push(['Monto de abono pactado', conv.formatMonto(obj.data.abono_pactado, true)])

    doc.autoTable({
      head:[],
      didDrawPage: function(data) {
        doc.text("Datos del convenio", data.settings.margin.left, data.settings.startY - 5);
      },
      body:datos2,
      startY: doc.lastAutoTable.finalY + 30,
      margin: {top: 10},
      theme:'grid'
    })

    //Se definen las cabeceras para las tablas
    var cabeceras = [];
    cab.forEach( item => {
      cabeceras.push({title: item.text, dataKey: item.value},)
    })

    let temp = true;
    //Se insertan la tabla con sus respectivos datos
    doc.autoTable({
      columns:cabeceras,
      body:detalles,
      didDrawPage: function(data) {
        if(temp)
          doc.text("Detalles de giros y abonos:", data.settings.margin.left, data.settings.startY - 5);
        temp = false
      },
      margin: {top: 10},
      startY: doc.lastAutoTable.finalY + 30,
      theme:'grid',
      headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1},
    });
    doc.save('lib_'+cleanRut(obj.user.rut,true)+'_'+conv.fechaNombreDocs()+'.pdf');
  },

  exportToPdfRemanente(cab,tab,obj,title){
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach(item => {
      item.saldo = conv.formatMonto(item.saldo, true);
      item.monto = conv.formatMonto(item.monto, true);
    });

    //Se genera el documento
    var doc = new jsPDF('p', 'pt');

    //Se inserta el logo
    var img = new Image();
    img.src = require('@/assets/logos/logo.png');
    doc.addImage(img, 'png', 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8)
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
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
      didDrawPage: function(data) {
        doc.text("Datos del producto", data.settings.margin.left, data.settings.margin.top - 5);
      },
      margin: {top: 120},
      theme:'grid' 
    })

    //Se definen las cabeceras para las tablas
    var cabeceras = [];
    cab.forEach( item => {
      cabeceras.push({title: item.text, dataKey: item.value},)
    })

    let temp = true;
    //Se insertan la tabla con sus respectivos datos
    doc.autoTable({
      columns:cabeceras,
      body:detalles,
      didDrawPage: function(data) {
        if(temp)
          doc.text("Detalles de giros y abonos:", data.settings.margin.left, data.settings.startY - 5);
        temp = false
      },
      margin: {top: 10},
      startY: doc.lastAutoTable.finalY + 30,
      theme:'grid',
      headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1},
    });
    doc.save('rem_'+cleanRut(obj.user.rut,true)+'_'+conv.fechaNombreDocs()+'.pdf');
  },
}