<template>
<v-container>
  <v-snackbar
      :timeout="4000"
      :value="alert"
      absolute
      centered
      top
      color="error"
      elevation="20"
    >
    <v-icon left>mdi-alert-circle</v-icon>
      {{alertMsg}}
    <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="alert = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  <v-form
    ref="form"
    v-model="valid"
    class="mt-5"
    @keyup.native.enter="validate()"

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
      placeholder="11111111-1"
      required
      outlined
      :rules="[value => !!value || 'Campo Requerido.']"
      ></v-text-field>
    </v-col>
    <v-col
      cols="12"
      sm="10"
      md="8"
    >
      <v-text-field
      v-model="password"
      label="Clave"
      placeholder="Ingrese"
      required
      outlined
      :rules="[value => !!value || 'Campo Requerido.']"
      :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
      :type="mostrar ? 'text' : 'password'"
      @click:append="mostrar = !mostrar"
      
        ></v-text-field>
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
          >
          <v-icon left >mdi-login</v-icon>
          Ingresar
          </v-btn>
      </v-col>
      </v-row>
  </v-form>
</v-container>  
</template>

<script>
import auth from "@/auth/auth";

import { mapState } from 'vuex';

export default {
    components: {
      //
    },
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          rut: "",
          password: "",
          mostrar: false,
          valid: true,
        };
    },
    computed: {
      ...mapState(["rutaActual"]),
    },
    methods:{
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.login()
      }
        
      },
      async login(){
        await auth.login(this.rut, this.password)
        .then(response => {
          let data = response.data[0];
          if(data.codigo == 1){
            auth.setUserLogged(data);
            this.$router.push("/maximiza/ingresa");
          }else{
            this.alert = true
            this.alertMsg = data.msg
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
}
</script>