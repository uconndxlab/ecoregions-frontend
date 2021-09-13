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
            <p v-if="region.flavor_text">{{ region.flavor_text }}</p>

            <div class="step-overview step" v-if="step == 1">
                <p class="text-button overview-header">Overview</p>
                <p v-if="region.overview" class="overview">
                    {{ region.overview }}
                </p>
                <v-btn class="mt-5" @click="exploreVisitAction()"
                    >Explore &amp; Visit</v-btn
                >
            </div>

            <div class="step-locations step" v-if="step == 2">
                <p class="text-button overview-header">Explore &amp; Visit</p>
                <v-list-item-group v-model="highlightedLocationIndex">
                    <v-list-item two-line v-for="loc in locations" :key="loc.id" class="location-list-item" dark @mouseenter="emitListHighlightEvent(loc)" @mouseleave="emitListDeHighlightEvent(loc)">
                        <v-list-item-content>
                            <v-list-item-title class="location-list-item-title">{{
                                loc.title.rendered
                            }}</v-list-item-title>
                            <v-list-item-subtitle class="location-list-item-flavor">{{
                                loc.flavor_text
                            }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                
            </div>
        </div>
    </div>
</template>

<script>
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
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    color: white;
    padding: 20px 50px;
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
</style>