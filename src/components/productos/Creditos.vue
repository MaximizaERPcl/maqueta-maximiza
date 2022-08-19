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
            
          >
            <v-toolbar-title class="flex text-center">Créditos</v-toolbar-title>
          </v-toolbar>
          <v-data-table 
            :headers="cabeceras1"
            :items="creditos"
            class="mx-4 mb-2 elevation-1"
          >
            <template
              v-slot:item.valorCuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valorCuota) }}
            </template>
            <template
              v-slot:item.saldoIns="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldoIns) }}
            </template>
            <template
              v-slot:item.montoCapOtor="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.montoCapOtor) }}
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
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(62321)}}</b></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(121917)}}</b></td>
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(1801232)}}</b></td>
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
              v-slot:item.valorCuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.valorCuota) }}
            </template>
            <template
              v-slot:item.mora="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.mora) }}
            </template>
            <template
              v-slot:item.gastoCobranza="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.gastoCobranza) }}
            </template>
            <template
              v-slot:item.scuota="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.scuota) }}
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
                <td><b>{{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(62321)}}</b></td>
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
export default {
    data: function() {
      return {
        cabeceras1: [
          {
            text: 'N°',
            align: 'start',
            sortable: true,
            value: 'num',
          },
          { text: 'Tipo de crédito',
            align: 'start',
            sortable: true, 
            value: 'tipo' 
          },
          { text: 'Cuotas',
            align: 'start',
            sortable: true, 
            value: 'cuotas' 
          },
          { text: 'Valor Cuota',
            align: 'start',
            sortable: true, 
            value: 'valorCuota' 
          },
          { text: 'Fecha de vencimiento',
            align: 'start',
            sortable: true, 
            value: 'fechVenc' 
          },
          { text: 'Fecha de otorgamiento',
            align: 'start',
            sortable: true, 
            value: 'fechOtorg' 
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
            value: 'pago' 
          },
          { text: 'Saldo insoluto',
            align: 'start',
            sortable: true, 
            value: 'saldoIns' 
          },
          { text: 'Monto Capital Otorgado',
            align: 'start',
            sortable: true, 
            value: 'montoCapOtor' 
          },
          { text: '', value: 'actions', sortable: false },
          ],

          cabeceras2: [
          { text: 'Tipo de crédito',
            align: 'start',
            sortable: true, 
            value: 'tipo' 
          },
          {
            text: 'Cuota N°',
            align: 'start',
            sortable: true,
            value: 'numCuota',
          },
          { text: 'Fecha de vencimiento',
            align: 'start',
            sortable: true, 
            value: 'fechVenc' 
          },
          { text: 'Dias de atraso',
            align: 'start',
            sortable: true, 
            value: 'diasAtraso' 
          },
          { text: 'Valor Cuota',
            align: 'start',
            sortable: true, 
            value: 'valorCuota' 
          },
          
          { text: 'Mora',
            align: 'start',
            sortable: true, 
            value: 'mora' 
          },
          { text: 'Gasto Cobranza',
            align: 'start',
            sortable: true, 
            value: 'gastoCobranza' 
          },
          { text: 'I.Pro',
            align: 'start',
            sortable: true, 
            value: 'ipro' 
          },
          { text: 'Abonado',
            align: 'start',
            sortable: true, 
            value: 'abonado' 
          },
          { text: 'S.cuota',
            align: 'start',
            sortable: true, 
            value: 'scuota' 
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

        creditos: [{
          num: 8538,
          tipo: '603 - Crédito de Consumo', 
          cuotas: '47/48',
          valorCuota: 62321,
          fechVenc: '16/04/2022',
          fechOtorg: '31/08/2017',
          estado: 'Vig.',
          tasa:'2,3',
          pago:'DxP',
          saldoIns: 121917,
          montoCapOtor: 1801232
        }],

        cuotasMorosas: [{
          tipo: '603 - Crédito de Consumo',
          numCuota: 47,
          fechVenc: '16/04/2022',
          diasAtraso: 124,
          valorCuota: 62321,
          mora: 6723,
          gastoCobranza:5609,
          ipro:'.0000',
          abonado: 121917,
          scuota:74653,
          acumulado: 74653
        },
        {
          tipo: '603 - Crédito de Consumo',
          numCuota: 48,
          fechVenc: '16/05/2022',
          diasAtraso: 94,
          valorCuota: 62321,
          mora: 5097,
          gastoCobranza:5609,
          ipro:'.0000',
          abonado: 121917,
          scuota:73027,
          acumulado: 147680
        }],

        creditosAvalados: [{
          numCredito: 1234,
          producto: '603 - Crédito de Consumo', 
          pago: 'Efectivo',
          estado: 'Vig.',
          rut: '11.111.111-1',
          nombre: 'Percy Jackson',
          fecha: '16/04/2022',
          cuota:'10',
          oficina:'xxx',
          valorCuota: 32819,
          capital: 59201,
          saldo: 1801232,
        }],

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
    mounted(){
      console.log(this.avalesVigentes)
      console.log(this.avalesVigentes.length)
    }
    
}
</script>