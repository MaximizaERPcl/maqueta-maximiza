<template>
    <div>
      <app-cuenta-capital v-if="productoActual === 'cuenta-capital'"></app-cuenta-capital>    
      <app-remanentes v-else-if="productoActual === 'remanentes'"></app-remanentes>    
      <app-dap v-else-if="productoActual === 'dap'"></app-dap>    
      <app-creditos v-else-if="productoActual === 'creditos'"></app-creditos>    
      <app-pagos v-else-if="productoActual === 'proximos-pagos'"></app-pagos>    
      <app-firma v-else-if="productoActual === 'firma'"></app-firma>    
      <app-cuenta-ahorro v-else-if="productoActual === 'cuenta-ahorro'"></app-cuenta-ahorro>    
    </div>
</template>

<script>
import { mapState } from 'vuex'
import CuentaCapitalVue from '@/components/productos/CuentaCapital.vue';
import CreditosVue from '@/components/productos/Creditos.vue';
import DapVue from '@/components/productos/Dap.vue';
import FirmaVue from '@/components/productos/Firma.vue';
import PagosVue from '@/components/productos/Pagos.vue';
import RemanentesVue from '@/components/productos/Remanentes.vue';
import CuentaAhorroVue from '@/components/productos/CuentaAhorro.vue';

export default {
    data: function() {
      return {
        productoActual:''
      }
    },
    components: {

    'app-cuenta-capital': CuentaCapitalVue,
    'app-creditos': CreditosVue,
    'app-dap': DapVue,
    'app-firma': FirmaVue,
    'app-pagos': PagosVue,
    'app-remanentes': RemanentesVue,
    'app-cuenta-ahorro': CuentaAhorroVue,

  },

    computed:{
        ...mapState(['productosNav'])
    },

    beforeMount(){
      this.productoActual = this.$route.params.product;
    },
    watch: {
    "$route.params.product"(value) {
      this.productoActual = value;
    }
  }
}
</script>