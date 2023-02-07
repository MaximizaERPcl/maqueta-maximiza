<template>
    <v-data-table
    v-if="pagos"
    :headers="cabecera.capital" 
    :items="indexedCapital"
    v-model="selectedCapital" 
    :no-data-text="pagos.capital.length == 0
        ? 'No hay abonos capital por pagar'
        : 'No puede hacer abonos capital si mantiene un crédito castigado'" 
    dense 
    hide-default-footer 
    show-select
    single-select class="mx-1 mb-4 elevation-1" 
    @item-selected="selectItem($event, 'selectedCapital')">
        <template v-slot:item.vigente="{}">
            Abono Pactado
        </template>
        <template v-slot:item.abono_pactado="{ item }">
            <div v-if="!selectedItem(item.id, selectedCapital)">
                {{ conv.formatMonto(item.abono_pactado, true) }}
            </div>
            <div v-else>
                <v-form v-model="validCapital">
                    <v-text-field required dense hide-details="auto" single-line v-mask="currencyMask"
                        v-model="selectedCapitalAux[item.id].abono_pactado" @input="formatAmountCap()"
                        :rules="[rules.required, (v) => !!v && revisarMontoCapital(item.id),]">
                        <template v-slot:append-outer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon small v-on="on" color="warning">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                Abono
                            </v-tooltip>
                        </template>
                    </v-text-field>
                </v-form>
            </div>
        </template>
        <template v-slot:top>
            <v-system-bar flat outlined dense :color="colorCabeceras" height="35">
                <v-toolbar-title class="flex text-center cabecera">Capital</v-toolbar-title>
            </v-system-bar>
        </template>
    </v-data-table>

</template>
<script>
import cabeceras from "./cabeceras.json";
import conv from "@/services/conversores";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

export default {
    data() {
        return {
            cabecera: cabeceras,
            loading: true,
            colorCabeceras: "secondary",
            selectedCapital: [],
            validCapital: true,
            selectedCapitalAux: [],
            currencyMask: createNumberMask({
                prefix: "$",
                includeThousandsSeparator: true,
                allowNegative: false,
                thousandsSeparatorSymbol: ".",
            }),
            rules: {
                required: (value) => !!value || "Campo requerido.",
            },
        }//return   

    },//data
    methods: {
        selectedItem(id, array) {
            return array.findIndex((item) => item.id == id) >= 0 ? true : false;
        },
        selectItem(event, array) {
            let item = event.item;
            let value = event.value;


            if (value) {
                let temp_item = JSON.parse(JSON.stringify(item));
                this[array].push(temp_item);
                this[array + "Aux"] = JSON.parse(JSON.stringify(this[array]));
            } else {
                this[array].pop();
                this[array + "Aux"].pop();

            }
        },
        formatAmountCap() {
            let current = this.selectedCapitalAux[0].abono_pactado;
            if (current && current != "$")
                this.selectedCapital[0].abono_pactado = this.desmonetizar(current);
            else this.selectedCapital[0].abono_pactado = 0;
        },
        desmonetizar(monto) {
            return monto.replace("$", "").split(".").join("");
        },
        revisarMontoCapital(idx) {
            let monto = parseInt(this.selectedCapital[idx].abono_pactado);
            let min = parseInt(this.indexedCapital[idx].abono_pactado);
            let max = parseInt(this.indexedCapital[idx].abono_maximo);

            if (monto < min)
                return false || "Monto mínimo: " + conv.formatMonto(min, true);
            else if (monto > max)
                return false || "Monto máximo: " + conv.formatMonto(max, true);
            else return true;
        },
    },//methods
    computed: {
        conv() {
            return conv;
        },
        indexedCapital() {
            return this.pagos.capital.map((item, index) => ({
                id: index,
                ...item,
            }));
        },
        indexedCastigados() {
            console.log(this.pagos);
            return this.pagos.credito_castigado.map((item, index) => ({
                id: index,
                ...item,
            }));
        },
    },//computed
    watch :{
        selectedCapital : function(){this.$root.$emit("enviarCapital",this.selectedCapital)},
        validCapital : function(){this.$root.$emit("validCapital",this.validCapital)}
    },
    props:{
        pagos:null,
    },//props
}//export default

</script>

<style scoped>
.cabecera {
    color: white;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
}
</style>