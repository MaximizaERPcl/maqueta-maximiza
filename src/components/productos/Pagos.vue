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
          >
            <v-toolbar-title class="flex text-center">Cuotas de Crédito</v-toolbar-title>
          </v-toolbar>

          <v-data-table 
            :headers="cabeceras1"
            :items="pagos"
            disable-pagination
            disable-sort
            disable-filtering
            hide-default-footer	

          >
            <template
              v-slot:item.mes1="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.mes1) }}
            </template>
            <template
              v-slot:item.mes2="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.mes2) }}
            </template>
            <template
              v-slot:item.mes3="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.mes3) }}
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
          <v-col cols="3">
            <v-card
              outlined
            >
              <v-simple-table>
                <template v-slot:default>
                  <!--thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Calories
                      </th>
                    </tr>
                  </thead-->
                  <tbody>
                    <tr
                    >
                      <td style="background-color:#4285f4; color:white">Capital Pactado</td>
                      <td> {{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(15000)}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col> 
          <v-col cols="3">
            <v-card
              outlined
            >
              <v-simple-table>
                <template v-slot:default>
                  <!--thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Calories
                      </th>
                    </tr>
                  </thead-->
                  <tbody>
                    <tr
                    >
                      <td style="background-color:#4285f4; color:white">Ahorro Pactado</td>
                      <td> {{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(15000)}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col> 
          
      </v-card>
    </v-col>
  </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import auth from '@/auth/auth';
import socio from '@/services/socio';

export default {
  data: function() {
    return {
      cabeceras1: [
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
      meses: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre', 'Noviembre','Diciembre'],
      items: []
    }
  },
   methods:{
    async getSocioCredito(){
      await socio.getCreditos(this.userLogged.id_cliente)
        .then(response => {
          let credito = response.data[0];
          this.getProximoPago(credito.credito)
          
        })
        .catch(error => console.log(error));
    },
    async getProximoPago(id_credito){
      await socio.getProximoPago(id_credito)
      .then(response => {
        this.items = response.data;
        this.getPagosCercanos()
      })
      .catch(error => console.log(error));
    },
    getPagosCercanos() {
      const hoy = new Date(Date.now())
      const mes1 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      const mes2 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      const mes3 = new Date (hoy.setMonth( hoy.getMonth() + 1 ));
      
      this.cabeceras1[0].text = this.meses[mes1.getMonth()];
      this.cabeceras1[1].text = this.meses[mes2.getMonth()];
      this.cabeceras1[2].text = this.meses[mes3.getMonth()];

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
    ...mapState(['rutaActual']),
  userLogged() {
      return auth.getUserLogged();
    },
  },
  mounted(){
    this.getSocioCredito()
    //this.getProximoPago()
  },

  
}
</script>