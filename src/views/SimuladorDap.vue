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
              outlined
              required
              :rules="[v => !!v || 'Campo requerido']"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-currency-usd </v-icon> 
              </template>
            </v-text-field>

            <v-select
              v-model="formData.plazo"
              :items="plazos"
              :rules="[v => !!v || 'Campo requerido']"
              dense
              label="Plazo en el que desea invertir"
              outlined
              required
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
          
          <v-card outlined>
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                  mdi-bank-transfer-in
                  </v-icon>
              </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle>Tipo de depósito</v-list-item-subtitle>
                  <v-list-item-title>{{resultado.tipo}}</v-list-item-title>
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
                  <v-list-item-title>{{resultado.plazo + ' días'}}</v-list-item-title>
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
                  <v-list-item-title>{{resultado.moneda}}</v-list-item-title>
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
                  <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.valor)}}</v-list-item-title>
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
                  <v-list-item-title>{{resultado.tasa +' %'}}</v-list-item-title>
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
                  <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.interes)}}</v-list-item-title>
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
                  <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.montoFinal)}}</v-list-item-title>
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
                  <v-list-item-title>{{resultado.fechaVenc}}</v-list-item-title>
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
                  <v-list-item-title>{{resultado.renovacion}}</v-list-item-title>
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
        resultado: {
          tipo: '104 - DAP UF >360',
          plazo: 30,
          moneda: 'Peso',
          valor: 100000, 
          tasa: 0.7377,
          interes: 738,
          montoFinal: 100738,
          fechaVenc: '',
          renovacion:'Automática',

        },
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
          this.resultado.fechaVenc = moment(this.hoy.setDate( this.hoy.getDate() + 30 )).format('YYYY-MM-DD') //- (new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
          this.etapa = 2;
          console.log(this.formData)
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      async getProductos(){
        await simulador.getProductosDaps(this.userLogged.rut)
        .then( response => {
          this.productos = response.data;
        }).catch( error => console.log(error))
      },
    },
      

    mounted () {
      this.getProductos()
      for (let index = 0; index < 90; index++) {
        let dias = index + 1;
        dias > 1 ? this.plazos.push(dias + ' días'):this.plazos.push(dias + ' día') 
      }
    },
    computed: {
      computedDateFormattedMomentjs () {
        moment.locale('es');
        return this.date ? moment(this.date).format('D [de] MMMM, YYYY') : ''
      },
      userLogged() {
        return auth.getUserLogged();
      },
    },
    watch:{
      menu1: function(){
        if(this.date === '')
          this.date = this.vencMin;
      },
      /*'formData.monto': function(){
        this.formData.monto = Intl.NumberFormat('es-CL',{currency: 'CLP', decimal:','}).format(this.formData.monto);
        console.log(this.formData.monto)
      }*/
    }

  }
</script>