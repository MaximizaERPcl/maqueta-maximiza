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
            placeholder="11111111-1"
            required
            outlined
            :rules="[reglas.required]"
        ></v-text-field>
        </v-col>
        <v-col
        cols="12"
        sm="10"
        md="8"
        >
        <v-text-field
          v-model="correo"
          label="Correo"
          placeholder="nombre@correo.cl"
          required
          outlined
          :rules="[reglas.required, reglas.email]"
        ></v-text-field>
        </v-col>
        <v-col
        cols="12"
        sm="10"
        md="8"
        >
        <v-text-field
          v-model="telefono"
          label="Celular/Teléfono"
          placeholder="9988776655"
          required
          outlined
          :rules="[reglas.required]"
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
import { mapState } from 'vuex';

export default {
    data: function () {
        return {
          alert:false,
          alertMsg:"",
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
        };
    },
    computed: {
      //
    },
    methods:{
      validate () {
        this.$refs.form.validate()
        if(this.valid){
          this.login()
        }
        
      },
      async generarClave(){
        await auth.generarClave(this.rut, this.correo, this.telefono)
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