<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-card class="elevation-2 pb-8">
          <!--template slot="progress">
          <v-progress-linear color="primary" height="10" indeterminate></v-progress-linear>
        </template-->
          <v-toolbar color="primary" dark flat class="mb-8" tile>
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
              <v-col cols="11">
                <v-alert
                  outlined
                  text
                  color="success"
                  style="font-size: 18px"
                  class="text-center mb-8"
                >
                  Algunos de los campos son <b>obligatorios</b>.
                </v-alert>
              </v-col>
            </v-row>
            <v-form ref="form" v-model="valid">
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
                    required
                    persistent-hint
                    :rules="[(v) => !!v || 'Campo requerido']"
                    type="text"
                    class="mx-4"
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
                    :rules="[(v) => !!v || 'Campo requerido']"
                    type="text"
                    class="mx-4"
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
                    required
                    persistent-hint
                    :rules="[(v) => !!v || 'Campo requerido']"
                    type="text"
                    class="mx-4"
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
                    required
                    persistent-hint
                    :rules="[(v) => !!v || 'Campo requerido']"
                    type="text"
                    class="mx-4"
                  >
                    <template v-slot:prepend>
                      <v-icon color="primary"> mdi-email </v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <!--v-subheader>Datos Bancarios</v-subheader-->
              <v-row justify="center" class="px-4" no-gutters>
                <v-col cols="12">
                  <v-subheader>Datos Bancarios</v-subheader>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="form.proba_s_id"
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
                    v-model="form.tippb_s_id"
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
                      <v-icon color="primary"> mdi-briefcase-account </v-icon>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="form.numero_cuenta_bco"
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
                  <v-btn large color="primary" @click="validate()" class="mx-4">
                    <v-icon left>mdi-content-save</v-icon>
                    Actualizar Información
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
import { mapState } from "vuex";
import auth from "@/auth/auth";
import moment from "moment";
export default {
  components: {
    //
  },
  data: function () {
    return {
      alert: false,
      alertMsg: "",
      menu: false,
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

        //Datos Bancarios
        tippb_s_id: "",
        numero_cuenta_bco: "",
        proba_s_id: "",
      },
      valid: true,
      direcciones: [],
      calles: [],
      viviendas: [],
      regiones: [],

      bancos: [],
      cuentas: [],
      provincias: [],
      comunas: [],
      loading: true,
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
    validate() {
      this.$refs.form.validate();
      this.guardarCambios();
      if (this.valid) {
        //this.login()
      }
    },
    guardarCambios() {
      let data = JSON.parse(JSON.stringify(this.form));

      data.accion = 10;
      data.adicional = "";
      data.direc_s_id = this.userLogged.direc_s_id;
      data.rut = this.userLogged.rut;
      data.perso_f_nacimiento = moment(data.perso_f_nacimiento).format(
        "DD/MM/YYYY"
      );
      data.tipca_s_id = data.dipca_s_id;

      this.updateDatosCliente(data);
    },
    async guardarDatosBancarios(data) {
      await (
        await auth.guardarDatosBancarios(
          this.userLogged.rut,
          this.userLogged.direc_s_id,
          data
        )
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    },
    async getDatosClientes(accion, add) {
      let form = {
        accion: accion,
        rut: this.userLogged.rut,
        direc_s_id: this.userLogged.direc_s_id,
        adicional: add,
      };
      await auth
        .datosCliente(form)
        .then((response) => {
          //console.log(accion+' ', response.data)
          switch (accion) {
            case 1: {
              //Datos de cliente
              this.form = response.data[0];
              for (const prop in this.form) {
                if (this.form[prop] == null) this.form[prop] = "";
              }
              console.log(this.form.perso_f_nacimiento);
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
    async updateDatosCliente(data) {
      console.log(data);
      await auth
        .datosCliente(data)
        .then((response) => {
          console.log(response.data[0]);
        })
        .catch((error) => console.log(error));
    },
    getProvincias() {
      if (
        this.form.regio_s_id !== "0" &&
        this.form.regio_s_id !== null &&
        this.form.regio_s_id !== ""
      ) {
        this.getDatosClientes(6, this.form.regio_s_id);
      }
    },
    getComunas() {
      if (
        this.form.ciuda_s_id !== "0" &&
        this.form.ciuda_s_id !== null &&
        this.form.ciuda_s_id !== ""
      ) {
        this.getDatosClientes(7, this.form.ciuda_s_id);
      }
    },
  },
  async mounted() {
    this.loading = true;
    for (let i = 1; i <= 5; i++) {
      await this.getDatosClientes(i, "");
    }
    await this.getDatosClientes(8, "");
    await this.getDatosClientes(9, "");
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
