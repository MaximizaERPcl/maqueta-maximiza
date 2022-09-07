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
        :rules="[v => !!v || 'Campo es requerido', v => ValidaRut(v) || 'El rut no es válido']"
        v-mask="formatRut"
        required
        outlined
        >
        <template v-slot:prepend>        
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
        outlined
        :rules="[value => !!value || 'Campo Requerido.']"
        :append-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
        :type="mostrar ? 'text' : 'password'"
        @click:append="mostrar = !mostrar"
      >
        <template v-slot:prepend>        
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
          formatRut,
          alert:false,
          alertMsg:"",
          rut: "",
          password: "",
          mostrar: false,
          valid: true,
        };
    },
    computed: {
      ...mapState(["rutaActual","snackbar"]),
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
        await auth.login(cleanRut(this.rut,true), this.password)
        .then(response => {
          let data = response.data[0];
          if(data.codigo == 1){
            auth.setUserLogged(data);
            this.$router.push("/maximiza/ingresa");
          }else{
            let payload = {
              mensaje: data.msg,
              color: 'error',
              mostrar: true,
            }
          this.mostrarAlerta(payload)
          }
        })
        .catch(error => {
          console.log(error)
        })
      },
      ValidaRut(cRut) {
        if (typeof(cRut) != "undefined") {
          cRut = cRut.replace(/[\.-]/g, "");
          cRut = cRut.toUpperCase();
          var patt = /^\d{1,8}[0-9K]$/;
          var ok = patt.test(cRut);
          var cStr = cRut.slice(0, -1);
          var cDig = cRut.slice(-1);
          var nSum = 0;
          var nVal = 0;
          var cVal = "";
          var nMul = 0;
          if (ok) {
            for (nMul = 2; cStr != ""; nMul = (nMul == 7) ? 2 : nMul + 1) {
              nSum += Number(cStr.slice(-1)) * nMul;
              cStr = cStr.slice(0, -1);
            }
            nVal = 11 - (nSum % 11);
            switch (nVal) {
              case 11:
                cVal = "0";
                break;
              case 10:
                cVal = "K";
                break;
              default:
                cVal = nVal.toString();
              }
            ok = cVal == cDig;
          }
          return ok;
        }
      },
    },
}
</script>