<template>
    <div class="component-map">
        <h2>Regions</h2>
        <ul v-if="regions">
            <li
                v-for="region in regions"
                :key="region.id"
            >
                <strong>{{ region.name }}</strong>
                <p>{{ region.overview }}</p>
            </li>
        </ul>
        <p v-else>No regions.</p>

        <div id="main-mapbox"></div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import mapboxgl from 'mapbox-gl'

export default {
    data: () => {
        return {
            map: {}
        }
    },
    computed: {
        ...mapGetters({
            regions: 'getRegions'
        })
    },
    methods: {
        ...mapActions({
            fetchRegions: 'fetchRegions'
        }),
        fetchMinimumData() {
            if ( Array.isArray(this.regions) && !this.regions.length ) {
                this.fetchRegions().then((resp) => {
                    console.log(resp)
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        initializeMap() {
            mapboxgl.accessToken = "pk.eyJ1IjoidWNvbm5keGdyb3VwIiwiYSI6ImNrcTg4dWc5NzBkcWYyd283amtpNjFiZXkifQ.iGpZ5PfDWFWWPkuDeGQ3NQ"
            this.map = new mapboxgl.Map({
                container: 'main-mapbox',
                style: 'mapbox://styles/mapbox/outdoors-v11',
                center: [-72.7457, 41.6215],
                zoom: 8
            })
        }
    },
    mounted() {
        this.fetchMinimumData()
        this.initializeMap()
    }
}
</script>

<style scoped>
/* @import '~mapbox-gl/dist/mapbox-gl.css'; */
/* For some reason, the above causes issues in some ad blockers (uBlock Origin) */
@import 'https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css';
#main-mapbox {
    min-height: 600px;
}
</style>