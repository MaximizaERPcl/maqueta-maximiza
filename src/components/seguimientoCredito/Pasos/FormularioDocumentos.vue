<template>
  <v-container class="pa-0">
    <v-col cols="12" sm="10" md="8" v-for="(doc, n) in docs_subir" :key="n">
      <v-card
        outlined
        elevation="3"
        class="pt-1 pb-2 px-4"
        :style="{
          'border-color': $vuetify.theme.themes.light.primary,
          cursor: 'pointer',
        }"
      >
        <v-form ref="form" v-model="valid">
          <v-list-item-title class="py-2">
            {{ doc.doccr_c_nombre }}
          </v-list-item-title>

          <v-file-input
            v-model="docs_subidos[n]"
            label="Seleccionar Archivo"
            outlined
            dense
            hide-details="auto"
            :rules="[rules.required, rules.maxSize]"
            :disabled="disabled"
            required
          ></v-file-input>
        </v-form>
      </v-card>
    </v-col>
    <v-btn
      color="primary"
      @click="validate"
      :loading="loading"
      :disabled="disabled"
      width="310px"
    >
      Subir Documentación
      <template v-slot:loader>
        <span>Subiendo Documentación </span>
        <v-progress-circular
          class="ml-4"
          indeterminate
          color="grey"
          size="18"
          width="2"
        ></v-progress-circular>
      </template>
    </v-btn>
  </v-container>
</template>
<script>
import creditos from "@/services/creditos";
import { mapActions } from "vuex";
export default {
  props: {
    docs_subir: {
      type: Array,
      default: new Array(0),
    },
    creme_s_id: String,
  },
  data() {
    return {
      docs_subidos: [],
      loading: false,
      disabled: false,
      valid: true,
      rules: {
        required: (files) => !!files || "Debe seleccionar un archivo",
        maxSize: (file) =>
          !file ||
          file.size < 7e6 ||
          "Cada archivo debe tener un tamaño máximo de 7 MB",
      },
    };
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    async convertirArchivo(doc) {
      let convert = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(doc);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
      return convert.split(",")[1];
    },
    async subir_documentacion() {
      let payload = {};
      let status = 0;
      this.loading = true;
      this.disabled = true;
      this.docs_subidos.forEach(async (doc, index) => {
        if (doc) {
          let data = {
            accion: 6,
            creme_s_id: this.creme_s_id,
            dicre_s_id: this.docs_subir[index].dicre_s_id,
            doccr_s_id: this.docs_subir[index].doccr_s_id,
            documento: await this.convertirArchivo(doc),
            c_nombre: doc.name,
            n_largo: doc.size,
          };
          await creditos
            .guardar_documentacion(data)
            .then((response) => {
              let data = response.data[0];
              if (data.return_value === "1") {
                status = 1;
                payload = {
                  mensaje: data.msg,
                  color: "success",
                  mostrar: true,
                };
              } else {
                status = 0;
                payload = {
                  mensaje: data.msg,
                  color: "error",
                  mostrar: true,
                };
              }
            })
            .catch((error) => {
              console.log(error);
              status = 0;
              payload = {
                mensaje:
                  "Nuestros sistemas están presentando dificultades para subir sus documentos, por favor contacte con un administrador",
                color: "error",
                mostrar: true,
              };
              this.loading = false;
            });
        }
        if (index == this.docs_subidos.length - 1) {
          if (status == 1) this.$emit("reload");
          this.mostrarAlerta(payload);
          this.loading = false;
        }
      });
    },
    async validate() {
      for (let i = 0; i < this.docs_subidos.length; i++) {
        this.$refs.form[i].validate();
      }
      if (this.valid) {
        await this.subir_documentacion();
      }
    },
  },
  mounted() {
    this.docs_subidos = new Array(this.docs_subir.length);
  },
};
</script>
