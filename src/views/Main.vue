<template>
    <div class="page-main map-container">
        <div class="map-container">
            <left-content-block>
                <v-row>
                    <v-col>
                        <p>Subject</p>
                        <select-dropdown :change="filterChangeSubjects" :items="subjects" :label="'Subject'" />
                    </v-col>
                    <v-col>
                        <p>Habitat</p>
                        <select-dropdown :change="filterChangeHabitats" :items="habitats" :label="'Habitat'" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div class="exploration-list">
                            <exploration-item v-for="expl in explorations" :key="`ex-${expl.id}`" :exploration="expl" />
                        </div>
                    </v-col>
                </v-row>
            </left-content-block>
        </div>
        <ecoregions-footer></ecoregions-footer>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EcoregionsFooter from '@/components/Footer.vue'
import LeftContentBlock from '@/components/LeftContentBlock.vue'
import SelectDropdown from '@/components/SelectDropdown.vue'
import ExplorationItem from '@/components/ExplorationItem.vue'

export default {
    components: {
        EcoregionsFooter,
        LeftContentBlock,
        SelectDropdown,
        ExplorationItem
    },
    computed: {
        ...mapGetters({
            subjects: 'getSubjectsDropdownItems',
            habitats: 'getHabitatsDropdownItems',
            explorations: 'getExplorations'
        })
    },
    methods: {
        ...mapActions({
            changeFilter: 'changeFilter'
        }),
        filterChangeSubjects(v) {
            this.filterChanged(v, 'subject')
        },
        filterChangeHabitats(v) {
            this.filterChanged(v, 'habitat')
        },
        async filterChanged(v, which) {
            const result = await this.changeFilter({
                value: v,
                which: which
            })

            console.log(result)
        }
    }
}
</script>

<style>
.map-container {
    width: 100%;
    max-height: 100%;
}
</style>