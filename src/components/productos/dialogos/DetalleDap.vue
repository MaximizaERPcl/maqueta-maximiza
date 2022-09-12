<template>
  <div>
    <v-dialog
      v-model="dialog.state"
      width="950px"
      max-width="950px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
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
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-account-details
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Rut</v-list-item-subtitle>
                <v-list-item-title>{{formatterRut(dialog.user.rut)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-calendar-expand-horizontal
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Plazo</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatDias(dialog.data.daple_n_dia_plazo)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-percent-circle
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Tasa interés</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatPorcentaje(dialog.data.tasa_base)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-cash
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Monto inicial</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatMonto(dialog.data.monto_inicial, true)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-currency-usd
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Monto interés pactado</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatMonto(dialog.data.monto_interes,true)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-cash-plus
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Monto final</v-list-item-subtitle>
                <v-list-item-title>{{conv.formatMonto(dialog.data.monto_final, true)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
            <v-divider class="hidden-md-and-up" />
          </v-col>
          <v-col cols="12" sm="12" md="6">
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
            <v-divider class="hidden-md-and-up" />
          </v-col>
        </v-row>
        

        <v-card-title class="mt-4">
          <span class="cabecera">Detalles de renovaciones:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title>
          <v-spacer class="hidden-sm-and-down" />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              outlined
              dense
            ></v-text-field>
          </v-card-title>
         <v-data-table
          :headers="cabeceras"
          :items="detalles"
          :items-per-page="5"
          :loading="cargandoTabla"
          :search="search"
        >
        <template
            v-slot:item.monto_total="{ item }"
          >
            ${{item.monto_total }}
          </template>

          <template
            v-slot:item.t_interes_r="{ item }"
          >
            {{conv.formatPorcentaje(item.t_interes_r) }}
          </template>

          <template
            v-slot:item.m_int_pactado="{ item }"
          >
            ${{item.m_int_pactado }}
          </template>

          <template
            v-slot:item.v_renovacion="{ item }"
          >
            ${{item.v_renovacion}}
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
import pdf from '@/services/pdfGenerator';
import conv from "@/services/conversores";
import { formatterRut } from 'chilean-formatter';

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
      ],
      detalles:[],
      noData:false,
      cargandoTabla:true,
      search:''
    }
  },
  computed:{
    monto(){
      let monto = parseInt(parseFloat(this.dialog.data.vistd_m_monto));
      return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(monto);
    },
    conv(){
      return conv;
    },
    formatterRut(){
      return formatterRut;
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
    exportPDF() {
      pdf.exportToPdfDAP(this.cabeceras,this.detalles,this.dialog,'Depósito a plazo N°' + this.dialog.data.n_cuenta)
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