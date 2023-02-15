<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-card class="elevation-2 pb-8 darkGlass">
          <v-toolbar
            dense
            color="primary"
            dark
            flat
            class="mb-8 primaryGradient"
            tile
          >
            <v-toolbar-title class="flex text-center titulo"
              >Actualizar Datos</v-toolbar-title
            >
          </v-toolbar>
          <v-row
            class="fill-height"
            align-content="center"
            justify="center"
            v-if="loading"
          >
            <v-col class="text-subtitle-1 text-center" cols="12">
              Cargando Datos
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="primary"
                indeterminate
                rounded
                height="10"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <div v-else>
            <v-row justify="center">
              <v-col cols="12" sm="10" md="8">
                <v-alert
                  outlined
                  border="left"
                  type="success"
                  dense
                  prominent
                  style="font-size: 19px"
                >
                  Procure completar todos los campos para poder actualizar sus
                  datos.
                </v-alert>
              </v-col>
            </v-row>
            <v-form ref="form_persona" v-model="valid_persona">
              <v-row justify="center" class="px-4" no-gutters>
                <v-col cols="12">
                  <v-subheader>Información Personal</v-subheader>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.tipdr_s_id"
                    :items="direcciones"
                    label="Tipo Dirección"
                    dense
                    outlined
                    class="mx-4"
                    item-text="tipdr_c_nombre"
                    item-value="tipdr_s_id"
                    readonly
                    style="pointer-events: none"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-map-marker-account </v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formattedDate"
                        class="mx-4"
                        clearable
                        label="Fecha de nacimiento"
                        dense
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                        required
                        :rules="[reglas.required]"
                      >
                        <template v-slot:prepend>
                          <v-icon color="primary"> mdi-calendar </v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.perso_f_nacimiento"
                      no-title
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.dipca_s_id"
                    :items="calles"
                    label="Tipo Calle"
                    dense
                    outlined
                    class="mx-4"
                    item-text="tipca_c_nombre"
                    item-value="tipca_s_id"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-road-variant </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.tipvi_s_id"
                    :items="viviendas"
                    label="Tipo Vivienda"
                    dense
                    outlined
                    class="mx-4"
                    item-text="tipvi_c_nombre"
                    item-value="tipvi_s_id"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-home-city </v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.direc_c_calle"
                    label="Calle"
                    dense
                    outlined
                    persistent-hint
                    type="text"
                    class="mx-4"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-home-map-marker </v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.direc_c_numero"
                    label="Número"
                    dense
                    outlined
                    persistent-hint
                    type="text"
                    class="mx-4"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-numeric </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.regio_s_id"
                    :items="regiones"
                    label="Región"
                    dense
                    outlined
                    class="mx-4"
                    item-text="regio_c_nombre"
                    item-value="regio_s_id"
                    @change="(provincias = []), (comunas = [])"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-map-marker </v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.ciuda_s_id"
                    :items="provincias"
                    label="Provincia"
                    dense
                    outlined
                    class="mx-4"
                    item-text="ciuda_c_nombre"
                    item-value="ciuda_s_id"
                    no-data-text="Debe seleccionar una región"
                    @click="getProvincias()"
                    @change="comunas = []"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-sign-real-estate </v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.comun_s_id"
                    :items="comunas"
                    label="Comuna"
                    dense
                    outlined
                    class="mx-4"
                    item-text="comun_c_nombre"
                    item-value="comun_s_id"
                    no-data-text="Debe seleccionar una región"
                    @click="getComunas()"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-sign-real-estate </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.direc_c_fono"
                    label="Teléfono"
                    dense
                    outlined
                    required
                    persistent-hint
                    type="text"
                    class="mx-4"
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-phone </v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.perso_c_movil"
                    label="Celular"
                    dense
                    outlined
                    persistent-hint
                    type="text"
                    class="mx-4"
                    required
                    :rules="[reglas.required]"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-cellphone </v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.direc_c_email"
                    label="Correo Electrónico"
                    dense
                    outlined
                    persistent-hint
                    required
                    :rules="[reglas.required, reglas.email]"
                    type="text"
                    class="mx-4"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-email </v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="primary"
                    :loading="loading1"
                    @click="validate(1)"
                    class="mx-4"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Actualizar Información Personal
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-form ref="form_banco" v-model="valid_banco">
              <!--v-subheader>Datos Bancarios</v-subheader-->
              <v-row justify="center" class="px-4" no-gutters>
                <v-col cols="12">
                  <v-subheader>Datos Bancarios</v-subheader>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="bancoForm.banco_s_id"
                    :items="bancos"
                    label="Banco"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Campo requerido']"
                    class="mx-4"
                    item-text="banco_c_nombre"
                    item-value="banco_s_id"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-bank </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="bancoForm.tippb_s_id"
                    :items="cuentas"
                    label="Tipo de cuenta"
                    dense
                    outlined
                    :rules="[(v) => !!v || 'Campo requerido']"
                    class="mx-4"
                    item-text="tippb_c_nombre"
                    item-value="tippb_s_id"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-bank-transfer </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="bancoForm.numero_cuenta_bco"
                    label="Número de cuenta"
                    dense
                    outlined
                    required
                    persistent-hint
                    :rules="[(v) => !!v || 'Campo requerido']"
                    type="text"
                    class="mx-4"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-numeric </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    color="primary"
                    @click="validate(2)"
                    :loading="loading2"
                    class="mx-4"
                  >
                    <v-icon left>mdi-bank-check</v-icon>
                    Actualizar Información Bancaria
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState } from "vuex";
import auth from "@/auth/auth";
import moment from "moment";
import { omit } from "lodash";
export default {
  components: {
    //
  },
  data: function () {
    return {
      alert: false,
      alertMsg: "",
      menu: false,
      baseForm: {
        accion: -1,
        direc_s_id: "",
        rut: "",
      },
      form: {
        regio_s_id: "",
        ciuda_s_id: "",
        comun_s_id: "",
        tipdr_s_id: "",
        dipca_s_id: "", //tipca_s_id

        tipvi_s_id: "",
        direc_c_calle: "",
        direc_c_numero: "",
        direc_c_fono: "",
        direc_c_email: "",
        perso_c_movil: "",
        perso_f_nacimiento: "",
      },
      //Datos Bancarios
      bancoForm: {
        tippb_s_id: "",
        numero_cuenta_bco: "",
        proba_s_id: "",
        banco_s_id: "",
      },
      valid_persona: true,
      valid_banco: true,
      direcciones: [],
      calles: [],
      viviendas: [],
      regiones: [],

      bancos: [],
      cuentas: [],
      provincias: [],
      comunas: [],
      reglas: {
        required: (value) => !!value || "Campo Requerido.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Ingrese un correo válido.";
        },
      },
      loading: true,
      loading1: false,
      loading2: false,
    };
  },
  computed: {
    ...mapState(["rutaActual"]),
    formattedDate() {
      return this.form.perso_f_nacimiento
        ? moment(this.form.perso_f_nacimiento).format("DD/MM/YYYY")
        : null;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    validate(i) {
      if (i == 1) {
        this.$refs.form_persona.validate();
        if (this.valid_persona) {
          this.guardarDatosCliente();
        }
      } else {
        this.$refs.form_banco.validate();
        if (this.valid_banco) {
          this.guardarDatosBancarios();
        }
      }
    },
    async guardarDatosBancarios() {
      this.loading2 = true;
      let data = { ...this.baseForm, ...this.bancoForm };
      data.accion = 11;
      await auth
        .datosCliente(data)
        .then((response) => {
          let data = response.data[0];
          let rv = parseInt(data.return_value);
          if (rv > 0) {
            this.mostrarAlerta({
              color: "success",
              mensaje: "Datos bancarios actualizados correctamente",
              mostrar: true,
            });
          } else if (rv == 0) {
            this.mostrarAlerta({
              color: "warning",
              mensaje: data.return_msg,
              mostrar: true,
            });
          } else {
            this.mostrarAlerta({
              color: "error",
              mensaje: "Error al actualizar datos bancarios",
              mostrar: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.mostrarAlerta({
            color: "error",
            text: "Error al actualizar datos bancarios",
          });
        });
      this.loading2 = false;
    },
    async getDatosClientes(accion, form) {
      form.accion = accion;
      await auth
        .datosCliente(form)
        .then((response) => {
          switch (accion) {
            case 1: {
              let data = response.data[0];
              for (const prop in data) {
                if (data[prop] == null) data[prop] = "";
              }
              this.form = omit(data, [
                "numero_cuenta_bco",
                "tippb_s_id",
                "proba_s_id",
                "banco_s_id",
              ]);

              let date = moment(
                this.form.perso_f_nacimiento,
                "DD/MM/YYYY"
              ).format("yyyy-MM-DD");
              this.form.perso_f_nacimiento = date;
              if (
                this.form.direc_c_calle === null ||
                this.form.direc_c_calle === ""
              ) {
                this.form.regio_s_id = "";
                this.form.ciudad = "";
                this.form.comuna = "";
              }
              this.bancoForm.numero_cuenta_bco = data.numero_cuenta_bco;
              this.bancoForm.tippb_s_id = data.tippb_s_id;
              this.bancoForm.proba_s_id = data.proba_s_id;
              this.bancoForm.banco_s_id = data.banco_s_id;
              break;
            }
            case 2: //Tipos de direccion
              this.direcciones = response.data;
              break;
            case 3: //Tipos de calles
              this.calles = response.data;
              break;
            case 4: //Tipos de viviendas
              this.viviendas = response.data;
              break;
            case 5: //Tipos de regiones
              this.regiones = response.data;
              this.getProvincias();
              break;
            case 6: //Tipos de provincia
              this.provincias = response.data;
              this.getComunas();
              break;
            case 7: //Tipos de comunas
              this.comunas = response.data;
              break;
            case 8: //Tipos de bancos
              this.bancos = response.data;
              break;
            case 9: //Tipos de cuentas
              this.cuentas = response.data;
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async guardarDatosCliente() {
      this.loading1 = true;
      let data = { ...this.baseForm, ...this.form };
      data.tipca_s_id = data.dipca_s_id;
      data.accion = 10;
      await auth
        .datosCliente(data)
        .then((response) => {
          let data = response.data[0];
          let rv = parseInt(data.return_value);
          if (rv > 0) {
            this.mostrarAlerta({
              color: "success",
              mensaje: data.return_msg,
              mostrar: true,
            });
          } else if (rv == -1) {
            this.mostrarAlerta({
              color: "warning",
              mensaje: data.return_msg,
              mostrar: true,
            });
          } else {
            this.mostrarAlerta({
              color: "error",
              mensaje: data.return_msg,
              mostrar: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.mostrarAlerta({
            color: "error",
            mensaje:
              "Ha ocurrido un error al guardar los datos, si el error persiste contacte al administrador del sistema",
            mostrar: true,
          });
        });
      this.loading1 = false;
    },
    getProvincias() {
      if (
        this.form.regio_s_id !== "0" &&
        this.form.regio_s_id !== null &&
        this.form.regio_s_id !== ""
      ) {
        this.getDatosClientes(6, {
          regio_s_id: this.form.regio_s_id,
          ...this.baseForm,
        });
      }
    },
    getComunas() {
      if (
        this.form.ciuda_s_id !== "0" &&
        this.form.ciuda_s_id !== null &&
        this.form.ciuda_s_id !== ""
      ) {
        this.getDatosClientes(7, {
          ciuda_s_id: this.form.ciuda_s_id,
          ...this.baseForm,
        });
      }
    },
  },
  async mounted() {
    this.loading = true;

    this.baseForm.direc_s_id = this.userLogged.direc_s_id;
    this.baseForm.rut = this.userLogged.rut;

    for (let i = 1; i <= 5; i++) {
      await this.getDatosClientes(i, this.baseForm);
    }
    await this.getDatosClientes(8, this.baseForm);
    await this.getDatosClientes(9, this.baseForm);

    this.loading = false;
  },
};
</script>

<style scoped lang="css">
.titulo {
  font-size: 30px;
  line-height: 30px;
  word-break: normal;
  font-weight: 300;
}
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 22px;
  word-break: normal;
}
</style>
