<template>
  <v-container class="py-0">
    <v-row
    justify="center"
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
            dense
            tile
            class="mb-4"

          >
            <v-toolbar-title class="flex text-center titulo">Cuotas de Crédito</v-toolbar-title>
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
              :headers="cabeceras"
              :items="pagos"
              disable-pagination
              disable-sort
              disable-filtering
              hide-default-footer	

            >
              <template
                v-slot:item.mes1="{ item }"
              >
                {{ conv.formatMonto(item.mes1,true) }}
              </template>
              <template
                v-slot:item.mes2="{ item }"
              >
                {{ conv.formatMonto(item.mes2,true) }}
              </template>
              <template
                v-slot:item.mes3="{ item }"
              >
                {{ conv.formatMonto(item.mes3,true) }}
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
                  <span>Ver Detalle</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-divider></v-divider>
            <v-col cols="3" v-for="item in pactado">
              <v-card
                outlined
                
              >
                <v-simple-table >
                  <template v-slot:default>
                    <tbody>
                      <tr
                      >
                        <td style="background-color:#4285f4; color:white">{{item.nombre}}</td>
                        <td> {{conv.formatMonto(item.monto, true)}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col> 
          </v-container>
        </div>    
      </v-card>
    </v-col>
  </v-row>
  </v-container>
</template>

<script>
import auth from '@/auth/auth';
import socio from '@/services/socio';
import NoDataVue from '../app/NoData.vue';
import conv from '@/services/conversores';

export default {
  components: {
      'app-no-datos': NoDataVue,
  },
  data: function() {
    return {
      cabeceras: [
        { text: '',
          align: 'start',
          sortable: true, 
          value: 'mes1' 
        },
        {
          text: '',
          align: 'start',
          sortable: true,
          value: 'mes2',
        },
        { text: '',
          align: 'start',
          sortable: true, 
          value: 'mes3' 
        },
      ],
      pagos:[{mes1:0,mes2:0,mes3:0}],
      items: [],
      pactado: [],
      noDatos: false,
      msg:'NO SE ENCONTRARON PRÓXIMOS PAGOS',
      loading: true
    }
  },
   methods:{
    async getProximosPagos(){
      await socio.getProximosPagos(this.userLogged.id_cliente,2)
      .then(response => {
          let items = response.data[0];
          let suma = 0;
          var i = 0;

          for (const property in items) {
            if(i<3){
              this.cabeceras[i].text = property;
              let mes = 'mes'+(i+1)
              let valor = parseInt(parseFloat(items[property]));
              this.pagos[0][mes] = valor;
              suma =+ valor;
            }
            else{
              let monto = parseInt(parseFloat(items[property]));
              this.pactado.push({nombre:property, monto:monto});
            }
            i++;
          }
          if(suma == 0)
            this.noDatos = true;
          else
            this.noDatos = false;
      })
      .catch(error => console.log(error));
    },
    getPagosCercanos() { //No se usa, pero la dejo porque le puse empeño :(, filtra por un rango de fechas
      const hoy = new Date(Date.now())
      const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre', 'Noviembre','Diciembre']; 
      const mes1 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      const mes2 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      const mes3 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      
      this.cabeceras[0].text = meses[mes1.getMonth()];
      this.cabeceras[1].text = meses[mes2.getMonth()];
      this.cabeceras[2].text = meses[mes3.getMonth()];

      const start = new Date(mes1.getFullYear(), mes1.getMonth(), 1);
      const end = new Date(mes3.getFullYear(), mes3.getMonth()+1, 0);

      var pagosFiltrados = this.items.filter(item => {
        var dateParts = item.fecha_venc.split("/");
        var date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
        return date >= start && date <= end;
      })
      this.pagos[0].mes1 = parseInt(pagosFiltrados[0].valor_cuota);
      this.pagos[0].mes2 = parseInt(pagosFiltrados[1].valor_cuota);
      this.pagos[0].mes3 = parseInt(pagosFiltrados[2].valor_cuota);


    },
  },
  computed:{
    userLogged() {
        return auth.getUserLogged();
      },
    conv(){
      return conv;
    }
  },
  async mounted(){
    //this.getSocioCredito()
    this.loading = true;
    await this.getProximosPagos();
    this.loading = false;
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
  
  }
  </style>