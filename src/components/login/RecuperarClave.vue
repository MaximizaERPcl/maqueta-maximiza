<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-alert
          text
          outlined
          class="text-center mb-8 alerta"
        >
        Recuerde que solo se permiten <b>números</b> y su clave debe tener <b>6 dígitos</b>.
        </v-alert>
      </v-col>
    </v-row>
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
            id="ver_code"
            v-model="form.codigo"
            label="Código de verificación"
            placeholder="Ingrese su código de verificación"
            required
            :rules="[reglas.required]"
            filled
            background-color="rgba(255, 255, 255, 0.6)"
            rounded
          >
          <template v-slot:prepend-inner>        
            <v-icon left color="primary"> mdi-barcode </v-icon> 
          </template>
          </v-text-field>
          </v-col>
          <v-col
          cols="12"
          sm="10"
          md="8"
          >
          <v-text-field
            id="new_pass"
            v-model="form.clave_nueva"
            label="Nueva Contraseña"
            placeholder="Ingrese su nueva contraseña"
            required
            filled
            background-color="rgba(255, 255, 255, 0.6)"
            rounded
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
          <template v-slot:prepend-inner>        
            <v-icon left color="primary"> mdi-lock </v-icon> 
          </template>
          </v-text-field>
          </v-col>
          <v-col
          cols="12"
          sm="10"
          md="8"
          >
          <v-text-field
            id="new_pass_repeat"
            v-model="form.repetir_clave"
            label="Repetir Contraseña"
            placeholder="Ingrese nuevamente su contraseña"
            required
            filled
            background-color="rgba(255, 255, 255, 0.6)"
            rounded
            persistent-hint
            :rules="[
              v => !!v || 'Campo requerido',
              v => v === form.clave_nueva || 'Las claves ingresadas no coinciden',
            ]"
            :append-icon="mostrar2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="mostrar2 ? 'text' : 'password'"
            @click:append="mostrar2 = !mostrar2"
          >
            <template v-slot:prepend-inner>        
              <v-icon left color="primary"> mdi-lock-alert </v-icon> 
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
              Crear Contraseña
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
    
<script>
  import auth from "@/auth/auth";
  import { mapActions } from "vuex";
  
  export default {
    data: function () {
      return {
        id_cliente:"",
        form: {
          codigo:'',
          clave_nueva:'',
          repetir_clave:''          
        },
        valid: true,
        reglas: {
          required: value => !!value || 'Campo Requerido.',
        },
        loading: false,
        mostrar1: false,
        mostrar2: false,
      };
    },
    computed: {
      //
    },
    methods:{
      ...mapActions(["mostrarAlerta","cerrarAlerta"]),
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.cambiarClave()
        }
        
      },
      async cambiarClave(){
        await auth.cambiarClave(this.id_cliente ,this.form.codigo, this.form.clave_nueva,1)
        .then(response => {
          let data = response.data[0];
          let payload = {};
          this.loading = true;


          if(data.error_codigo == 1){
            this.$router.push("/maximiza_vue/");
            payload = {
              mensaje: data.msg,
              color: 'success',
              mostrar: true,
            }
          }
          else{
            payload = {
              mensaje: data.msg,
              color: 'error',
              mostrar: true,
            }
          }
          this.loading = false;
          this.mostrarAlerta(payload);
          

        })
        .catch(error => {
          console.log(error)
        })
      },
      validarRut(rut){
        return validateRut(rut);
      }
    },
      mounted(){
        this.id_cliente = this.$route.params.id_cliente;
      }, 
      /*watch: {
        "$route.params.id_cliente"(value) {
          console.log(value)
          this.id_cliente = value;
        }
      }*/
  }
</script>
<style scoped lang="css">
.alerta{
  font-size: 18px; 
  color: #4CAF50;
  background:rgba(255, 255, 255, 0.692) !important;
}


</style>