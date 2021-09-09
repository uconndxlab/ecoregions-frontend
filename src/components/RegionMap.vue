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

            this.map.on('load', () => {
                this.addMapPolygon('northwest_uplands', [
                    [-72.82161082594858, 42.035933621864295],
                    [-73.4873136457728, 42.049446888173385],
                    [-73.53535710341936, 41.44558860831884],
                    [-73.44467683996596, 41.59054265050452],
                    [-73.20293456479384, 41.772053800976785],
                    [-73.10146797338896, 41.73207678388107],
                    [-73.01510758315594, 41.775084941678145],
                    [-72.96719934136044, 41.82676315673198],
                    [-72.8725992050337, 41.837486521688604],
                    [-72.84438786871107, 41.95087354088623]
                ])
            })

        },
        addMapPolygon( id, coordinates ) {
            const outline_id = id + '_outline'
            this.map.addSource(id, {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            coordinates
                        ]
                    }
                }
            })

            this.map.addLayer({
                'id': id,
                'type': 'fill',
                'source': id,
                'layout': {},
                'paint': {
                    'fill-color': '#628547',
                    'fill-opacity': 0.3
                }
            })

            this.map.addLayer({
                'id': outline_id,
                'type': 'line',
                'source': id,
                'layout': {},
                'paint': {
                    'line-color': '#628547',
                    'line-width': 2
                }
            })

            this.map.on('click', id, (e) => {
                console.log(e)
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(id)
                    .addTo(this.map)
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
/* For some reason, the above causes issues in some ad blockers (uBlock Origin).  It tries to throw like custom analytics events which prevents load. */
@import 'https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css';
#main-mapbox {
    min-height: 600px;
}
</style>