<template>
  <div>
    <v-dialog
      v-model="dialog.state"
      width="800px"
      max-width="800px"
    >
      <v-card
        tile
        flat
      >
        <v-toolbar
          color="primary"
          dark
          flat
          tile
        >
          <v-toolbar-title class="flex text-center titulo">Deposito a plazo N° {{dialog.data.n_cuenta}}</v-toolbar-title>
      </v-toolbar>
        <v-card-title >
          <span class="cabecera">Datos del producto:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="5">
            <v-list two-line id="element-to-convert">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-account-details
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Rut</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.user.rut}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-briefcase-account
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Descripción del producto</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.producto}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-briefcase-search
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Descripción estado</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.estado}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-start
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Fecha apertura</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.f_apertura}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-lock-alert
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Custodia digital</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.custodia_digital}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-currency-usd
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Monto interés pactado</v-list-item-subtitle>
                  <v-list-item-title>{{formatMonto(dialog.data.monto_interes)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-end
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Fecha vencimiento</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.f_vencimiento}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list>
          </v-col>



          <v-col cols="7  ">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-account
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Nombre</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.user.nombre}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash-sync
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Descripción tipo de renovación</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.desc_estado}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-expand-horizontal
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Plazo</v-list-item-subtitle>
                  <v-list-item-title>{{formatDias(dialog.data.daple_n_dia_plazo)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-percent-circle
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Tasa interés</v-list-item-subtitle>
                  <v-list-item-title>{{formatPorcentaje(dialog.data.tasa_base)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Monto inicial</v-list-item-subtitle>
                  <v-list-item-title>{{formatMonto(dialog.data.monto_inicial)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-cash-plus
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Monto final</v-list-item-subtitle>
                  <v-list-item-title>{{formatMonto(dialog.data.monto_final)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-sync
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Fecha renovación</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.f_renovacion_aut}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <v-card-title class="mt-4">
          <span class="cabecera">Detalles de renovaciones:</span>
        </v-card-title>
        <v-divider></v-divider>

         <v-data-table
          :headers="cabeceras"
          :items="detalles"
          :items-per-page="5"
          :loading="cargandoTabla"
        >
         <template
            v-slot:item.monto="{ item }"
          >
            {{ formatMonto(item.monto) }}
          </template>
          <template
            v-slot:item.saldo="{ item }"
          >
            {{ formatMonto(item.saldo) }}
          </template>
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              class="mx-2 my-2"
              @click="exportPDF()"
            >
              <v-icon left>mdi-download</v-icon>
                Descargar PDF
            </v-btn>
          <v-btn
            color="error"
            @click="cerrar()"
          >
            <v-icon left>mdi-window-close</v-icon>
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import socio from '@/services/socio';
import moment from 'moment';
import { jsPDF, autoTable} from "jspdf";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";

export default {
  props: ['dialog'],
  data () {
    return {
      cabeceras: [
        { text: 'Fecha Renovación',
          align: 'start',
          sortable: true, 
          value: 'f_renovacion' 
        },
        {
          text: 'Valor Renovación',
          align: 'start',
          sortable: true,
          value: 'v_renovacion',
        },
        { text: 'Tasa Interés Ren',
          align: 'start',
          sortable: true, 
          value: 't_interes_r' 
        },
        { text: 'Monto Interés Pactado',
          align: 'start',
          sortable: true, 
          value: 'm_int_pactado' 
        },
        { text: 'Monto Total',
          align: 'start',
          sortable: true, 
          value: 'monto_total' 
        },
        { text: 'Fecha Vencimiento',
          align: 'start',
          sortable: true, 
          value: 'f_vencimiento' 
        },
        { text: 'Fecha Renovación Automática',
          align: 'start',
          sortable: true, 
          value: 'f_automatica' 
        },
        { text: 'Vigente',
          align: 'start',
          sortable: true, 
          value: 'vigente' 
        },
        { text: '', value: 'actions', sortable: false },
      ],
      detalles:[],
      noData:false,
      cargandoTabla:true,
      urlPDF:'/maximiza/storage/app/media/cartolas/libretas_'
    }
  },
  computed:{
    monto(){
      let monto = parseInt(parseFloat(this.dialog.data.vistd_m_monto));
      return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(monto);
    },
  },
  methods: {
    cerrar(){
        this.dialog.state = false;
    },
    getDetalle(){
      socio.getDetalleDap(this.dialog.data.n_cuenta)
      .then( response => {
        this.cargandoTabla = true;
        console.log(response.data)
        if(response.data.length == 0)
          this.noData = true;
        else{
          this.noData = false;
          this.detalles = response.data;
        }
        this.cargandoTabla = false;
      })
      .catch( error => console.log(error))
    },
    formatMonto(monto){
      let intMonto = parseInt(parseFloat(monto));
      return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(Math.abs(intMonto));
    },
    formatPorcentaje(valor){
      return parseFloat(valor)+'%';
    },
    formatDias(valor){
      return valor === "1"? valor +' día': valor+' días';
    },
    generarPdf(){
      let templateCode = 'pdf::dap';
      let data = {
        nombre: this.dialog.user.nombre,
        rut: this.dialog.user.rut,
        fecha: moment(new Date(Date.now())).format('DD/MM/YYYY'),
        //Datos de pago
        producto: this.dialog.data.producto,
        tipo_renovacion: this.dialog.data.desc_estado,
        estado:this.dialog.data.estado,
        plazo:this.dialog.data.daple_n_dia_plazo,
        fecha_apertura:this.dialog.data.f_apertura,
        tasa_interes:this.dialog.data.tasa_base,
        custodia: this.dialog.data.custodia_digital,
        monto_inicial:this.dialog.data.monto_inicial,
        monto_final: this.dialog.data.monto_final,
        fecha_vencimiento: this.dialog.data.f_vencimiento,
        fecha_renovacion: this.dialog.data.f_renovacion_aut,
        monto_interes: this.dialog.data.monto_interes,
        dap_id: this.dialog.data.f_renovacion_aut,
        detalles:this.datalles
      };

      let nombre_archivo = this.urlPDF + moment(new Date(Date.now())).format('DDMMYYHHmmss')+'.pdf';
      let pathToFile = window.location.origin + nombre_archivo;
      let archivo_pdf = '0'
      let link = 'http://'+window.location.host+nombre_archivo;
      console.log(window.location.hostname)
      return link; 
    },
    exportPDF() {
      var doc = new jsPDF('p', 'pt');
      var columns = [];
      var img = new Image()
      img.src = require('@/assets/inicio/logo.png')
      console.log(img)
      doc.addImage(img, 'png', 0, 0, 193, 75)

      this.cabeceras.forEach( item => {
        columns.push({title: item.text, dataKey: item.value},)
      })
      doc.text('Depósito a plazo N°' + this.dialog.data.n_cuenta, 200, 75);
      doc.autoTable(columns, this.detalles, {
        margin: {top: 100},
      });
      doc.save('todos.pdf');
    },
    exportToPDF() {
      html2pdf(document.getElementById("element-to-convert"), {
				margin: 1,
  			filename: "i-was-html.pdf",
			});
    },
  },
  mounted(){
    this.getDetalle();
  }
}
</script>

<style scoped lang="css">
.titulo { 
    font-size:30px;
    line-height : 30px;
    word-break:normal;
    font-weight: 300;
  }
.cabecera {
  color: black;
  font-weight: 300;
  font-size:  22px;
  line-height : 22px;

}
</style>