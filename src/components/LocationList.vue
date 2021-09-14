<template>
    <div class="component-location-list" v-if="locations && locations.length > 0">
        <v-select
            :items="locations"
            v-model="selected"
            filled
            item-text="title.rendered"
            item-value="title.rendered"
            max-width="600"
            placeholder="Select a Location"
            class="component-location-list-select"
        ></v-select>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data: () => {
        return {
            region: 0,
            locations: [],
            selected: {}
        }
    },
    computed: {
        ...mapGetters({
            allLocations: 'getLocations'
        })
    },
    methods: {
        ...mapActions({
            fetchLocations: 'fetchLocations'
        }),
        fetchMinimumData() {
            if ( Array.isArray(this.locations) && !this.locations.length ) {
                this.fetchLocations().then(() => {
                    this.locations = this.allLocations
                    this.selected = this.locations[0]
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        updateWithRegion(region_id = 0) {
            if ( region_id > 0 ) {
                this.locations = this.$store.getters.getLocationsForRegion(region_id)
                this.region = region_id
                this.selected = this.locations[0]
            }
        }
    },
    mounted() {
        this.fetchMinimumData()
    }
}
</script>

<style>
.component-location-list .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
    padding-left: 32px;
    padding-right: 32px;
    border-radius: 33px;
}

.component-location-list .v-text-field--filled > .v-input__control > .v-input__slot,
.component-location-list .v-text-field--filled:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot:hover {
    background: #6AA140 !important;
}

.component-location-list .v-text-field--filled > .v-input__control > .v-input__slot .v-select__selections {
    color: white;
    font-family: 'Raleway', sans-serif;
    text-align: center;
}

.component-location-list .v-icon,
.component-location-list .v-icon.primary--text {
    color: white !important;
}

.component-location-list .v-text-field > .v-input__control > .v-input__slot:before,
.component-location-list .v-text-field > .v-input__control > .v-input__slot:after {
    border-width: 0;
}
</style>