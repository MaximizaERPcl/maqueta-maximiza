<template>
    <v-container class="py-0" v-if="pagos">
      <v-row
      justify="center"
      no-gutters
      >
        <v-col
        cols="11"> 
        <v-card
          elevation="10"
        >
            <v-toolbar
              color="primary"
              dark
              
              flat
              tile
              class="mb-4 primaryGradient"
            >
              <v-toolbar-title class="flex text-center titulo">Pago de productos</v-toolbar-title>
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
                <div>suma:{{suma}}</div>
              <v-data-table 
                v-model="selected"
                :headers="cabeceras2"
                :items="indexedItems"
                class="mx-4 mb-2 elevation-1"
                group-by="credito"
                calculate-widths
                show-group-by
                show-select
                @item-selected="seleccionItem"
                
              >
              <template v-slot:group.header="{group}">
                <td  colspan="7" style="font-weight: 400">
                  <v-icon left color="primary">mdi-credit-card</v-icon>
                  Crédito {{group}}
                </td>

              </template>
                <!--template
                  v-slot:item.saldo="{ item }"
                >
                  {{ conv.formatMonto(item.saldo,true) }}
                </template>
                <template
                  v-slot:item.monto="{ item }"
                >
                  {{ conv.formatMonto(item.monto,true) }}
                </template-->
  
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
              </v-container>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  <script>
  import data from './data.json'

  export default {
    data() {
      return {
        pagos: data,
        suma:0,
        selected:[],
        cabeceras2: [
          {
            text: 'Credito',
            align: 'start',
            sortable: true,
            groupable: true,
            value: 'credito',
          },
          { text: 'Producto',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'producto' 
          },
          { text: 'Cuota',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'cuota' 
          },
          { text: 'Nº Cuota',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'n_cuota' 
          },
          { text: 'Estado',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'estado_cuota' 
          },
          { text: 'Vencimiento',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'vencimiento' 
          },
          { text: 'Monto',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'monto' 
          },
        ],
      colorCabeceras:'secondary',
      ctaCapital: [],

      detalleCta: [],
      cuenta_capital:{},
      noDatos: false,
      msg:'NO POSEE CUENTAS CAPITALES ASOCIADAS',
      loading: false,
      userLogged:null
          }
      },
      methods: {
        seleccionItem({value, item}) {
          this.selected.push(item)
          if(value){
            let items = this.indexedItems
            console.log(items)
            let filtrado = items.filter( pago => 
              pago.id != item.id &&
              pago.credito === item.credito && 
              parseInt(pago.n_cuota) < parseInt(item.n_cuota)
            )
            this.selected = this.selected.concat(filtrado)
          }
          else{ //Está borrando incluso los que no son del mismo credito, revisar o.o
            console.log(this.selected)
            this.selected = this.selected.filter(pago => 
              pago.id != item.id &&
              pago.credito === item.credito &&
              parseInt(pago.n_cuota) < parseInt(item.n_cuota))
          }
        }
      },
      computed: {
        indexedItems () {
          return this.pagos.credito.map((item, index) => ({
            id: index,
            ...item
          }))
        }
      },
      watch: {
        selected(newValue, oldValue) {
          let tempSuma = 0 ;
          this.selected.forEach(item => {
            tempSuma += parseInt(item.monto)
          });
          this.suma = tempSuma;
        }
      },
  };
  </script>
  <style>
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

}
  </style>