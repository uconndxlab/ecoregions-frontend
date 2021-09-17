<template>
    <div :class="objclass">
        <div class="flyout-content">
            <v-btn
                text
                @click="step = step - 1"
                :disabled="step < 2"
                color="white"
                class="mb-3"
            >
                <v-icon left dark> mdi-chevron-left </v-icon>
                Back
            </v-btn>
            <h1 v-if="region.name" class="mb-3 text-h4">{{ region.name }}</h1>
            <p v-if="region.flavor_text" class="mb-8">{{ region.flavor_text }}</p>

            <div class="step-overview step" v-if="step == 1">
                <h6 class="text-h6 mb-6">Overview</h6>
                <div v-html="$options.filters.cleanContent(region.overview)" class="overview text-body-1"></div>
                <v-btn class="mt-5" @click="exploreVisitAction()"
                    >Explore &amp; Visit</v-btn
                >
            </div>

            <div class="step-locations step" v-if="step == 2">
                <h6 class="text-h6 mb-6">Explore &amp; Visit</h6>
                <v-list-item-group v-model="highlightedLocationIndex">
                    <template v-for="loc in locations">
                    <v-list-item two-line :key="loc.id" class="location-list-item" dark @mouseenter="emitListHighlightEvent(loc)" @mouseleave="emitListDeHighlightEvent(loc)"
                    @click="setContentTabsForLocation(loc)">
                        <v-list-item-content>
                            <v-list-item-title class="location-list-item-title text-h5 mb-4 mt-3">{{
                                loc.title.rendered
                            }}</v-list-item-title>
                            <v-list-item-subtitle class="location-list-item-flavor"><p class="text-body-1 white--text">{{
                                loc.flavor_text
                            }}</p></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider dark :key="'div'+loc.id"></v-divider>
                    </template>
                </v-list-item-group>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    data: () => {
        return {
            open: false,
            region: {
                name: "",
                flavor_text: "",
            },
            locations: [],
            step: 0,
            highlightedLocationIndex: -1
        };
    },
    computed: {
        objclass() {
            if (this.open) {
                return "region-info-flyout";
            }
            return "region-info-flyout hidden";
        },
    },
    methods: {
        ...mapMutations({
            setTabContent: 'SET_CONTENT_TABS'
        }),
        openFlyout(region, locations) {
            this.region = region;
            this.locations = locations;
            this.step = 1;
            this.open = true;
        },
        closeFlyout() {
            this.open = false;
        },
        exploreVisitAction() {
            this.step = 2;
        },
        setHighlight(index) {
            this.highlightedLocationIndex = index
        },
        emitListHighlightEvent(location) {
            this.$emit('locationListHighlight', location);
        },
        emitListDeHighlightEvent(location) {
            this.$emit('locationListDeHighlight', location);
        }
    },
};
</script>

<style scoped>
.region-info-flyout {
    background: rgba(37, 59, 80, 0.9);
    height: 100%;
    max-width: 600px;
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    color: white;
    padding: 20px 50px 150px;
}

.hidden {
    display: none;
}

.region-info-flyout .overview {
    overflow-y: scroll;
    padding: 8px 8px 8px 0;
    flex-grow: 1;
    max-height: 60%;
}

.region-info-flyout .step {
    position: relative;
    height: 100%;
}

.flyout-content {
    display: block;
    position: relative;
    height: 100%;
}

.overview-header {
    text-transform: uppercase;
}

.location-list-item-title, .location-list-item-flavor {
    text-overflow: normal;
    white-space: normal;
}
</style>