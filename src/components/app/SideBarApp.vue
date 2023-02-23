<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      v-if="$route.name != 'home'"
      width="270px"
      min-width="270px"
      mobile-breakpoint="960"
      class="glass"
      tile
      height="100%"
    >
      <v-img
        :src="require('../../assets/logos/logo.png')"
        max-width="200px"
        class="mt-2 mb-0 mx-auto flex justify-center"
        contain
      ></v-img>
      <!--INICIO MENÚ DE CUENTA-->
      <v-list>
        <v-list-group
          link
          color="white"
          no-action
          v-if="userLogged"
          group="/cuenta/"
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon color="accent">mdi-account-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="nombre">{{
                nombreUsuario
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ userRut }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-slot:appendIcon>
            <v-icon style="margin-left: 0 !important">mdi-menu-up</v-icon>
          </template>

          <v-list-item
            v-for="child in cuenta.children"
            :key="child.name"
            link
            :to="{ name: 'cuenta', params: { ajuste: child.to } }"
          >
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.85rem !important">
                {{ child.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon style="margin: 15px 25px 15px 0 !important">
              <v-icon small color="accent">{{ child.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
      <!-- FIN MENÚ DE CUENTA-->
      <v-divider></v-divider>

      <!-- INICIO MENÚ DE PRINCIPAL -->
      <v-list nav :disabled="userLogged.b_cambiar_clave == '1'">
        <div v-for="(item, i) in principal" :key="i">
          <v-list-item
            :disabled="userLogged.b_cambiar_clave == '1'"
            v-if="
              !item.subgroup /*&&
              (item.bit ? sideBarMenuBits[item.bit] === '1' : true) &&
              (item.dev ? (prod ? false : true) : true)*/
            "
            link
            :to="{
              name: item.to,
              params: item.param ? { [item.paramName]: item.param } : {},
            }"
            color="white"
          >
            <v-list-item-icon style="margin: 15px 25px 15px 0 !important">
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title style="font-size: 0.85rem !important">{{
              item.name
            }}</v-list-item-title>
          </v-list-item>

          <v-list-group
            v-else-if="item.subgroup"
            :disabled="userLogged.b_cambiar_clave == '1'"
            link
            :to="{ name: item.to }"
            no-action
            append-icon="mdi-menu-up"
            color="white"
          >
            <template v-slot:activator>
              <v-list-item v-if="userLogged.b_cambiar_clave == '1'" disabled>
                <v-list-item-icon
                  style="margin: 15px 25px 15px -8px !important"
                >
                  <v-icon color="primary">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title style="font-size: 0.85rem !important">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item>
              <template v-else>
                <v-list-item-icon style="margin: 15px 25px 15px 0px !important">
                  <v-icon color="primary">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title style="font-size: 0.85rem !important">{{
                  item.name
                }}</v-list-item-title>
              </template>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.name"
              link
              :to="{ name: item.to, params: { product: child.param } }"
            >
              <v-list-item-content>
                <v-list-item-title style="font-size: 0.85rem !important">{{
                  child.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>

      <!-- FIN MENÚ PRINCIPAL -->

      <template v-slot:append>
        <!--v-img 
          :src="require('../../assets/logos/logo.png')"
          max-width="280px"
          class="my-4 mx-2"
          contain
        ></v-img-->
        <div class="pa-2">
          <v-btn @click="logout" block color="error"> Cerrar Sesión </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import auth from "@/auth/auth";
import { formatterRut } from "chilean-formatter";
import conv from "@/services/conversores";

export default {
  data: () => ({
    totalMenu: [
      { name: "Inicio", route: "ingresa" },
      { name: "Productos", route: "productos" },
      //{ name: "Beneficiarios Seguro Capital", route: "benCapital" },
      { name: "Simulador de créditos", route: "creditos" },
      { name: "Pagar Productos", route: "pagoweb" },
      //{ name: "Seguimiento de Crédito", route: "seguimiento" },
      { name: "Simulador Dap", route: "dap" },
      { name: "Cuenta", route: "cuenta" },
    ],
    principal: [
      { name: "Inicio", icon: "mdi-home", to: "ingresa" },
      {
        name: "Pagar Productos",
        icon: "mdi-account-credit-card",
        to: "pagoweb",
      },
      {
        name: "Productos",
        icon: "mdi-briefcase-account",
        to: "productos",
        subgroup: true,
        children: [
          { name: "Cuenta Capital", param: "cuenta-capital" }, //
          { name: "Cuenta de Ahorro", param: "cuenta-ahorro" }, //
          { name: "Remanentes", param: "remanentes" },
          { name: "Depósito a plazo", param: "dap" }, //
          { name: "Créditos", param: "creditos" }, //
          { name: "Próximos Pagos", param: "proximos-pagos" },
          //{name: 'Firma Legale', param:'firma'},
        ],
      },
      {
        name: "Simulador de créditos",
        icon: "mdi-credit-card",
        to: "creditos",
      },
      {
        name: "Simulador Dap",
        icon: "mdi-bank-transfer-in",
        to: "dap",
      },
    ],
    cuenta: {
      name: "Ajustes Cuenta",
      icon: "mdi-account-cog",
      to: "cuenta",
      children: [
        {
          name: "Actualizar Datos",
          to: "actualizar-datos",
          icon: "mdi-account-details",
        }, //
        {
          name: "Cambiar Clave",
          to: "cambiar-clave",
          icon: "mdi-account-lock",
        }, //
      ],
    },
    finalItems: [{ name: "Atención Socios", icon: "mdi-phone" }],
  }),
  computed: {
    userRut() {
      return formatterRut(this.userLogged.rut);
    },
    userLogged() {
      return auth.getUserLogged();
    },
    nombreUsuario() {
      let nombre = this.userLogged.nombre.split(" ")[0];
      let apellido = this.userLogged.apellido_paterno.split(" ")[0];
      return conv.capitalizeString(nombre + " " + apellido);
    },
    ...mapGetters({
      drawerTest: "drawer",
    }),
    drawer: {
      get() {
        return this.drawerTest;
      },
      set(state) {
        this.switchDrawer(state);
        return state;
      },
    },
  },
  methods: {
    ...mapMutations(["cambiarRuta"]),
    ...mapActions(["switchDrawer", "close_timeout"]),
    logout() {
      this.close_timeout();
      auth.cerrarSesion();
      this.$router.push({ name: "login" });
    },
  },
  created() {
    if (this.$route.name) {
      let ruta = this.$route.name;
      var indiceRuta = this.totalMenu.findIndex((item) => item.route === ruta);
      this.cambiarRuta(this.totalMenu[indiceRuta].name);
    }
  },
  watch: {
    "$route.name": {
      handler(value) {
        var indiceRuta = this.totalMenu.findIndex(
          (item) => item.route === value
        );
        this.cambiarRuta(this.totalMenu[indiceRuta].name);
      },
      deep: true,
    },
  },
};
</script>
<style scoped lang="css">
.glass {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  background-color: rgba(66, 133, 244, 0.3);
  backdrop-filter: blur(10px);
}
.transparente {
  background-color: transparent;
}

.nombre {
  white-space: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
}
</style>
