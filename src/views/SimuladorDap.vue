<template>
  <v-container>
    <v-row
      justify="center">
      <v-col
        cols="10"
      >
        <v-stepper
          v-model="etapa"
          vertical
        >
        <v-stepper-step
          step="1"
        >
          Simular Depósito
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card outlined class="py-4 px-4">

          <v-form
            ref="form"
            v-model="valid"    
          >
            <v-select
              v-model="formData.producto"
              placeholder="Seleccionar Producto"
              :items="productos"
              :rules="[v => !!v || 'Campo requerido']"
              :menu-props="{offsetY: true }"
              item-text="nombre"
              return-object
              dense
              label="Producto"
              required
              outlined
              @change="validarMonto()"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-briefcase-account </v-icon> 
              </template>
            </v-select>

            <v-text-field
              v-model="formData.monto"
              :counter="10"
              dense
              label="Monto del depósito"
              v-mask="currencyMask"
              :hint="(formData.producto !== '')? ayudaMonto : ''"
              persistent-hint
              outlined
              required
              :rules="[
                v => !!v || 'Campo requerido',
                v => !!v && revisarMonto(v),
              ]"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-currency-usd </v-icon> 
              </template>
            </v-text-field>

            <v-select
              v-model="formData.plazo"
              :items="plazos"
              :rules="[v => !!v || 'Campo requerido']"
              :menu-props="{offsetY: true }"
              dense
              no-data-text="Debe seleccionar un producto para calcular los plazos disponibles"
              label="Plazo en el que desea invertir"
              outlined
              required
              @click="cargarPlazos()"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-calendar-expand-horizontal </v-icon> 
              </template>
            </v-select>

          </v-form>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="validate"
          >
            Continuar
          </v-btn>
          <v-btn class="ml-2" color="warning" @click="reset">
            Limpiar
          </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          step="2"
          :complete="etapa > 1"
        >
          Resultados
          </v-stepper-step>

          <v-stepper-content step="2">
          
          <v-card outlined v-if="resultado != null">
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                  mdi-bank-transfer-in
                  </v-icon>
              </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Tipo de depósito</v-list-item-subtitle>
                  <v-list-item-title>{{formData.producto.nombre}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
              <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-expand-horizontal
                  </v-icon>
              </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Días Plazo</v-list-item-subtitle>
                  <v-list-item-title>{{resultado.dias_plazo_real + ' días'}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                    <v-icon color="primary">
                      mdi-currency-usd
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Moneda</v-list-item-subtitle>
                  <v-list-item-title>{{resultado.nombre_moneda}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Valor del Depósito</v-list-item-subtitle>
                  <v-list-item-title>${{formData.monto}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-percent-circle
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Tasa</v-list-item-subtitle>
                  <v-list-item-title>{{conv.formatPorcentaje(resultado.tasa_base)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash-fast
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Interés</v-list-item-subtitle>
                  <v-list-item-title>{{conv.formatMonto(resultado.interes_pactado,true)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash-multiple
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Monto Final</v-list-item-subtitle>
                  <v-list-item-title>{{conv.formatMonto(resultado.monto_total,true)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-end
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Fecha Vencimiento</v-list-item-subtitle>
                  <v-list-item-title>{{resultado.fecha_vencimiento}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash-sync
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Tipo de renovación</v-list-item-subtitle>
                  <v-list-item-title>{{'Automatica'}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-btn
              color="warning"
              @click="etapa = 1"
              class="mx-2 my-2"
            >
            <v-icon left>mdi-arrow-left</v-icon>
              Volver
            </v-btn>

            <v-btn
              color="primary"
              class="mx-2 my-2"
              @click="etapa = 1"
            >
              <v-icon left>mdi-file-download</v-icon>
                Descargar Documento
            </v-btn>

              <v-btn
                color="info"
                class="mx-2 my-2"
              @click="etapa = 1"
            >
              <v-icon left>mdi-email</v-icon>
              Enviar Correo
            </v-btn>
          </v-card>
        </v-stepper-content>
      </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import moment from 'moment';
  import createNumberMask from "text-mask-addons/dist/createNumberMask";
  import auth from "@/auth/auth";
  import simulador from "@/services/simulador";
  import conv from '@/services/conversores';

  export default {
    data: function() {
      return {
        etapa:1,
        valid: true,
        hoy: new Date(Date.now()),
        formData:{ producto:'', monto:'',  plazo:'',},
        plazos:[],
        nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
        resultado: null,
        currencyMask: createNumberMask({
          prefix: "",
          includeThousandsSeparator: true,
          allowNegative: false,
          thousandsSeparatorSymbol: ".",
        }),
        productos:[],
      }
    },

    methods: {
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.enviarSimulacion();
          this.etapa = 2;
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      async getProductos(){
        await simulador.getProductosDaps(this.userLogged.rut)
        .then( response => {
          let productos = response.data;
          productos.forEach(async producto => {
            await simulador.getProductosDapsDetalle(producto.codigo, 2)
            .then(response => {
              var productoCompleto = Object.assign({}, producto, response.data[0]);
              this.productos.push(productoCompleto)
            })
          });
        }).catch( error => console.log(error))
      },
      cargarPlazos(){
        this.plazos = [];
        if(this.formData.producto !== ''){
          let inicio = parseInt(this.formData.producto.dia_plazo_minimo);
          let fin = parseInt(this.formData.producto.dia_plazo_maximo);
          for (let index = inicio; index <= fin; index++) {
            let dias = index;
            dias > 1 ? this.plazos.push(dias + ' días'):this.plazos.push(dias + ' día')
          }
        }
      },
      revisarMonto(value){
        if(this.formData.producto !== ''){
          let formatedValue = parseInt(value.split('.').join(""));
          let min = parseInt(this.formData.producto.monto_minimo);
          let max = parseInt(this.formData.producto.monto_maximo);
          if (formatedValue < min)
            return false || "El monto debe ser superior a " + conv.formatMonto(min,true);
          else if (formatedValue > max)
            return false || "El monto debe ser inferior a " + conv.formatMonto(max,true);
          else
            return true
        }
        return true
      },
      validarMonto(){
        this.formData.date = this.formData.producto.fecha_mec;
        if(this.formData.monto !== '')
          this.$refs.amountField.validate();
      },

      enviarSimulacion(){
        let datosFormulario = this.formData;
        let data = {
          procm_s_id: datosFormulario.producto.codigo,
          dias_plazo: datosFormulario.plazo.split(' ')[0],
          monto_deposito: parseInt(datosFormulario.monto.split('.').join("")),
        }
        simulador.simularDap(data)
        .then(response => {
          this.resultado = response.data[0];
        })
        .catch(error => console.log(error))
      },
    },
      

    mounted () {
      this.getProductos()
    },
    computed: {
      computedDateFormattedMomentjs () {
        moment.locale('es');
        return this.date ? moment(this.date).format('D [de] MMMM, YYYY') : ''
      },
      userLogged() {
        return auth.getUserLogged();
      },
      ayudaMonto(){
        let min = parseInt(this.formData.producto.monto_minimo);
        let max = parseInt(this.formData.producto.monto_maximo);
        return "El monto ingresado debe ser superior a " + conv.formatMonto(min,true) 
                + " e inferior a " + conv.formatMonto(max,true) 
      },
      conv(){
        return conv;
      }
    },
    watch:{
      menu1: function(){
        if(this.date === '')
          this.date = this.vencMin;
      },
    }
    

  }
</script>