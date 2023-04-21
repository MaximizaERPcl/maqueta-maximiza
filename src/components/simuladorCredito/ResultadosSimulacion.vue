<template>
  <v-card outlined v-if="resultado != null">
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-briefcase-account </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Crédito</v-list-item-subtitle>
          <v-list-item-title>{{
            conv.capitalizeString(
              formData.producto.tipo === "Campania"
                ? formData.producto.nombre
                : formData.producto.nombre.split(" - ")[1]
            )
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Monto Solicitado</v-list-item-subtitle>
          <v-list-item-title>${{ formData.monto }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="formData.producto.codigo !== '601'">
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash-clock </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Cuota</v-list-item-subtitle>
          <v-list-item-title>{{
            conv.formatMonto(resultado.valor_cuota, true)
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-percent-circle </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Interés</v-list-item-subtitle>
          <v-list-item-title>{{
            conv.formatPorcentaje2(resultado.tasa_visible)
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-calendar-expand-horizontal </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Plazo del Crédito</v-list-item-subtitle>
          <v-list-item-title>{{ plazo_simulacion }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash-multiple </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Costo Total del Crédito</v-list-item-subtitle>
          <v-list-item-title>{{
            conv.formatMonto(resultado.valor_total, true)
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-calendar-end </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>{{
            formData.producto.codigo !== "601"
              ? "Fecha Primer Vencimiento"
              : "Fecha Vencimiento"
          }}</v-list-item-subtitle>
          <v-list-item-title>{{
            resultado.fprimervencimiento
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-percent-circle </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>CAE</v-list-item-subtitle>
          <v-list-item-title>{{
            conv.formatPorcentaje2(resultado.tasa_cae)
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-btn
      color="warning"
      @click="
        emailSent = false;
        $emit('volver');
      "
      class="mx-2 my-2"
    >
      <v-icon left>mdi-arrow-left</v-icon>
      Volver
    </v-btn>

    <v-btn color="primary" class="mx-2 my-2" @click="exportToPDF()">
      <v-icon left>mdi-file-download</v-icon>
      Descargar
    </v-btn>

    <v-btn
      color="info"
      class="mx-2 my-2"
      :loading="loadingEmail"
      :disabled="emailSent"
      @click="sendEmail()"
    >
      <v-icon left>mdi-email</v-icon>
      Enviar Correo
    </v-btn>
    <v-btn
      color="success"
      class="mx-2 my-2"
      :loading="loadingSolicitar"
      :disabled="credSolicitado"
      @click="solicitar_credito()"
    >
      <v-icon left>mdi-send-circle</v-icon>
      Solicitar Crédito
    </v-btn>
  </v-card>
</template>

<script>
import auth from "@/auth/auth";
import conv from "@/services/conversores";
import pdf from "@/services/pdfGenerator";
import simulador from "@/services/simulador";
import { mapActions } from "vuex";
export default {
  props: {
    resultado: Object,
    formData: Object,
    solicita: Boolean,
  },
  data() {
    return {
      loadingEmail: false,
      loadingSolicitar: false,
      credSolicitado: false,
      emailSent: false,
    };
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    },
    conv() {
      return conv;
    },
    plazo_simulacion() {
      let plazo = this.formData.plazo;
      if (this.formData.producto.codigo === "601") return plazo * 30 + " días";
      else return plazo + (plazo > 1 ? " meses" : " mes");
    },
    prod() {
      return process.env.NODE_ENV === "production";
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta", "updateBits"]),
    exportToPDF() {
      let solicitud = JSON.parse(JSON.stringify(this.formData));
      solicitud.nombre = this.userLogged.nombre;
      solicitud.rut = this.userLogged.rut;
      pdf.exportToPdfSimCredito(solicitud, this.resultado);
    },
    async sendEmail() {
      this.loadingEmail = true;

      let producto = conv.capitalizeString(this.formData.producto.nombre);
      if (this.formData.producto.tipo === "Campania")
        producto = "Campaña " + producto;
      else producto = "Crédito " + producto.split(" - ")[1];

      let formEmail = {
        accion: "1",
        clien_s_id: this.userLogged.id_cliente,
        procm_s_id: this.formData.producto.codigo,
        producto: producto,
        cre_valor_cuota: this.resultado.valor_cuota,
        cre_tasa_interes_mensual: conv.formatPorcentaje2(
          this.resultado.tasa_visible
        ),
        cre_monto_solicitado: this.formData.monto,
        cre_monto_bruto_credito: this.resultado.monto_bruto,
        cre_plazo_credito: this.plazo_simulacion,
        cre_costo_total_credito: this.resultado.valor_total,
        cre_fecha_primer_venc: this.resultado.fprimervencimiento,
        cre_cae: conv.formatPorcentaje2(this.resultado.tasa_cae),
      };
      let payload = {};
      await simulador
        .enviarCorreo(formEmail)
        .then((response) => {
          let data = response.data[0];
          if (data.codigo === "1") {
            payload = {
              mensaje: data.msg,
              color: "success",
              mostrar: true,
            };
          } else {
            payload = {
              mensaje: data.msg,
              color: "error",
              mostrar: true,
            };
          }
        })
        .catch((error) => console.log(error));
      this.loadingEmail = false;
      this.mostrarAlerta(payload);
      this.emailSent = true;
    },
    async solicitar_credito() {
      let payload = {};
      this.loadingSolicitar = true;
      let form = {
        accion: "4",
        clien_s_id: this.userLogged.id_cliente,
        procm_s_id: this.formData.producto.codigo,

        creme_d_tasa: this.resultado.tasa_visible,
        creme_d_tasa_max_convencional: this.resultado.tasa_max_convencional,
        creme_d_tasa_efectiva: this.resultado.tasa_efectiva,
        creme_d_tasa_cae: this.resultado.tasa_cae,
        creme_f_otorgamiento: conv.formatFecha2(
          this.formData.date,
          "YYYY-MM-DD"
        ),
        creme_f_primera_cuota: this.resultado.fprimervencimiento,
        creme_m_solicitado: conv.desmonetizar(this.formData.monto),
        creme_m_valor_cuota: this.resultado.valor_cuota,
        creme_n_cantidad_cuota: this.resultado.cuota,
        campe_s_id: this.formData.campania ? this.formData.campania.id : "",
        gascr_s_id_s: this.resultado.gastos_ids,
        cregt_m_gasto_s: this.resultado.gastos_montos,
        dir_email: "valentina.ligueno@maximizaerp.cl",
      };
      await simulador
        .solicitarCredito(form)
        .then((response) => {
          let data = response.data[0];
          if (data.return_value === "1") {
            payload = {
              mensaje: `Crédito registrado exitosamente. Puede revisar el estado de su solicitud en la barra lateral en 'Seguimiento Credito'`,
              color: "success",
              mostrar: true,
            };

            this.updateBits(this.userLogged.id_cliente);

            //this.$router.push("/seguimiento-credito");
          } else {
            payload = {
              mensaje: data.return_msg,
              color: "error",
              mostrar: true,
            };
          }
        })
        .catch((error) => {
          console.log(error);
          payload = {
            mensaje:
              "Ha ocurrido un error al solicitar su crédito, por favor intente más tarde. Si el error persiste contacte con un administrador",
            color: "error",
            mostrar: true,
          };
        })
        .finally(() => {
          this.loadingSolicitar = false;
        });

      this.credSolicitado = true;
      this.mostrarAlerta(payload);
    },
  },
  mounted() {},
};
</script>
