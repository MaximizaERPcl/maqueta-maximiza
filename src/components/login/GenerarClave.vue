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
          label="Rut"
          placeholder="Ingrese su rut"
          required
          v-mask="formatRut"
          :rules="[v => !!v || 'Campo es requerido', v => validarRut(v) || 'El rut no es válido']"
          filled
          background-color="rgba(255, 255, 255, 0.6)"
          rounded
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
        >
        <v-text-field
          v-model="correo"
          label="Correo"
          placeholder="Ingrese su correo"
          required
          filled
          background-color="rgba(255, 255, 255, 0.6)"
          rounded
          :rules="[reglas.required, reglas.email]"
        >
        <template v-slot:prepend-inner>        
          <v-icon left color="primary"> mdi-email </v-icon> 
        </template>
        </v-text-field>
        </v-col>
        <v-col
        cols="12"
        sm="10"
        md="8"
        >
        <v-text-field
          v-model="telefono"
          label="Celular/Teléfono"
          placeholder="998876655"
          v-mask="'#########'"
          required
          filled
          background-color="rgba(255, 255, 255, 0.6)"
          rounded
          :rules="[
              v => !!v || 'Campo es requerido',
              v => (!!v && v.length === 9) || 'Ingrese un número válido',
              v => Number.isInteger(Number(v)) || 'Ingrese un número válido',
            ]"
        >
          <template v-slot:prepend-inner>        
            <v-icon left color="primary"> mdi-phone </v-icon> 
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
            large
            :loading="loading"
            @click="validate()"
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
import { formatterRut, cleanRut, validateRut } from 'chilean-formatter';
import { mapActions } from "vuex";

export default {
    data: function () {
        return {
          rut: "",
          correo: "",
          telefono: "",
          valid: true,
          reglas: {
            required: value => !!value || 'Campo Requerido.',
            email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Ingrese un correo válido.'
            },
          },
          loading: false
        };
    },
    computed: {
      formatRut(){
        if(this.rut)
          return formatterRut(this.rut);
      }
    },
    methods:{
      ...mapActions(["mostrarAlerta","cerrarAlerta"]),
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.generarClave();
        }
        
      },
      async generarClave(){
        await auth.generarClave(cleanRut(this.rut), this.correo, this.telefono)
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
          this.$refs.form.reset();
          this.mostrarAlerta(payload);
        })
        .catch(error => {
          console.log(error)
        })
      },
      validarRut(rut){
        if(rut)
          return validateRut(rut);
      }
    },
}
</script>