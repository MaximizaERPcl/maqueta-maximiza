import { jsPDF } from "jspdf";
import "jspdf-autotable";
import conv from "@/services/conversores";
import { formatterRut, cleanRut } from "chilean-formatter";

const COLOR_PRINCIPAL = "#4285f4";

export default {
  exportToPdfDAP(cab, tab, obj, title) {
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.monto_total = "$" + item.monto_total;
      item.t_interes_r = conv.formatPorcentaje(item.t_interes_r);
      item.m_int_pactado = "$" + item.m_int_pactado;
      item.v_renovacion = "$" + item.v_renovacion;
    });
    //Se genera el documento
    var doc = new jsPDF("p", "pt");

    //Se inserta el logo
    var img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    var datos = [];
    datos.push(["Nombre", obj.user.nombre, "Rut", formatterRut(obj.user.rut)]);
    datos.push([
      "Descripción del producto",
      obj.data.producto,
      "Descripción de tipo de renovación",
      obj.data.estado,
    ]);
    datos.push([
      "Descripción estado",
      obj.data.desc_estado,
      "Plazo",
      conv.formatDias(obj.data.daple_n_dia_plazo),
    ]);
    datos.push([
      "Fecha de apertura",
      obj.data.f_apertura,
      "Tasa de interés",
      conv.formatPorcentaje(obj.data.tasa_base),
    ]);
    datos.push([
      "Custodia digital",
      obj.data.custodia_digital,
      "Monto inicial",
      conv.formatMonto(obj.data.monto_inicial, true),
    ]);
    datos.push([
      "Monto interés pactado",
      conv.formatMonto(obj.data.monto_interes, true),
      "Monto final",
      conv.formatMonto(obj.data.monto_final, true),
    ]);
    datos.push([
      "Fecha de vencimiento",
      obj.data.f_vencimiento,
      "Fecha de renovación",
      obj.data.f_renovacion_aut,
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      didDrawPage: function (data) {
        doc.text(
          "Datos del producto",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      body: datos,
      margin: { top: 120 },
      theme: "grid",
    });
    if (detalles.length > 0) {
      //Se definen las cabeceras para las tablas
      var cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalles de renovaciones:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        margin: { top: 10 },
        startY: doc.lastAutoTable.finalY + 30,
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }
    doc.save(
      "dap_" +
        cleanRut(obj.user.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },

  exportToPdfCredito(cab, tab, obj, title) {
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.valor_cuota = conv.formatMonto(item.valor_cuota, true);
      item.pagado = conv.formatMonto(item.pagado, true);
      item.total_a_pagar = conv.formatMonto(item.total_a_pagar, true);
    });

    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    doc.setFontSize(13);
    let datos = [];
    datos.push([
      "Nombre",
      conv.capitalizeString(obj.user.nombre),
      "Rut",
      formatterRut(obj.user.rut),
    ]);
    datos.push([
      "Producto",
      obj.data.tipo_credito.split(" - ")[1],
      "Estado",
      obj.data.estado,
    ]);
    datos.push([
      "Fecha Otorgamiento",
      obj.data.fecha_otorgamiento,
      "Monto Solicitado",
      conv.formatMonto(obj.credito.capital, true),
    ]);
    datos.push([
      "Valor Cuota",
      conv.formatMonto(obj.data.valor_cuota, true),
      "N° de cuotas",
      obj.data.cuotas,
    ]);
    datos.push([
      "Tasa de Interés",
      conv.formatPorcentaje(obj.data.tasa),
      "N° Pagaré",
      obj.data.credito,
    ]);
    datos.push([
      "Total prepago",
      conv.formatMonto(obj.credito.saldo, true),
      "CAE",
      conv.formatPorcentaje(obj.data.cae),
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.text(
          "Datos del producto",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
    });
    if (detalles.length > 0) {
      //Se definen las cabeceras para las tablas
      let cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalles de amortización:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        startY: doc.lastAutoTable.finalY + 30,
        margin: { top: 10 },
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }
    doc.save(
      "cred_" +
        cleanRut(obj.user.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },

  exportToPdfCtaAhorro(cab, tab, obj, title) {
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.saldo = conv.formatMonto(item.saldo, true);
      item.monto = conv.formatMonto(item.monto, true);
    });

    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    let datos = [];
    datos.push(["Nombre", obj.user.nombre, "Rut", formatterRut(obj.user.rut)]);
    datos.push(["Producto", obj.data.nombre, "Estado", obj.data.estado]);
    datos.push([
      "Tasa de interés",
      conv.formatPorcentaje(obj.data.tasa_interes),
      "Saldo Disponible",
      "$" + obj.data.saldo,
    ]);
    datos.push(["Fecha de apertura", obj.data.f_apertura]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      didDrawPage: function (data) {
        doc.text(
          "Datos del producto",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      body: datos,
      margin: { top: 120 },
    });

    let datos2 = [];
    datos2.push(["Forma de pago", obj.data.forma_pago]);
    datos2.push([
      "Monto de abono pactado",
      conv.formatMonto(obj.data.abono_pactado, true),
    ]);

    doc.autoTable({
      head: [],
      didDrawPage: function (data) {
        doc.text(
          "Datos del convenio",
          data.settings.margin.left,
          data.settings.startY - 5
        );
      },
      body: datos2,
      startY: doc.lastAutoTable.finalY + 30,
      margin: { top: 10 },
    });

    //Se definen las cabeceras para las tablas
    if (detalles.length > 0) {
      let cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalles de giros y abonos:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        margin: { top: 10 },
        startY: doc.lastAutoTable.finalY + 30,
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }
    doc.save(
      "lib_" +
        cleanRut(obj.user.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },

  exportToPdfRemanente(cab, tab, obj, title) {
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.saldo = conv.formatMonto(item.saldo, true);
      item.monto = conv.formatMonto(item.monto, true);
    });

    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);

    doc.setFontSize(13);
    //Se modifican los datos tipo objeto para adaptarlos al PDF
    let datos = [];
    datos.push([
      "Nombre",
      conv.capitalizeString(obj.user.nombre),
      "Rut",
      formatterRut(obj.user.rut),
    ]);
    datos.push([
      "Producto",
      conv.capitalizeString(obj.data.Producto),
      "N° Cuenta",
      obj.data.Cuenta,
    ]);
    datos.push([
      "Estado",
      obj.data.estado,
      "Fecha de apertura",
      obj.data.Fecha_Apertura,
    ]);
    datos.push([
      "Saldo Disponible",
      conv.formatMonto(obj.data.vistd_m_monto, true),
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.text(
          "Datos del producto",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
    });
    if (detalles.length > 0) {
      //Se definen las cabeceras para las tablas
      let cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalles de giros y abonos:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        margin: { top: 10 },
        startY: doc.lastAutoTable.finalY + 30,
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }
    doc.save(
      "rem_" +
        cleanRut(obj.user.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },

  //SIMULACION CREDITO
  exportToPdfSimCredito(/*cab, tab,*/ solicitud, resultado) {
    //Se formatean los datos para la tabla
    /*let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.gascr_m_valor = "$" + item.gascr_m_valor;
    });*/

    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.text(
      "SIMULACIÓN DE CRÉDITO",
      doc.internal.pageSize.getWidth() / 2,
      80,
      {
        align: "center",
      }
    );
    doc.setFont("Times", "normal");
    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    //Datos Solicitud
    doc.setFontSize(13);
    let datos = [];
    datos.push([
      "Solicitante",
      solicitud.nombre,
      "Rut",
      formatterRut(solicitud.rut),
    ]);
    datos.push([
      "Fecha",
      conv.formatFecha(Date.now()),
      "Producto",
      conv.capitalizeString(solicitud.producto.nombre.split(" - ")[1]),
    ]);
    datos.push([
      "Monto Solicitado",
      "$" + solicitud.monto,
      "Cuotas",
      solicitud.plazo,
    ]);
    datos.push([
      "Primer Vencimiento",
      resultado.fprimervencimiento,
      "Forma de pago",
      solicitud.pago,
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.setTextColor(66, 133, 244);
        doc.text(
          "Datos Solicitante",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
      styles: { font: "Roboto-Regular" },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });

    //Datos Simulacion
    let datos2 = [];
    datos2.push(["Valor Cuota", conv.formatMonto(resultado.valor_cuota, true)]);
    datos2.push(["Interés", conv.formatPorcentaje2(resultado.tasa_visible)]);
    datos2.push(["Monto Solicitado", "$" + solicitud.monto]);
    datos2.push([
      "Monto Bruto del Crédito",
      conv.formatMonto(resultado.monto_bruto, true),
    ]);
    datos2.push(["Plazo del Crédito", resultado.cuota + " meses"]);
    datos2.push([
      "Costo Total del Crédito",
      conv.formatMonto(resultado.valor_total, true),
    ]);
    datos2.push(["Fecha Primer Vencimiento", resultado.fprimervencimiento]);
    datos2.push(["CAE", conv.formatPorcentaje2(resultado.tasa_cae)]);

    doc.autoTable({
      head: [],
      didDrawPage: function (data) {
        doc.setTextColor(66, 133, 244);
        doc.text(
          "Datos de la simulación",
          data.settings.margin.left,
          data.settings.startY - 5
        );
      },
      body: datos2,
      startY: doc.lastAutoTable.finalY + 30,
      margin: { top: 10 },
      styles: { font: "Roboto-Regular" },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });
    /*if (detalles.length > 0) {
      //Se definen las cabeceras para las tablas
      let cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalle Gastos:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        startY: doc.lastAutoTable.finalY + 30,
        margin: { top: 10 },
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }*/
    doc.save(
      "simCred_" +
        cleanRut(solicitud.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },

  //SIMULACION DAP
  exportToPdfSimDAP(solicitud, resultado) {
    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.text(
      "SIMULACIÓN DE DEPÓSITO A PLAZO",
      doc.internal.pageSize.getWidth() / 2,
      80,
      {
        align: "center",
      }
    );
    doc.setFont("Times", "normal");

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFecha(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    //Datos Solicitud
    doc.setFontSize(13);
    let datos = [];
    datos.push([
      "Solicitante",
      solicitud.nombre,
      "Rut",
      formatterRut(solicitud.rut),
    ]);
    datos.push([
      "Fecha",
      conv.formatFecha(Date.now()),
      "Tipo de depósito",
      solicitud.producto.nombre,
    ]);
    datos.push([
      "Monto del depósito",
      "$" + solicitud.monto,
      "Plazo",
      solicitud.plazo,
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.setTextColor(66, 133, 244);
        doc.text(
          "Datos Solicitante",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
      styles: { font: "Roboto-Regular" },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });

    //Datos Simulacion
    let datos2 = [];
    datos2.push(["Tipo de depósito", solicitud.producto.nombre]);
    datos2.push(["Días Plazo", resultado.dias_plazo_real + " días"]);
    datos2.push(["Moneda", resultado.nombre_moneda]);
    datos2.push(["Valor del Depósito", "$" + solicitud.monto]);
    datos2.push(["Tasa", conv.formatPorcentaje(resultado.tasa_base)]);
    datos2.push(["Interés", conv.formatMonto(resultado.interes_pactado, true)]);
    datos2.push(["Monto Final", conv.formatMonto(resultado.monto_total, true)]);
    datos2.push([
      "Fecha Vencimiento",
      conv.formatFecha2(resultado.fecha_vencimiento, "DD-MM-YYYY"),
    ]);
    datos2.push(["Tipo de renovación", "Automática"]);

    doc.autoTable({
      head: [],
      didDrawPage: function (data) {
        doc.setTextColor(66, 133, 244);
        doc.text(
          "Datos de la simulación",
          data.settings.margin.left,
          data.settings.startY - 5
        );
      },
      body: datos2,
      startY: doc.lastAutoTable.finalY + 30,
      margin: { top: 10 },
      styles: { font: "Roboto-Regular" },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });
    doc.save(
      "simDAP_" +
        cleanRut(solicitud.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },
  /*-------------------------PDF CARTOLA CAPITAL---------------------------------*/
  exportToPdfCartolaCapital(cab, tab, obj, title) {
    //Se formatean los datos para la tabla
    let detalles = JSON.parse(JSON.stringify(tab));

    detalles.forEach((item) => {
      item.monto = conv.formatMonto(item.monto, true);
      item.saldo = conv.formatMonto(item.saldo, true);
      item.sucursal = conv.capitalizeString(item.sucursal);
    });

    //Se genera el documento
    let doc = new jsPDF("p", "pt");

    //Se inserta el logo
    let img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFechaHora(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    doc.setFontSize(13);
    let datos = [];
    datos.push([
      "Titular",
      conv.capitalizeString(obj.nombre),
      "Rut",
      formatterRut(obj.rut),
    ]);
    datos.push([
      "Cuota Social Actual",
      obj.cuota_social.replace(".", ","),
      "Forma de Pago Abono",
      obj.forma_pago,
    ]);
    datos.push(["Abono Inicial", conv.formatMonto(obj.abono_inicial, true)]);
    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.text(
          "Datos del producto",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
    });
    if (detalles.length > 0) {
      //Se definen las cabeceras para las tablas
      let cabeceras = [];
      cab.forEach((item) => {
        cabeceras.push({ title: item.text, dataKey: item.value });
      });

      let temp = true;
      //Se insertan la tabla con sus respectivos datos
      doc.autoTable({
        columns: cabeceras,
        body: detalles,
        didDrawPage: function (data) {
          if (temp)
            doc.text(
              "Detalles:",
              data.settings.margin.left,
              data.settings.startY - 5
            );
          temp = false;
        },
        startY: doc.lastAutoTable.finalY + 30,
        margin: { top: 10 },
        theme: "grid",
        headStyles: { fillColor: COLOR_PRINCIPAL, lineWidth: 1 },
      });
    }
    doc.save(
      "cartola_capital_" +
        cleanRut(obj.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },
  exportToPdfComprobantePago(obj, comision, productos, title) {
    //Se genera el documento
    var doc = new jsPDF("p", "pt");

    //Se inserta el logo
    var img = new Image();
    img.src = require("@/assets/logos/logo.png");
    doc.addImage(img, "png", 40, 5, 142, 55);

    //Se inserta el titulo'
    doc.text(title, 200, 90);

    //Se inserta fecha
    doc.setFontSize(8);
    doc.text(conv.formatFechaHora(Date.now()), 40, 70);
    //Se modifican los datos tipo objeto para adaptarlos al PDF

    doc.setFontSize(13);
    var datos = [];
    datos.push([{ content: "Nombre", styles: { cellWidth: 150 } }, obj.nombre]);
    datos.push([
      { content: "Rut", styles: { cellWidth: 150 } },
      formatterRut(obj.rut),
    ]);
    datos.push([
      { content: "Nº de comprobante", colSpan: 1 },
      obj.numero_comprobante,
    ]);
    datos.push([
      { content: "Monto", styles: { cellWidth: 150 } },
      conv.formatMonto(obj.monto, true),
    ]);
    datos.push([
      { content: "Fecha", styles: { cellWidth: 150 } },
      conv.formatFecha2(obj.fecha, "YYYYMMDD") + " " + obj.hora,
    ]);

    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: datos,
      didDrawPage: function (data) {
        doc.text(
          "Datos de la transacción",
          data.settings.margin.left,
          data.settings.margin.top - 5
        );
      },
      margin: { top: 120 },
    });

    doc.text("Productos Pagados", 40, doc.lastAutoTable.finalY + 25);
    //Se escriben los productos
    productos.forEach((producto) => {
      let datos_producto = [];
      datos_producto.push([
        { content: "Producto", styles: { cellWidth: 150 } },
        producto.producto + " Nº " + producto.numero_producto,
      ]);
      datos_producto.push([
        { content: "Monto", styles: { cellWidth: 150 } },
        conv.formatMonto(producto.monto_pagado1, true),
      ]);
      if (producto.cuota !== "-")
        datos_producto.push(["Cuota", producto.cuota]);

      //Se escriben los datos del objeto en el PDF
      doc.autoTable({
        head: [],
        body: datos_producto,
        startY: doc.lastAutoTable.finalY + 30,
      });
    });

    let comision_transbank = [];
    comision_transbank.push([
      { content: "Monto:", styles: { cellWidth: 150 } },
      conv.formatMonto(comision.monto_pagado1, true),
    ]);
    //Se escriben los datos del objeto en el PDF
    doc.autoTable({
      head: [],
      body: comision_transbank,
      margin: { top: 5 },
      startY: doc.lastAutoTable.finalY + 40,
      didDrawPage: function (data) {
        doc.text(
          "Comisión Web por uso de Transbank",
          data.settings.margin.left,
          data.settings.startY - 5
        );
      },
    });

    doc.save(
      "comprobante_pago" +
        cleanRut(obj.rut, true) +
        "_" +
        conv.fechaNombreDocs() +
        ".pdf"
    );
  },
};
