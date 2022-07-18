<template>
    <div class="select-dropdown">
        <v-select
            :items="items"
            :label="label"
            v-model="selected"
            item-text="name"
            item-value="value"
            @change="change"
            dense
            solo
            multiple
            placeholder=" "
            :menu-props="{ bottom: true, offsetY: true }"
        ></v-select>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        change: {
            type: Function,
            default: () => {
                console.log('Changed.')
            }
        }
    },
    data () {
        return {
            selected: []
        }
    },
    methods: {
        select(value) {
            this.selected = [value]
        }
    }
}
</script>

<style>
.select-dropdown .v-input.v-text-field .v-input__slot {
    border-radius: 20px;
}
</style>
