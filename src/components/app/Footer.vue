<template>
  <v-container>
    <v-footer
      color="indigo darken-1"
      padless
      app 
      inset
      :fixed="false"
    >
      
      <v-row
        justify="space-around"
        no-gutters
      >
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          text
          small
          rounded
          class="my-1"
          style="pointer-events:none"
        >
          {{ link }}
        </v-btn>
        <v-col
          class="indigo darken-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} - Copyright: <strong> Maximiza.cl</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>


<script>
  export default {
    data: () => ({
      links: [
        'contacto@maximiza.cl',
        'Casa Matriz: Cerro Colorado #5870 Oficina 110 Las Condes',
        '+560229536459',

      ],
    }),
  }
</script>