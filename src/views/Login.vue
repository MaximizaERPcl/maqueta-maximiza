<template>
<v-container fill-height fluid style="height:100%; background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
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
  <v-container fill-height fluid>
    <v-row 
      align="center"
      justify="center">
      <v-col cols="5">
      <v-card class="pb-6 elevation-4">
        <v-tabs 
          fixed-tabs
          icons-and-text
          v-model="tab"
        >
          <v-tab>
            Ingresar
            <v-icon>mdi-account</v-icon>
          </v-tab>
          <v-tab>
            Generar Clave
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab>
            Olvidé Mi Clave
            <v-icon>mdi-account-alert</v-icon>
            </v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-img
          src="../assets/inicio/logoHQ.png"
          contain
          aspect-ratio="4"
          class="my-5"    

        ></v-img>

        <v-tabs-items v-model="tab">
          <v-tab-item
            :key="0"
          >
            <v-form
              ref="form1"
              v-model="valid1"
              class="mt-5"
              @keyup.native.enter="validate(1)"

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
                    @click="validate(1)"
                  >
                  <v-icon left >mdi-login</v-icon>
                    Ingresar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tab-item>


          <v-tab-item
            :key="1"
          >
            <v-form
              class="mt-5"
              ref="form2"
              v-model="valid2"
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
                  v-model="rut"
                  label="Correo"
                  placeholder="nombre@correo.cl"
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
                  v-model="rut"
                  label="Celular/Teléfono"
                  placeholder="9988776655"
                  required
                  outlined
                  :rules="[value => !!value || 'Campo Requerido.']"
                ></v-text-field>
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
                  @click="validate(2)"
                >
                <v-icon left >mdi-send</v-icon>
                  Enviar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          </v-tab-item>


          <v-tab-item
            :key="2"
          >
            <v-form
              class="mt-5"
              ref="form3"
              v-model="valid3"
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
                  class="d-flex justify-end"
                >
                  <v-btn
                    color="primary"
                    @click="validate(3)"
                    large
                  >
                  <v-icon left >mdi-send</v-icon>
                    Enviar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
        
        
      </v-card>
      
      </v-col>
    </v-row>
</v-container>
  
</v-container>
</template>

<script>
import auth from "@/auth/auth";
import { mapState } from 'vuex';

export default {
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          rut: "",
          password: "",
          mostrar: false,
          valid1: true,
          valid2: true,
          valid3: true,
          tab: 0,
        };
    },
    computed: {
      ...mapState(["rutaActual"]),
    },
    methods:{
      validate (num) {
        if(num == 1){
          this.$refs.form1.validate()
          if(this.valid1){
            this.login()
          }
        }
        else if(num == 2){
          this.$refs.form2.validate()
          if(this.valid2){
            //
          }
        }
        else if(num == 3){
          this.$refs.form3.validate()
          if(this.valid3){
            //
          }
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