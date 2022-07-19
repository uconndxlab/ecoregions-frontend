<template>
    <div class="page-main">
        <div class="map-container">
            <region-map @regionClick="regionClick" @siteFilter="siteFilter" ref="region_map" />
            <left-content-block>
                <div class="top-filter">
                    <v-row>
                        <v-col cols="4">
                            <p>Subject</p>
                            <select-dropdown :change="filterChangeSubjects" :items="subjects" :label="'Subject'" ref="subject_filter_dropdown" />
                        </v-col>
                        <v-col cols="4">
                            <p>Habitat</p>
                            <select-dropdown :change="filterChangeHabitats" :items="habitats" :label="'Habitat'" ref="habitat_filter_dropdown" />
                        </v-col>
                        <v-col cols="4">
                            <p>Specificity</p>
                            <select-dropdown :items="specificityOptions"  :change="filterSpecificity" :label="`Specificity`" ref="specificity_filter_dropdown" />
                        </v-col>
                    </v-row>
                </div>
                

                <v-row>
                    <v-col>
                        <div class="exploration-list">
                            <exploration-item v-for="expl in explorations" :key="`ex-${expl.id}`" :exploration="expl" />
                        </div>
                        <div class="exploration-list text-center" v-if="explorations.length === 0">
                            <p class="text-center">There are no results.</p>
                            <v-btn @click="clearFiltersButton">Clear Filters</v-btn>
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
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
            selectedExplorationRegion: 'getSelectedExplorationRegion',
            specificityOptions: 'getSpecificityOptions',
        }),
        filterSpecificityValue: {
            get() {
                return this.getFilterSpecificityValue
            },
            set(v) {
                this.setFilterSpecificityValue(v)
            }
        },
        explorationTitle() {
            return this.selectedExploration?.title?.rendered
        },
        explorationContent() {
            return this.selectedExploration?.content?.rendered
        }
    },
    methods: {
        ...mapMutations({
            setFilterSpecificityValue: 'SET_FILTER_SPECIFICITY_VALUE'
        }),
        ...mapActions({
            changeFilter: 'changeFilter',
            changeFilters: 'changeFilters',
            clearFilters: 'clearFilters'
        }),
        async filterSpecificity(v) {
            const filters = {
                site: [],
                region: []
            }
            for (let index = 0; index < v.length; index++) {
                const element = v[index]
                
                const [which, value] = element.split('-')
                if ( filters[which] ) {
                    filters[which].push(value)
                }
            }

            await this.changeFilters([
                {
                    which: 'site',
                    value: filters.site
                },
                {
                    which: 'region',
                    value: filters.region
                }
            ])
        },
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
        },
        regionClick(region) {
            this.$refs.specificity_filter_dropdown.select(`region-${region.id}`)
        },
        siteFilter(site) {
            const location_category_reference_id = 
                    ( Array.isArray(site.site) && site.site.length > 0 ) ?
                        site.site[0] :
                        null
            this.$refs.specificity_filter_dropdown.select(`site-${location_category_reference_id}`)
        },
        clearFiltersButton() {
            this.$refs.specificity_filter_dropdown.clear()
            this.$refs.habitat_filter_dropdown.clear()
            this.$refs.subject_filter_dropdown.clear()
            this.$refs.region_map.clearSelectedRegion()
            this.clearFilters()
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