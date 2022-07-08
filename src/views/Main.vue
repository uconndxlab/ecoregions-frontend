<template>
    <div class="page-main">
        <div class="map-container">
            <region-map />
            <left-content-block>
                <div class="top-filter">
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
                </div>
                

                <v-row>
                    <v-col>
                        <div class="exploration-list">
                            <exploration-item v-for="expl in explorations" :key="`ex-${expl.id}`" :exploration="expl" />
                        </div>
                    </v-col>
                </v-row>
            </left-content-block>

            <right-content-block>
                <v-row class="text-center">
                    <v-col>
                        <h1>{{ explorationTitle }}</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-chip v-for="h in selectedExplorationHabitats" :key="`hab-chip-${h.id}`" class="mr-2">{{ h.name }}</v-chip>
                        <v-chip v-for="s in selectedExplorationSubjects" :key="`subj-chip-${s.id}`" class="mr-2">{{ s.name }}</v-chip>
                    </v-col>
                </v-row>

                <v-row v-if="selectedExplorationRegion.length > 0">
                    <v-col>
                        Regions: <v-chip v-for="r in selectedExplorationRegion" :key="`reg-chip-${r.id}`">{{ r.name }}</v-chip>
                    </v-col>
                </v-row>

                <v-row v-if="selectedExploration.site && selectedExploration.site.length > 0">
                    <v-col>
                        Site: {{ selectedExploration.site[0].post_title }}
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <div v-html="explorationContent" class="exploration-content-box"></div>
                    </v-col>
                </v-row>
            </right-content-block>
        </div>
        <ecoregions-footer></ecoregions-footer>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EcoregionsFooter from '@/components/Footer.vue'
import LeftContentBlock from '@/components/LeftContentBlock.vue'
import RightContentBlock from '@/components/RightContentBlock.vue'
import SelectDropdown from '@/components/SelectDropdown.vue'
import ExplorationItem from '@/components/ExplorationItem.vue'
import RegionMap from '@/components/RegionMap.vue'

export default {
    components: {
        EcoregionsFooter,
        LeftContentBlock,
        SelectDropdown,
        ExplorationItem,
        RegionMap,
        RightContentBlock
    },
    computed: {
        ...mapGetters({
            subjects: 'getSubjectsDropdownItems',
            habitats: 'getHabitatsDropdownItems',
            explorations: 'getExplorations',
            selectedExploration: 'getSelectedExploration',
            selectedExplorationHabitats: 'getSelectedExplorationHabitats',
            selectedExplorationSubjects: 'getSelectedExplorationSubjects',
            selectedExplorationRegion: 'getSelectedExplorationRegion'
        }),
        explorationTitle() {
            return this.selectedExploration?.title?.rendered
        },
        explorationContent() {
            return this.selectedExploration?.content?.rendered
        }
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

<style lang="scss">
.page-main {
    width: 100%;
    height: calc(100vh - 82px);
    position: relative;
}

.map-container {
    width: 100%;
    height: 100%;
    display: flex;
}

.top-filter {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 30px;
}

.exploration-content-box {
    padding: 20px;
    background-color: #54644f;
    border-radius: 10px;
}

@media #{map-get($display-breakpoints, 'md-and-down')} {
    .map-container {
        flex-wrap: wrap;
    }
}
</style>