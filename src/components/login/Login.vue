<template>
  <v-container>
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
        placeholder="Ingrese su rut"
        :rules="[v => !!v || 'Campo es requerido', v => (!!v && validarRut(v)) || 'El rut no es válido']"
        v-mask="formatRut"
        required
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
        v-model="password"
        label="Clave"
        placeholder="Ingrese"
        required
        :rules="[value => !!value || 'Campo Requerido.']"
        :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
        :type="mostrar ? 'text' : 'password'"
        @click:append="mostrar = !mostrar"
        filled
        rounded
        background-color="rgba(255, 255, 255, 0.6)"
      >
        <template v-slot:prepend-inner>        
          <v-icon left color="primary"> mdi-lock </v-icon> 
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
            :loading="loading"
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

import { mapState, mapActions } from 'vuex';
import { formatterRut, cleanRut,validateRut } from 'chilean-formatter';

export default {
    components: {
      //
    },
    data: function () {
        return {
          rut: "",
          password: "",
          mostrar: false,
          valid: true,
          loading:false,
        };
    },
    computed: {
      ...mapState(["rutaActual","snackbar"]),
      formatRut(){
        if(this.rut)
          return formatterRut(this.rut)
      }
    },
    methods:{
      ...mapActions(["mostrarAlerta","cerrarAlerta"]),
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.login()
      }
        
      },
      async login(){
        this.loading = true;
        await auth.login(cleanRut(this.rut,true), this.password)
        .then(async response => {
          let data = response.data[0];
          let payload = {};

          if(data.codigo == 1){
            let id_cliente = data.rut.split('-')[0];
            await auth.userInfo(id_cliente)
            .then(async response => {
              data.info = response.data[0];
            })
            .catch(error => console.log(error));

            await auth.setUserLogged(data);
            this.$router.push("/maximiza/ingresa");
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
          this.mostrarAlerta(payload)
        })
        .catch(error => {
          console.log(error)
        })
      },
      validarRut(rut) {
        if(rut)
          return validateRut(rut);
      },
    },
}
</script>
<style scoped lang="css">
  .transparente{
    background-color: transparent;
  }
  .test{
    background-color: rgba(255, 255, 255, 0.68);
  }
  input:-internal-autofill-selected {
    background-image: none !important;
}
</style>