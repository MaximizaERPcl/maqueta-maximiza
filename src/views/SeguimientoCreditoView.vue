<template>
  <div>
    <app-seguimiento />
  </div>
</template>

<script>
import SeguimientoVue from "@/components/seguimientoCredito/SeguimientoCredito.vue";
export default {
  metaInfo: { title: "Seguimiento Crédito" },
  components: {
    "app-seguimiento": SeguimientoVue,
  },
  data() {
    return {};
  },
};
</script>
