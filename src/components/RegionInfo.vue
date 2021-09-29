<template>
    <div :class="objclass">
        <div class="flyout-content">
            <v-btn
                text
                @click="goBack()"
                :disabled="step < 2"
                color="white"
                class="mb-6"
            >
                <v-icon left dark> mdi-chevron-left </v-icon>
                Back
            </v-btn>

            <div class="d-flex justify-space-around progress-points mb-3">
                <a @click.prevent="navigateToStep(0)">CT Map</a>
                <a @click.prevent="navigateToStep(1)" :class="step < 1 ? 'disabled' : ''">Overview</a>
                <a @click.prevent="navigateToStep(2)" :class="step < 2 ? 'disabled' : ''">Explore &amp; Visit</a>
                <a @click.prevent="navigateToStep(3)" :class="step < 3 ? 'disabled' : ''">Place</a>
            </div>

            <v-progress-linear
                color="primary"
                height="19"
                v-model="progressBar"
                class="mb-7"
            ></v-progress-linear>

            <h1 v-if="region.name && step < 3" class="mb-4 text-h4">{{ region.name }}</h1>
            <p v-if="region.flavor_text && step < 3" class="mb-8">{{ region.flavor_text }}</p>

            <div class="step-overview step" v-if="step == 1">
                <h6 class="text-h6 mb-6">Overview</h6>
                <div v-html="$options.filters.cleanContent(region.overview)" class="overview text-body-1"></div>
                <v-btn class="mt-6" @click="exploreVisitAction()"
                    >Explore &amp; Visit</v-btn
                >
            </div>

            <div class="step-locations step" v-if="step == 2">
                <h6 class="text-h6 mb-6">Explore &amp; Visit</h6>
                <v-list-item-group v-model="highlightedLocationIndex" class="overview">
                    <template v-for="loc in locations">
                    <v-list-item two-line :key="loc.id" class="location-list-item" dark @mouseenter="emitListHighlightEvent(loc)" @mouseleave="emitListDeHighlightEvent(loc)"
                    @click="setLocation(loc)">
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

            <div class="step-location-description step" v-if="step == 3 && content_location">
                <h1 class="mb-4 text-h4" v-if="content_location.title && content_location.title.rendered">{{ content_location.title.rendered }}</h1>
                <p v-if="content_location.flavor_text" class="mb-8 flavor">{{ content_location.flavor_text }}</p>
                <div class="overview text-body-1" v-if="content_location.content && content_location.content.rendered">
                    <div v-html="content_location.content.rendered"></div>
                </div>
                <div class="text-body-1" v-else>
                    <p>See below for more on this location!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import locationEventBus from '@/events/locationEventBus'

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
            highlightedLocationIndex: -1,
        };
    },
    computed: {
        ...mapGetters({
            content_location: 'getContentLocation'
        }),
        objclass() {
            if (this.open) {
                return "region-info-flyout";
            }
            return "region-info-flyout hidden";
        },
        progressBar() {
            // return (this.step + 1) * 25
            if ( this.step > 2 ) {
                return 100
            }
            return ((this.step + 1) * 25) - 15
        }
    },
    methods: {
        ...mapMutations({
            setContentLocation: 'SET_CONTENT_LOCATION'
        }),
        openFlyout(region, locations) {
            this.region = region;
            this.locations = locations;
            this.step = 1;
            this.open = true;
        },
        openFlyoutWithLocation(region, locations, location) {
            this.region = region
            this.locations = locations;
            this.setLocation(location)
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
        },
        emitHomeMapStateEvent() {
            this.$emit('homeMapStateRequested')
        },
        setLocation(location) {
            this.setContentLocation(location)
            this.step = 3
            locationEventBus.$emit('location-selected', location)
            if ( window.location.pathname !== '/location/' + location.slug ) {
                history.pushState({}, null, '/location/' + location.slug)
            }
        },
        goBack() {
            if ( this.step > 1 ) {
                this.navigateToStep(this.step - 1)
            }
        },
        navigateToStep(step) {
            if ( step < this.step ) {
                this.step = step
                if ( step === 1 ) {
                    history.pushState({}, null, '/region/' + this.region.slug)
                }

                if ( step === 0 ) {
                    history.pushState({}, null, '/')
                    this.emitHomeMapStateEvent()
                    
                }
            }
        },
        goBackFromPopstate() {
            if ( window.location.pathname.includes('/region/') ) {
                // navigating to region, just go back.
                this.goBack()
            }
        }
    },
};
</script>

<style scoped>
.region-info-flyout {
    background: rgba(37, 59, 80, 0.9);
    height: 100%;
    max-width: 650px;
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    color: white;
    padding: 20px 50px 80px;
}

.hidden {
    display: none;
}

.region-info-flyout .overview {
    overflow-y: scroll;
    padding: 8px 8px 8px 0;
    flex-grow: 1;
    max-height: 51%;
}

.region-info-flyout .step-overview, .region-info-flyout .step-location-description {
    height: 90%;
    max-height: 90%;
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

.flavor {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    font-family: 'Raleway', sans-serif;
}

.progress-points a {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: white;
}

.progress-points a.disabled {
    color: rgba(255, 255, 255, 0.54);
    cursor: default;
}
</style>

<style lang="scss">
.region-info-flyout {
    .flyout-content {
        .step {
            &.step-location-description {
                hr {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    border-color: rgba(255, 255, 255, .3);
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
@media #{map-get($display-breakpoints, 'md-and-down')} {
    .region-info-flyout {
        max-width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;

        .flyout-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            & > * {
                flex: 0 0 auto;
            }

            .step {
                display: flex;
                flex-direction: column;
                height: auto;
                max-height: none;
                flex: 1 1 0%;
                height: 1%;
                
                & > * {
                    flex: 0 0 auto;
                }

                .overview {
                    flex: 1 0 0%;
                    max-height: none;
                }
            }
        }
    }
}
</style>