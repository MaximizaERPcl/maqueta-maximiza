<template>
  <v-container>
    <p class="flex text-center noDataMsg">{{ msg }}</p>
  </v-container>
</template>
<script>
export default {
  props: ["msg"],
  data: function () {
    return {
      //
    };
  },
};
</script>
<style scoped lang="css">
.noDataMsg {
  font-family: "Raleway", sans-serif;
  color: #333333;
  font-size: 25px;
  line-height: 30px;
  word-break: normal;
  font-weight: 300;
}
</style>
