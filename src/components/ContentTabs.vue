<template>
    <div class="content-tabs" v-if="content_tabs">
        <v-tabs
            v-model="current_tab"
            centered
            class="content-tabs-tabselect mb-10"
            background-color="transparent"
        >
            <v-tabs-slider color="transparent"></v-tabs-slider>

            <template v-for="(ct, index) in content_tabs">
                <v-tab
                    :key="`tab-` + ct.title"
                    class="content-tabs-tab"
                >{{ ct.title }}</v-tab>
                <div class="tab-divider" :key="`tab-divide`+ct.title" v-if="index < content_tabs.length - 1"></div>
            </template>
            
        </v-tabs>

        <v-container>
            <v-row align="center" justify="center" v-if="show_locations">
                <v-col md="6">
                    <location-list></location-list>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col>
                    <v-tabs-items v-model="current_tab">
                        <v-tab-item v-for="ct in content_tabs" :key="`tabcontent-` + ct.title">
                            <div v-html="ct.content" class="tab-content"></div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-container>

        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LocationList from '@/components/LocationList.vue'

export default {
    components: { LocationList },
    props: {
        requests: Array
    },
    data: () => {
        return {
            current_tab: null,
            show_locations: true
        }
    },
    computed: {
        ...mapGetters({
            content_tabs: 'getContentTabs'
        })
    },
    methods: {
        ...mapActions({
            fetchContentForTabs: 'fetchPageContentForTabs'
        }),
        fetchContentBySlugs(slug_array) {
            this.fetchContentForTabs(slug_array)
        },
        enableLocationList() {
            this.show_locations = true
        },
        disableLocationList() {
            this.show_locations = false
        }
    },
    created() {
        if ( this.requests ) {
            console.log(this.requests)
            this.fetchContentForTabs(this.requests)
        }
    }
}
</script>

<style scoped>
.content-tabs {
    margin-top: -60px; /* 77 height - 18 offset in design */
    z-index: 1000;
    position:relative;
}

.content-tabs-tab {
    background-color: white;
    text-transform: none;
    font-family: 'Raleway', sans-serif;
}

.tab-divider {
    height: 100%;
    width: 1px;
    background-color: rgba(55, 64, 68, 0.37);
}

.tab-content {
    padding: 50px;
}
</style>

<style>
.content-tabs-tabselect .v-slide-group__content {
    margin-left: auto;
    margin-right: auto;
    flex-grow:0;
    background-color: white;
    padding: 16px 30px;
    border-radius: 6px;
}
</style>