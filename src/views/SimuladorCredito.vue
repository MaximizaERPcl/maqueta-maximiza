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
          Simular Crédito
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-card outlined class="py-4 px-4">

          <v-form
            ref="form"
            v-model="valid"    
          >
            <v-select
              v-model="formData.producto"
              :items="items"
              :rules="[v => !!v || 'Campo requerido']"
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
              type="number"
              :counter="10"
              dense
              label="Monto del crédito en pesos"
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
              :items="items"
              :rules="[v => !!v || 'Campo requerido']"
              dense
              label="Plazo en el que desea pagar"
              outlined
              required
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-calendar-expand-horizontal </v-icon> 
              </template>
            </v-select>

              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="computedDateFormattedMomentjs"
                    clearable
                    dense
                    label="Primer Vencimiento"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    @click:clear="date = null"
                    outlined
                    required
                    :rules="[v => !!v || 'Campo requerido']"
                  >
                    <template v-slot:prepend>        
                      <v-icon left color="primary"> mdi-calendar-end </v-icon> 
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @change="menu1 = false"
                  :min="vencMin"
                ></v-date-picker>
              </v-menu>
          </v-form>
          <v-text-field
              dense
              v-model="pago"
              label="Forma de pago"
              :value="pago"
              readonly
              outlined
              style="pointer-events: none"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-cash-clock </v-icon> 
              </template>
            </v-text-field>
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
                  mdi-cash-sync
                </v-icon>
             </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Cuota</v-list-item-subtitle>
                <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.cuota)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
             <v-list-item-icon>
                <v-icon color="primary">
                  mdi-percent-circle
                </v-icon>
             </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Interés</v-list-item-subtitle>
                <v-list-item-title>{{resultado.interes}}%</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash
                  </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Monto Solicitado</v-list-item-subtitle>
                <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.montoSolicitado)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-cash-check
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Monto Bruto del Crédito</v-list-item-subtitle>
                <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.montoBruto)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-calendar-expand-horizontal
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Plazo del Crédito</v-list-item-subtitle>
                <v-list-item-title>{{resultado.plazo +' meses'}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-cash-multiple
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Costo Total del Crédito</v-list-item-subtitle>
                <v-list-item-title>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(resultado.costoTotal)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-calendar-end
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Fecha Primer Vencimiento</v-list-item-subtitle>
                <v-list-item-title>{{date}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
               <v-list-item-icon>
                <v-icon color="primary">
                  mdi-percent-circle
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>CAE</v-list-item-subtitle>
                <v-list-item-title>{{resultado.cae}}%</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            </v-list>

            <v-btn
              color="warning"
              @click="etapa = 1"
              class="mx-2"
            >
            <v-icon left>mdi-arrow-left</v-icon>
              Volver
            </v-btn>

            <v-btn
              color="primary"
              class="mx-2"
              @click="etapa = 1"
            >
              <v-icon left>mdi-file-download</v-icon>
                Descargar Documento
            </v-btn>

              <v-btn
                color="info"
                class="mx-2"
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
  import moment from 'moment'
  import { format, parseISO } from 'date-fns'

  export default {
    data: function() {
      return {
        etapa:1,
        valid: true,
        formData:{ producto:'', monto:'',  plazo:'', pago: 'Descuento por planilla',},
        pago:'Descuento por planilla',
        date: '',
        vencMin: '',
        hoy: new Date(Date.now()),
        menu1: false,
        items:['1','2','3'],
        nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      resultado: {
        cuota: 34197,
        interes: 1.20,
        montoSolicitado: 100000,
        montoBruto: 100000,
        plazo: 3, 
        costoTotal: 102408,
        vencimiento: '',
        cae: 15.80,
        seguroDeg: 0,
        notaria:0,

      }
      }
    },

    methods: {
      validate () {
        this.$refs.form.validate()
         if(this.valid){
          this.etapa = 2;
        }
      },
      reset () {
        this.$refs.form.reset();
      },
    },

    mounted () {
      this.vencMin = moment(this.hoy.setMonth( this.hoy.getMonth() + 1 )).format('YYYY-MM-DD') //- (new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
      console.log(this.vencMin)
    },
    computed: {
      computedDateFormattedMomentjs () {
        moment.locale('es');
        return this.date ? moment(this.date).format('D [de] MMMM, YYYY') : ''
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