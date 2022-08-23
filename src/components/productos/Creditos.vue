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
        >
          <v-toolbar
            color="primary"
            dark
            flat
            class="mb-3"
            dense
            tile
            
          >
            <v-toolbar-title class="flex text-center">Créditos</v-toolbar-title>
          </v-toolbar>
          <v-data-table 
            :headers="cabeceras1"
            :items="creditos"
            class="mx-4 mb-2 elevation-1"
          >
            <template
              v-slot:item.valor_cuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valor_cuota) }}
            </template>
            <template
              v-slot:item.monto_otorgado="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.monto_otorgado) }}
            </template>
            <template
              v-slot:item.saldo_capital="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo_capital) }}
            </template>
            <template
              v-slot:item.tasa="{ item }"
            >
              {{ item.tasa + '%' }}
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
            <template v-if="creditos.length > 0 " v-slot:body.append>
              <tr>
                <td><b>TOTAL</b></td>
                <td></td>
                <td></td> 
                <td><b>-</b></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>-</b></td>
                <td><b>-</b></td>
              </tr>
            </template>
            <template v-slot:top>
              <v-toolbar
              flat
              outlined
              dense             
              >
                <v-toolbar-title class="flex text-center">Créditos</v-toolbar-title>
              </v-toolbar>
            </template>
          </v-data-table>


          <v-data-table 
            :headers="cabeceras2"
            :items="cuotasMorosas"
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
                <td><b>-</b></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>-</b></td>
              </tr>
            </template>
            <template v-slot:top>
              <v-toolbar
              flat
              outlined
              dense             
              >
                <v-toolbar-title class="flex text-center">Cuotas Morosas Deudor</v-toolbar-title>
              </v-toolbar>
            </template>
          </v-data-table>

          <v-data-table 
            :headers="cabeceras3"
            :items="creditosAvalados"
            class="mx-4 mb-2 elevation-1"
          >
            <template
              v-slot:item.valorCuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valorCuota) }}
            </template>
            <template
              v-slot:item.capital="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.capital) }}
            </template>
            <template
              v-slot:item.saldo="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo) }}
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
            <template v-if="creditosAvalados.length > 0 " v-slot:body.append>
              <tr>
                <td><b>TOTAL</b></td>
                <td></td>
                <td></td> 
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(147680)}}</b></td>
              </tr>
            </template>
            <template v-slot:top>
              <v-toolbar
              flat
              outlined
              dense          
              >
                <v-toolbar-title class="flex text-center">Créditos Avalados</v-toolbar-title>
              </v-toolbar>
            </template>
          </v-data-table>

          <v-data-table 
            :headers="cabeceras4"
            :items="avalesVigentes"
            class="mx-4 mb-2 elevation-1"
          >
            <template
              v-slot:item.valorCuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valorCuota) }}
            </template>
            <template
              v-slot:item.capital="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.capital) }}
            </template>
            <template
              v-slot:item.saldo="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo) }}
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
            <template v-if="avalesVigentes.length > 0 " v-slot:body.append>
              <tr
              
              >
                <td><b>TOTAL</b></td>
                <td></td>
                <td></td> 
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(147680)}}</b></td>
              </tr>
            </template>
            <template v-slot:top>
              <v-toolbar
              flat
              outlined
              dense             
              >
                <v-toolbar-title class="flex text-center">Avales Vigentes del Socio</v-toolbar-title>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth from '@/auth/auth';
import socio from '@/services/socio';
export default {
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
            value: 'numCredito',
          },
          { text: 'Producto',
            align: 'start',
            sortable: true, 
            value: 'producto' 
          },
          
          { text: 'Forma de pago',
            align: 'start',
            sortable: true, 
            value: 'pago' 
          },
          { text: 'Estado',
            align: 'start',
            sortable: true, 
            value: 'estado' 
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
            value: 'fecha' 
          },
          { text: 'Cuota',
            align: 'start',
            sortable: true, 
            value: 'cuota' 
          },
          { text: 'Oficina',
            align: 'start',
            sortable: true, 
            value: 'oficina' 
          },
          { text: 'Valor Cuota',
            align: 'start',
            sortable: true, 
            value: 'valorCuota' 
          },
          { text: 'Capital',
            align: 'start',
            sortable: true, 
            value: 'capital' 
          },
          { text: 'Saldo',
            align: 'start',
            sortable: true, 
            value: 'saldo' 
          },
        ],

        cabeceras4: [
          {
            text: 'N° Crédito',
            align: 'start',
            sortable: true,
            value: 'numCredito',
          },
          { text: 'Producto',
            align: 'start',
            sortable: true, 
            value: 'producto' 
          },
          
          { text: 'Forma de pago',
            align: 'start',
            sortable: true, 
            value: 'pago' 
          },
          { text: 'Estado',
            align: 'start',
            sortable: true, 
            value: 'estado' 
          },
          { text: 'Rut Aval',
            align: 'start',
            sortable: true, 
            value: 'rut' 
          },
          
          { text: 'Fecha',
            align: 'start',
            sortable: true, 
            value: 'fecha' 
          },
          { text: 'Cuota',
            align: 'start',
            sortable: true, 
            value: 'cuota' 
          },
          { text: 'Oficina',
            align: 'start',
            sortable: true, 
            value: 'oficina' 
          },
          { text: 'Valor Cuota',
            align: 'start',
            sortable: true, 
            value: 'valorCuota' 
          },
          { text: 'Capital',
            align: 'start',
            sortable: true, 
            value: 'capital' 
          },
          { text: 'Saldo',
            align: 'start',
            sortable: true, 
            value: 'saldo' 
          },
        ],

        creditos: [],

        cuotasMorosas: [],

        creditosAvalados: [],

        /*avalesVigentes: [{
          numCredito: 1234,
          producto: '603 - Crédito de Consumo', 
          pago: 'Efectivo',
          estado: 'Vig.',
          rut: '11.111.111-1',
          fecha: '16/04/2022',
          cuota:'10',
          oficina:'CASA MATRIZ',
          valorCuota: 32819,
          capital: 59201,
          saldo: 1801232,
        }],*/
        avalesVigentes:[],
      }
    },
    methods:{
      async getSocioCredito(){
        await socio.getCreditos(this.userLogged.id_cliente)
          .then(response => {
            console.log(response.data[0]);
            this.creditos = response.data;            
          })
          .catch(error => console.log(error));
      },
      async getDetalleCreditos(accion){
        await socio.getDetalleCreditos(this.userLogged.id_cliente, accion)
          .then(response => {
            if(accion === 2)
              this.cuotasMorosas = response.data
            else if(accion === 3)
              this.creditos = response.data.filter( credito => credito.credito !== "0")
            
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
      }
    },
    mounted(){
      this.getDetalleCreditos(3);
      this.getDetalleCreditos(2);
    },
    computed:{
      userLogged() {
          return auth.getUserLogged();
        },
      },
    
}
</script>