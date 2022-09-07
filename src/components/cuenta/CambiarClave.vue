<template>
<v-container>
    <v-row
      justify="center">
      <v-col
        cols="11"
        sm="11"
        md="7 "

      >
      <v-card 
        outlined 
        class="elevation-2 pb-8">
        <v-toolbar
            color="primary"
            dark
            flat
            class="mb-8"
            tile
            
          >
            <v-toolbar-title class="flex text-center titulo">Cambio de clave</v-toolbar-title>
          </v-toolbar>
          <v-row justify="center">
            <v-col cols="10">
              <v-alert
                text
                outlined
                color="success"
                style="font-size: 18px"
                class="text-center mb-8"
              >
              Recuerde que solo se permiten <b>números</b> y su clave debe tener <b>6 dígitos</b>.
              </v-alert>
            </v-col>
          </v-row>
        <v-form
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
              v-model="form.clave_anterior"
              label="Clave Anterior"
              outlined
              required
              persistent-hint
              :rules="[
                v => !!v || 'Campo requerido',
              ]"
              :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
              :type="mostrar ? 'text' : 'password'"
              @click:append="mostrar = !mostrar"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-lock-outline </v-icon> 
              </template>
            </v-text-field>
          </v-col>
          <v-col 
            cols="12"
            sm="10"
            md="8"
          >
            <v-text-field
              v-model="form.clave_nueva"
              label="Nueva Clave"
              :counter="6"
              outlined
              required
              persistent-hint
              :rules="[
                v => !!v || 'Campo requerido',
                v => v.length == 6 || 'La clave debe tener 6 dígitos',
                v => Number.isInteger(Number(v)) || 'La clave solo debe contener dígitos',
              ]"
              :append-icon="mostrar1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="mostrar1 ? 'text' : 'password'"
              @click:append="mostrar1 = !mostrar1"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-lock-alert-outline </v-icon> 
              </template>
            </v-text-field>
          </v-col>
          <v-col 
            cols="12"
            sm="10"
            md="8"
          >
            <v-text-field
              v-model="form.repetir_clave"
              label="Repetir Nueva Clave"
              outlined
              required
              persistent-hint
              :rules="[
                v => !!v || 'Campo requerido',
                v => v === form.clave_nueva || 'Las claves ingresadas no coinciden',
              ]"
              :append-icon="mostrar2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="mostrar2 ? 'text' : 'password'"
              @click:append="mostrar2 = !mostrar2"
            >
              <template v-slot:prepend>        
                <v-icon left color="primary"> mdi-lock-plus-outline </v-icon> 
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
                large
                color="primary"
                @click="validate()"
                :disabled="!valid"
              >
              <v-icon left >mdi-lock-check-outline</v-icon>
              Cambiar Clave
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
      </v-col>
    </v-row>
</v-container>
</template>

<script>
import auth from "@/auth/auth";

import { mapState } from 'vuex';
import { formatterRut, cleanRut } from 'chilean-formatter';

export function formatRut(value) {
  return [...formatterRut(value)]
}

export default {
    components: {
      //
    },
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          form: {
            clave_anterior:'',
            clave_nueva:'',
            repetir_clave:''          
            },
          mostrar: false,
          mostrar1: false,
          mostrar2: false,
          valid: true,
        };
    },
    computed: {
      ...mapState(["rutaActual"]),
      userLogged() {
        return auth.getUserLogged();
      },
    },
    methods:{
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.login()
      }
        
      },
      async cambiarClave(){
        await auth.cambiarClave(this.userLogged.rut,this.form.clave_anterior, this.form.clave_nueva)
        .then(response => {
          let data = response.data[0];
          console.log('funciona')
        })
        .catch(error => {
          console.log(error)
        })
      },
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
  word-break:normal;

}
</style>