<template>
  <div>
    <app-pago-web />
  </div>
</template>
<script>
import PagoWeb from "@/components/pago/PagoWeb.vue";

export default {
  metaInfo: { title: "Pago Web" },
  data() {
    return {};
  },
  components: {
    "app-pago-web": PagoWeb,
  },
};
</script>
<style></style>
