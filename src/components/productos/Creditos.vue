<template>
  <v-container class="py-0">
    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        cols="11"> 
        <v-card
          outlined
          v-if="creditos != null"
        >
          <v-toolbar
            color="primary"
            dark
            flat
            class="mb-4"
            tile
            
          >
            <v-toolbar-title class="flex text-center titulo">Créditos</v-toolbar-title>
          </v-toolbar>
          <v-row
            class="fill-height mb-4"
            align-content="center"
            justify="center"
            v-if="loading"
          >
            <v-col
              class="text-subtitle-1 text-center"
              cols="12"
            >
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
          <app-no-datos v-if="noDatos" v-bind:msg="msg"></app-no-datos>
          <v-container v-else>
            <v-data-table 
              :headers="cabeceras1"
              :items="creditos"
              class="mx-4 mb-2 elevation-1"
            >
              <template
                v-slot:item.valor_cuota="{ item }"
              >
                {{ conv.formatMonto(item.valor_cuota, true) }}
              </template>
              <template
                v-slot:item.monto_otorgado="{ item }"
              >
                {{ conv.formatMonto(item.monto_otorgado, true) }}
              </template>
              <template
                v-slot:item.saldo_capital="{ item }"
              >
                {{ conv.formatMonto(item.saldo_capital, true) }}
              </template>
              <template
                v-slot:item.tasa="{ item }"
              >
                {{ item.tasa + '%' }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="mostrarDetalle(item)">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Más</span>
                </v-tooltip>
              </template>
              <template v-if="creditos.length > 0 " v-slot:body.append>
                <tr>
                  <td><b>TOTAL</b></td>
                  <td></td>
                  <td></td> 
                  <td><b>{{formatMonto(totalCreditos.valor_cuota)}}</b></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><b>{{formatMonto(totalCreditos.saldo_capital)}}</b></td>
                  <td><b>{{formatMonto(totalCreditos.monto_otorgado)}}</b></td>
                </tr>
              </template>
              <template v-slot:top>
                <v-system-bar
                flat
                outlined
                dense          
                :color="colorCabeceras"   
                height="40"
                >
                  <v-toolbar-title class="flex text-center cabecera">Créditos</v-toolbar-title>
                </v-system-bar>
              </template>
            </v-data-table>


            <v-data-table 
              :headers="cabeceras2"
              :items="cuotasMorosas"
              :search="search"
              class="mx-4 mb-2 elevation-1"
            >
              <template
                v-slot:item.valor_cuota="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valor_cuota) }}
              </template>
              <template
                v-slot:item.mora="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.mora) }}
              </template>
              <template
                v-slot:item.gasto_cobranza="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.gasto_cobranza) }}
              </template>
              <template
                v-slot:item.saldo_uota="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo_uota) }}
              </template>
              <template
                v-slot:item.acumulado="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.acumulado) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon>
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Más</span>
                </v-tooltip>
              </template>
              <template v-if="cuotasMorosas.length > 0 " v-slot:body.append>
                <tr>
                   <td><b>TOTAL</b></td>
                  <td></td>
                  <td></td> 
                  <td></td>
                  <td><b>{{formatMonto(totalCuotasMorosas.valor_cuota)}}</b></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><b>{{formatMonto(totalCuotasMorosas.saldo_uota)}}</b></td>
                </tr>
              </template>
              <template v-slot:top>
                <v-system-bar
                flat
                outlined
                dense
                :color="colorCabeceras"
                height="40"            
                >
                  <v-toolbar-title class="flex text-center cabecera">Cuotas Morosas Deudor</v-toolbar-title>
                </v-system-bar>
                <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  outlined
                  dense
                ></v-text-field>
                <v-spacer></v-spacer>

                </v-card-title>
              </template>
            </v-data-table>

            <v-data-table 
              :headers="cabeceras3"
              :items="creditosAvalados"
              class="mx-4 mb-2 elevation-1"
              no-data-text="No se encontraron créditos avalados"
            >
              <template
                v-slot:item.valorCuota="{ item }"
              >
                {{ formatMonto(item.valorCuota, true) }}
              </template>
              <template
                v-slot:item.capital="{ item }"
              >
                {{ formatMonto(item.capital, true) }}
              </template>
              <template
                v-slot:item.saldo="{ item }"
              >
                {{ formatMonto(item.saldo, true) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon>
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Más</span>
                </v-tooltip>
              </template>
              <template v-slot:top>
                <v-system-bar
                flat
                outlined
                dense   
                :color="colorCabeceras"
                height="40"   

                >
                  <v-toolbar-title class="flex text-center cabecera">Créditos Avalados</v-toolbar-title>
                </v-system-bar>
              </template>
            </v-data-table>

            <v-data-table 
              :headers="cabeceras4"
              :items="avalesVigentes"
              class="mx-4 mb-2 elevation-1"
              no-data-text="No se encontraron avales para el socio"         
            >
              <template
                v-slot:item.valorCuota="{ item }"
              >
                {{ formatMonto(item.valorCuota, true) }}
              </template>
              <template
                v-slot:item.capital="{ item }"
              >
                {{ formatMonto(item.capital, true) }}
              </template>
              <template
                v-slot:item.saldo="{ item }"
              >
                {{ formatMonto(item.saldo, true) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon>
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Más</span>
                </v-tooltip>
              </template>
              <template v-slot:top>
                <v-system-bar
                  flat
                  outlined
                  dense
                  :color="colorCabeceras"
                  height="40"     
                >
                  <v-toolbar-title class="flex text-center cabecera">Avales Vigentes del Socio</v-toolbar-title>
                </v-system-bar>
              </template>
            </v-data-table>
          </v-container>
        </div>
        </v-card>
      </v-col>
    </v-row>
    <app-detalle v-if="dialog.state" :dialog="dialog"></app-detalle>
  </v-container>
</template>

<script>
import NoDataVue from '../app/NoData.vue';
import auth from '@/auth/auth';
import socio from '@/services/socio';
import DetalleCreditosVue from './dialogos/DetalleCreditos.vue';
import conv from '@/services/conversores';

export default {
  components: {
      'app-no-datos': NoDataVue,
      'app-detalle': DetalleCreditosVue
  },
  data: function() {
    return {
      cabeceras1: [
        {
          text: 'N°',
          align: 'start',
          sortable: true,
          value: 'credito',
        },
        { text: 'Tipo de crédito',
          align: 'start',
          sortable: true, 
          value: 'tipo_credito' 
        },
        { text: 'Cuotas',
          align: 'start',
          sortable: true, 
          value: 'cuotas' 
        },
        { text: 'Valor Cuota',
          align: 'start',
          sortable: true, 
          value: 'valor_cuota' 
        },
        { text: 'Fecha de vencimiento',
          align: 'start',
          sortable: true, 
          value: 'fecha_vencimiento' 
        },
        { text: 'Fecha de otorgamiento',
          align: 'start',
          sortable: true, 
          value: 'fecha_otorgamiento' 
        },
        { text: 'Estado',
          align: 'start',
          sortable: true, 
          value: 'estado' 
        },
        { text: 'Tasa',
          align: 'start',
          sortable: true, 
          value: 'tasa' 
        },
        { text: 'Forma de pago',
          align: 'start',
          sortable: true, 
          value: 'forma_pago' 
        },
        { text: 'Saldo insoluto',
          align: 'start',
          sortable: true, 
          value: 'saldo_capital' 
        },
        { text: 'Monto Capital Otorgado',
          align: 'start',
          sortable: true, 
          value: 'monto_otorgado' 
        },
        { text: '', value: 'actions', sortable: false },
        ],
      cabeceras2: [
        { text: 'Tipo de crédito',
          align: 'start',
          sortable: true, 
          value: 'tipo_credito' 
        },
        {
          text: 'Cuota N°',
          align: 'start',
          sortable: true,
          value: 'cuota_n',
        },
        { text: 'Fecha de vencimiento',
          align: 'start',
          sortable: true, 
          value: 'fecha_vencimiento' 
        },
        { text: 'Dias de atraso',
          align: 'start',
          sortable: true, 
          value: 'dias_atraso' 
        },
        { text: 'Valor Cuota',
          align: 'start',
          sortable: true, 
          value: 'valor_cuota' 
        },
        
        { text: 'Mora',
          align: 'start',
          sortable: true, 
          value: 'mora' 
        },
        { text: 'Gasto Cobranza',
          align: 'start',
          sortable: true, 
          value: 'gasto_cobranza' 
        },
        { text: 'I.Pro',
          align: 'start',
          sortable: true, 
          value: 'i_pro' 
        },
        { text: 'Abonado',
          align: 'start',
          sortable: true, 
          value: 'abonado' 
        },
        { text: 'S.cuota',
          align: 'start',
          sortable: true, 
          value: 'saldo_uota' 
        },
        { text: 'Acumulado',
          align: 'start',
          sortable: true, 
          value: 'acumulado' 
        },
        ],

      cabeceras3: [
        {
          text: 'N° Crédito',
          align: 'start',
          sortable: true,
          value: 'creme_s_id',
        },
        { text: 'Producto',
          align: 'start',
          sortable: true, 
          value: 'procm_c_nombre' 
        },
        
        { text: 'Forma de pago',
          align: 'start',
          sortable: true, 
          value: 'forpg_c_abreviado' 
        },
        { text: 'Estado',
          align: 'start',
          sortable: true, 
          value: 'estcr_c_nombre' 
        },
        { text: 'Rut',
          align: 'start',
          sortable: true, 
          value: 'rut' 
        },
        
        { text: 'Nombre',
          align: 'start',
          sortable: true, 
          value: 'nombre' 
        },
        { text: 'Fecha',
          align: 'start',
          sortable: true, 
          value: 'creme_f_otorgamiento' 
        },
        { text: 'Cuota',
          align: 'start',
          sortable: true, 
          value: 'cantidad_cuota' 
        },
        { text: 'Oficina',
          align: 'start',
          sortable: true, 
          value: 'sucur_c_nombre' 
        },
        { text: 'Valor Cuota',
          align: 'start',
          sortable: true, 
          value: 'creme_m_valor_cuota' 
        },
        { text: 'Capital',
          align: 'start',
          sortable: true, 
          value: 'monto' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo_credito' 
        },
        ],

      cabeceras4: [
        {
          text: 'N° Crédito',
          align: 'start',
          sortable: true,
          value: 'creme_s_id',
        },
        { text: 'Producto',
          align: 'start',
          sortable: true, 
          value: 'procm_c_nombre' 
        },
        
        { text: 'Forma de pago',
          align: 'start',
          sortable: true, 
          value: 'forpg_c_abreviado' 
        },
        { text: 'Estado',
          align: 'start',
          sortable: true, 
          value: 'estcr_c_nombre' 
        },
        { text: 'Rut Aval',
          align: 'start',
          sortable: true, 
          value: 'rut_aval' 
        },
        
        { text: 'Fecha',
          align: 'start',
          sortable: true, 
          value: 'creme_f_otorgamiento' 
        },
        { text: 'Cuota',
          align: 'start',
          sortable: true, 
          value: 'cantidad_cuota' 
        },
        { text: 'Oficina',
          align: 'start',
          sortable: true, 
          value: 'sucur_c_nombre' 
        },
        { text: 'Valor Cuota',
          align: 'start',
          sortable: true, 
          value: 'creme_m_valor_cuota' 
        },
        { text: 'Capital',
          align: 'start',
          sortable: true, 
          value: 'monto' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo_credito' 
        },
        ],
      
      colorCabeceras: 'indigo darken-1',
      search: '',
      creditos: null,
      cuotasMorosas: [],
      creditosAvalados: [],
      avalesVigentes:[],
      noDatos: false,
      msg:'NO POSEE CRÉDITOS ASOCIADOS',
      dialog: {state:false, data:{}, user:{}},
      totalCuotasMorosas:{},
      totalCreditos:{},
      loading:true,
    }
  },
    methods:{
      async getSocioCredito(id_credito){
        await socio.getCreditos(this.userLogged.id_cliente)
          .then(response => {
            let credito = response.data;
            let filterCredito = credito.filter( credito => credito.credito === id_credito);
            return filterCredito;            
          })
          .catch(error => console.log(error));
      },
      async getDetalleCreditos(accion){
        await socio.getDetalleCreditos(this.userLogged.id_cliente, accion)
          .then(response => {
            if(accion === 2){
              this.cuotasMorosas = response.data;
              this.totalCuotasMorosas = response.data[response.data.length-1];
              this.cuotasMorosas.pop();
            }
            else if(accion === 3){
              this.totalCreditos = response.data[response.data.length-1];
              this.creditos = response.data.filter( credito => credito.credito !== "0");
              if(this.creditos.length == 0)
                this.noDatos = true;
              else
                this.noDatos = false;
            }
            else if(accion == 4 && response.data !== ""){
              this.creditosAvalados= response.data;
            }
            else if(accion == 5 && response.data !== ""){
              this.avalesVigentes = response.data;
            }
            
          })
          .catch(error => console.log(error));
      },
      calcularTotalCreditos(){
        let valor_cuota = 0;
        let saldo_capital = 0;
        let monto_otorgado = 0;
        this.creditos.forEach(credito => {
          valor_cuota += parseInt(credito.valor_cuota.split('.').join(""));
          saldo_capital += parseInt(credito.saldo_capital.split('.').join(""));
          monto_otorgado += parseInt(credito.monto_otorgado.split('.').join(""));
        });
      },
      async mostrarDetalle(item){
        this.dialog.data = item
        this.dialog.user = this.userLogged;
        this.dialog.state = true;
      },
        formatMonto(monto){
        let intMonto = parseInt(parseFloat(monto));
        return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(Math.abs(intMonto));
    },
    },
    async mounted(){
      this.loading = true;
      await this.getDetalleCreditos(3);
      await this.getDetalleCreditos(2);
      await this.getDetalleCreditos(4);
      await this.getDetalleCreditos(5);
      this.loading = false;
    },
    computed:{
      userLogged() {
          return auth.getUserLogged();
        },
        conv(){
        return conv;
      }
      },
      
    
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
  color: white;
  font-weight: 300;
  font-size:  22px;
  line-height : 22px;
  word-break:normal;

}
</style>