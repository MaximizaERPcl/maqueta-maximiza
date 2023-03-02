<template>
  <v-row class="fill-height" align-content="center" justify="center">
    <v-col class="text-subtitle-1 text-center" cols="12">
      Cargando Documentos
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
</template>
<script>
export default {
  data() {
    return {
      //
    };
  },
};
</script>
