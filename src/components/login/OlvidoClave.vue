<template>
<v-container>
  <v-form
    class="mt-5"
    ref="form"
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
</v-container>
</template>

<script>
import auth from "@/auth/auth";

export default {
    components: {
    },
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          rut: "",
          mostrar: false,
          valid: true,
          tab: 0,
        };
    },
    computed: {
    },
    methods:{
      validate (num) {
        this.$refs.form.validate()
        if(this.valid){
          //this.login()
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