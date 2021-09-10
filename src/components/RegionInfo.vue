<template>
    <div :class="objclass">
        <h1 v-if="region.name">{{ region.name }}</h1>
        <p v-if="region.flavor_text">{{ region.flavor_text }}</p>
        <p>Overview</p>
        <p v-if="region.overview" class="overview">{{ region.overview }}</p>
        <v-btn class="mt-5">Explore &amp; Visit</v-btn>
    </div>    
</template>

<script>
export default {
    data: () => {
        return {
            open: false,
            region: {
                name: '',
                flavor_text: ''
            },
            locations: [],
            step: 0
        }
    },
    computed: {
        objclass() {
            if ( this.open ) {
                return 'region-info-flyout'
            }
            return 'region-info-flyout hidden'
        }
    },
    methods: {
        openFlyout(region, locations) {
            this.region = region
            this.locations = locations
            this.open = true
        },
        closeFlyout() {
            this.open = false
        }
    }
}
</script>

<style scoped>
.region-info-flyout {
    background: rgba(37, 59, 80, 0.9);
    height: 100%;
    /* min-width: 400px; */
    max-width: 600px;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    color: white;
    padding: 50px;
}

.hidden {
    display: none;
}

.region-info-flyout .overview {
    overflow-y: scroll;
    max-height: 60%;
}
</style>