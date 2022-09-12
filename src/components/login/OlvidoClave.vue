<template>
<v-container>
  <v-form
    class="mt-5"
    ref="form"
    v-model="valid"
  >
    <v-row justify="center" no-gutters>
    
      <v-col
        cols="12"
        sm="10"
        md="8"
        >
        <v-text-field
          v-model="rut"
          v-mask="formatRut"
          label="Rut"
          ref="rut"
          placeholder="11111111-1"
          required
          filled
          background-color="rgba(255, 255, 255, 0.6)"
          rounded
          :rules="[v => !!v || 'Campo es requerido', 
                  v =>(!!v && validarRut(v)) || 'El rut no es válido']"
        >
        <template v-slot:prepend-inner>        
          <v-icon left color="primary"> mdi-account </v-icon> 
        </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        sm="10"
        md="8"
        class="d-flex justify-end"
      >
        <v-btn
          color="primary"
          @click="validate()"
          :loading="loading"
          large
        >
        <v-icon left >mdi-send</v-icon>
          Enviar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</v-container>
</template>

<script>
import auth from "@/auth/auth";
import { formatterRut, cleanRut,validateRut } from 'chilean-formatter';
import { mapActions } from "vuex";

/*export function formatRut(value) {
  return [...formatterRut(value)]
}*/
export default {
    data: function () {
        return {
          rut: "",
          mostrar: false,
          valid: true,
          loading: false,
        };
    },
    computed: {
      formatRut(){
        if(this.rut)
          return formatterRut(this.rut)
      }
    },
    methods:{
      ...mapActions(["mostrarAlerta"]),
      validate () {
        this.$refs.form.validate();
        if(this.valid){
          this.recuperarClave();
        }
      },        
      async recuperarClave(){
        await auth.generarClave(cleanRut(this.rut),'','')
        .then(response => {
          let data = response.data[0];
          let payload = {};
          this.loading = true;

          if(data.error_codigo == 0){
            payload = {
              mensaje: data.msg,
              color: 'success',
              mostrar: true,
            }
          }else{
            payload = {
              mensaje: data.msg,
              color: 'error',
              mostrar: true,
            }
          }
          this.loading = false;
          this.mostrarAlerta(payload);
          this.$refs.form.reset();
        })
        .catch(error => {
          console.log(error)
        })
      },
      validarRut(rut){
        return validateRut(rut);
      }
    },
}
</script>