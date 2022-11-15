<template>
  <v-container>
    <v-row
      justify="center">
      <v-col
        cols="12" sm="11" md="10"
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
              ref="amountField"
              v-model="formData.monto"
              dense
              label="Monto del crédito en pesos"
              outlined
              required
              v-mask="currencyMask"
              :hint="(formData.producto !== '')? ayudaMonto : ''"
              persistent-hint
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
              dense
              :menu-props="{offsetY: true }"
              no-data-text="Debe seleccionar un producto para calcular los plazos disponibles"
              label="Plazo en el que desea pagar"
              outlined
              required
              @click="cargarPlazos()"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-calendar-expand-horizontal </v-icon> 
              </template>
            </v-select>

              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :close-on-click="false"
                max-width="290"
                transition="scale-transition"
                offset-y
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
                    @click:clear="formData.date = null"
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
                  v-model="formData.date"
                  @change="menu1 = false"
                  :allowed-dates="allowedDates"
                  :min="vencMin"
                  :first-day-of-week="1"
                  elevation="10"
                  locale="es-cl"
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
          <v-card outlined v-if="resultado != null">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-cash-sync
                </v-icon>
             </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-subtitle>Cuota</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatMonto(resultado.valor_cuota, true)}}</v-list-item-title>
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
                <v-list-item-title>{{formatPorcentaje(resultado.tasa_visible)}}</v-list-item-title>
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
                <v-list-item-title>${{formData.monto}}</v-list-item-title>
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
                <v-list-item-title>{{conv.formatMonto(resultado.monto_bruto,true)}}</v-list-item-title>
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
                <v-list-item-title>{{resultado.cuota +' meses'}}</v-list-item-title>
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
                <v-list-item-title>{{conv.formatMonto(resultado.valor_total, true)}}</v-list-item-title>
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
                <v-list-item-title>{{resultado.fprimervencimiento}}</v-list-item-title>
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
                <v-list-item-title>{{formatPorcentaje(resultado.tasa_cae)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>
          <v-data-table 
            :headers="cabeceras"
            :items="gastos"
            class="mx-2 mb-2 elevation-1"
          >
          <template
            v-slot:item.gascr_m_valor_or="{ item }"
          >
            ${{item.gascr_m_valor_or}}
          </template>
          <template v-slot:top>
              <v-toolbar
                flat
                outlined
                dense
                tile           
              >
                    <v-icon left color="primary">
                    mdi-currency-usd
                  </v-icon>
                <v-list-item-title class="ml-2">Detalle gastos</v-list-item-title>
              </v-toolbar>
            </template>
          </v-data-table>

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
              @click="exportToPDF()"
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
  import pdf from '@/services/pdfGenerator'

  export default {
    data: function() {
      return {
        etapa:1,
        valid: true,
        formData:{ producto:'', monto:'',  plazo:'', pago: 'Descuento por planilla', date:''},
        pago:'Descuento por planilla',
        vencMin: '',
        hoy: new Date(Date.now()),
        menu1: false,
        plazos:[],
        productos:[],
        resultado: null,
        gastos: [],

        currencyMask: createNumberMask({
          prefix: "",
          includeThousandsSeparator: true,
          allowNegative: false,
          thousandsSeparatorSymbol: ".",
        }),

        //Para la tabla de gastos
        cabeceras: [
          {
            text: 'Nombre',
            align: 'start',
            sortable: true,
            value: 'gascr_c_nombre',
          },
          { text: 'Monto',
            align: 'start',
            sortable: true, 
            value: 'gascr_m_valor_or' },
        ],
        userLogged:null
      }
    },
    methods:{
      async getUserLogged() {
        await auth.getCryptKey()
        .then(response => {
          let key  = response.data[0].crypt_key;
          this.userLogged = auth.getUserLogged(key);
        })
      },
      validate () {
        this.$refs.form.validate()
         if(this.valid){
          this.enviarSimulacion(1);
          this.etapa = 2;
        }
      },
      allowedDates(val) {
        return moment(val).day() !== 0 && moment(val).day() !== 6
      },
      reset () {
        this.$refs.form.reset();
      },
      async getProductos(){
        await simulador.getProductosCreditos(this.userLogged.rut)
        .then( response => {
          this.productos = response.data;
        }).catch( error => console.log(error))
      },
      cargarPlazos(){
        this.plazos = [];
        if(this.formData.producto !== ''){
          let inicio = parseInt(this.formData.producto.concl_n_cuota_minimo);
          let fin = parseInt(this.formData.producto.concl_n_cuota_maximo);
          for (let index = inicio; index <= fin; index++) {
            let meses = index;
            meses > 1 ? this.plazos.push(meses + ' meses'):this.plazos.push(meses + ' mes')
          }
        }
      },
      revisarMonto(value){
        if(this.formData.producto !== ''){
          let formatedValue = parseInt(value.split('.').join(""));
          let min = parseInt(this.formData.producto.monto_minimo);
          let max = parseInt(this.formData.producto.monto_maximo);
          if (formatedValue < min)
            return false || "El monto debe ser superior a " + conv.formatMonto(min, true);
          else if (formatedValue > max)
            return false || "El monto debe ser inferior a " + conv.formatMonto(max, true);
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
      enviarSimulacion(accion){
        console.log(this.userLogged)
        let datosFormulario = this.formData;
        let f_otorgamiento = moment(new Date(Date.now())).format('DD/MM/YYYY');
        let data = {
          procm_s_id: datosFormulario.producto.codigo,
          rut: this.userLogged.rut,
          accion: accion,
          fecha_otorgamiento: f_otorgamiento, //cuando se hizo la simulacion
          primer_vencimiento: this.formatDate(datosFormulario.date),
          seguro_desgravamen: 1,
          monto:  parseInt(datosFormulario.monto.split('.').join("")),
          monto_solicitado:  parseInt(datosFormulario.monto.split('.').join("")),
          cantidad_cuota: datosFormulario.plazo.split(' ')[0],
          amortizacion: datosFormulario.producto.amortizacion //se ignora 
        }
        simulador.simularCredito(data)
        .then(response => {
          let result = response.data;
          console.log(result)
          if(accion == 1){
            this.resultado = result[0];
            this.enviarSimulacion(2);
          }
          else{
            let value = parseInt(result[result.length - 1].gascr_m_valor_or);
            let seg = parseInt(this.resultado.valor_seguro);
            let seg_desg = Intl.NumberFormat('es-CL',{currency: 'CLP'}).format( seg - value);
            this.gastos = response.data;
            //this.gastos.unshift({gascr_c_nombre:'Seguro Desgravamen', gascr_m_valor: seg_desg});
          }

        })
        .catch(error => console.log(error))
      },

      exportToPDF(){
        let solicitud = JSON.parse(JSON.stringify(this.formData));
        solicitud.nombre = this.userLogged.nombre
        solicitud.rut = this.userLogged.rut
        pdf.exportToPdfSimCredito(this.cabeceras,this.gastos,solicitud,this.resultado)
      },
      sendEmail(){
        let formEmail = {
          accion: '1',
          clien_s_id:this.userLogged.id_cliente,
          cre_tasa_interes_mensual:this.resultado.tasa_visible,
          cre_monto_solicitado:this.formData.monto,
          cre_monto_bruto_credito:this.resultado.monto_bruto,
          cre_plazo_credito:this.resultado.cuota,
          cre_costo_total_credito:this.resultado.valor_total,
          cre_fecha_primer_venc:this.resultado.fprimervencimiento,
          cre_cae:this.resultado.tasa_cae,
          cre_gasto_nombre:this.gastos[1].gascr_c_nombre,
          cre_gasto_costo:this.gastos[1].gascr_m_valor,
          cre_gasto_id:this.gastos[1].gascr_s_id,
        }
      },
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      formatPorcentaje(valor){
        var num = parseFloat(valor)*100
        //var preRedondeo = Number(num.toPrecision(15));
        //var final = Math.round(preRedondeo) / 100 * Math.sign(num);
        return num.toFixed(2) + '%'
      }
    },

    async mounted () {
      await this.getUserLogged();
      this.getProductos()
      var nextMes = new Date (this.hoy.setMonth( this.hoy.getMonth() + 1 ));

      if (nextMes.getDay() == 0 || nextMes.getDay() == 6){
        nextMes.setDate(nextMes.getDate() + ((7 - nextMes.getDay()) % 7 + 1) % 7);
      }
      this.vencMin = moment(nextMes).format('YYYY-MM-DD');
    },
    computed: {
      computedDateFormattedMomentjs () {
        moment.locale('es');
        return this.formData.date ? moment(this.formData.date).format('D [de] MMMM, YYYY') : ''
      },
      ayudaMonto(){
        let msg = "";
        let min = parseInt(parseFloat(this.formData.producto.monto_minimo));
        let max = parseInt(parseFloat(this.formData.producto.monto_maximo));

        if(max == 0 || max >= 999999999)
          msg = "El monto ingresado debe ser superior a " + conv.formatMonto(min, true);
         
        else
          msg = "El monto ingresado debe ser superior a " + conv.formatMonto(min, true) 
                + " e inferior a " + conv.formatMonto(max, true);
        return msg
      },
      conv(){
        return conv;
      }
      
    },
    watch:{
      menu1: function(){
        if(this.formData.date === '')
          this.formData.date = this.vencMin;
      },
      /*'formData.producto': function(){
        //this.formData.monto = Intl.NumberFormat('es-CL',{currency: 'CLP', decimal:','}).format(this.formData.monto);
        this.$refs.amountField.validate();
      }*/
    }

  }
</script>