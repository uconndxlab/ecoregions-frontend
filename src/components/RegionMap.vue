<template>
    <div class="component-map">
        <v-alert class="info-alert mr-4" v-if="selectedRegionSlug === ''">Select an Ecoregion to begin.</v-alert>
        <v-card class="mapLayerToggle">
            <v-card-text>
                <v-checkbox
                    v-model="toggleLayerState.townNames"
                    @change="toggleLayer('townNames')"
                    :label="`Town Names`"
                ></v-checkbox>
                <v-checkbox
                    v-model="toggleLayerState.geologicalFeatures"
                    @change="toggleLayer('geologicalFeatures')"
                    :label="`Geological Features`"
                ></v-checkbox>
            </v-card-text>
            
        </v-card>
        <div id="main-mapbox"></div>
        <region-info ref="region_info" @locationListHighlight="listHighlightEvent" @locationListDeHighlight="listDeHighlightEvent" @homeMapStateRequested="restoreMapIntroduction"></region-info>
        
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import mapboxgl from "mapbox-gl";
import RegionInfo from '@/components/RegionInfo.vue'
import locationEventBus from '@/events/locationEventBus'

export default {
    props: {
        startRegion: String,
        startLocation: String
    },
    components: {
        RegionInfo
    },
    data: () => {
        return {
            map: {},
            region_coordinate_mappings: {
                "northwestern-uplands": [
                    [-72.82161082594858, 42.035933621864295],
                    [-73.4873136457728, 42.049446888173385],
                    [-73.53535710341936, 41.44558860831884],
                    [-73.44467683996596, 41.59054265050452],
                    [-73.20293456479384, 41.772053800976785],
                    [-73.10146797338896, 41.73207678388107],
                    [-73.01510758315594, 41.775084941678145],
                    [-72.96719934136044, 41.82676315673198],
                    [-72.8725992050337, 41.837486521688604],
                    [-72.84438786871107, 41.95087354088623],
                ],
            },
            zoom_to_coordinate_mappings: {
                "northwestern-uplands": [-73.6477766, 41.7672095],
                // "northwestern-uplands": [-73.22635185546915, 41.77735469268558],
            },
            selectedRegionSlug: "",
            markers: [],
            showTowns: true,
            toggleLayers: {
                townNames: 'ct-town-county-labels',
                geologicalFeatures: ['marble-valleys', 'traprock-ridges', 'glacial-lake-deposit']
            },
            toggleLayerState: {
                townNames: true,
                geologicalFeatures: true,
                regions: true
            }
        };
    },
    computed: {
        ...mapGetters({
            regions: "getRegions",
            locations: "getLocations",
            geologicalFeatures: "getGeologicalFeatures"
        }),
        isSM() {
            return this.$vuetify.breakpoint.name === 'sm'
        },
        isXS() {
            return this.$vuetify.breakpoint.name === 'xs'
        },
        initialMapConfig() {
            let map_config = {
                container: "main-mapbox",
                style: "mapbox://styles/uconndxgroup/ckvb5m4qm0q0v14qs76jitlc6",
                center: [-73.6457, 41.5215],
                zoom: 8,
            }

            // Slightly change the configuration for default display on a vertical mobile device.
            if ( this.isSM || this.isXS ) {
                map_config.zoom = 7
                map_config.center = [-72.7457, 41.3]
            }

            return map_config
        }
    },
    methods: {
        ...mapActions({
            fetchRegions: "fetchRegions",
            fetchLocations: "fetchLocations",
            fetchGeologicalFeatures: "fetchGeologicalFeatures"
        }),
        ...mapMutations({
            setTabContent: "SET_CONTENT_LOCATION"
        }),
        fetchMinimumData() {
            if (Array.isArray(this.regions) && !this.regions.length) {
                this.fetchRegions()
                    .then(() => {})
                    .catch((err) => {
                        console.log(err);
                    });
            }

            if (Array.isArray(this.locations) && !this.locations.length) {
                this.fetchLocations()
                    .then(() => {})
                    .catch((err) => {
                        console.log(err);
                    });
            }

            if ( Array.isArray(this.geologicalFeatures) && !this.geologicalFeatures.length) {
                this.fetchGeologicalFeatures()
                    .then(() => {})
                    .catch((err) => {
                        console.log(err)
                    })
            }
        },
        initializeMap() {
            mapboxgl.accessToken =
                "pk.eyJ1IjoidWNvbm5keGdyb3VwIiwiYSI6ImNrcTg4dWc5NzBkcWYyd283amtpNjFiZXkifQ.iGpZ5PfDWFWWPkuDeGQ3NQ";

            this.map = new mapboxgl.Map(this.initialMapConfig);

            // disable map zoom when using scroll
            this.map.scrollZoom.disable();

            // Add zoom and rotation controls to the map.
            this.map.addControl(new mapboxgl.NavigationControl());

            this.map.on("load", () => {
                let start_region_obj = {}
                if (Array.isArray(this.regions)) {
                    this.regions.forEach((region) => {
                        const coords =
                            this.region_coordinate_mappings[region.slug];
                        if ( this.startRegion && region.slug === this.startRegion ) {
                            start_region_obj = region
                        }
                        if (coords) {
                            this.addMapPolygon(region, coords);
                        }
                    });

                    if ( start_region_obj && start_region_obj.slug ) {
                        this.navigateToRegion(start_region_obj.slug)
                    }

                    if ( this.startLocation ) {
                        this.onInitializedWithLocation()
                    }
                }

                // this.addEcoregionsRasterOverlay()

                // this.addGeologicalFeaturesRaster()

                this.addTownLabels()

                this.describeLayers()
            });
        },
        addMapPolygon(region, coordinates) {
            const outline_id = region.slug + "_outline";
            this.map.addSource(region.slug, {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [coordinates],
                    },
                },
            });

            this.map.addLayer({
                id: region.slug,
                type: "fill",
                source: region.slug,
                layout: {},
                paint: {
                    "fill-color": "#628547",
                    "fill-opacity": 0.3,
                },
            });

            this.map.addLayer({
                id: outline_id,
                type: "line",
                source: region.slug,
                layout: {},
                paint: {
                    "line-color": "#628547",
                    "line-width": 2,
                },
            });

            // Can pass 'event' to this callback function, for access to clicked properties such as event.lngLat
            this.map.on("click", region.slug, () => {
                if ( this.selectedRegionSlug ) {
                    return false;
                }

                this.$router.push('/region/' + region.slug)

                this.selectedRegionSlug = region.slug;

                let ease_to_config = {
                    center: this.zoom_to_coordinate_mappings[region.slug],
                    zoom: 9,
                    duration: 1000,
                }

                if ( this.isSM || this.isXS ) {
                    ease_to_config.zoom = 8,
                    ease_to_config.center = this.getMobileAdjustedCenterForRegion(region.slug)
                }

                this.map.easeTo(ease_to_config);

                const locationsInRegion = this.$store.getters.getLocationsForRegion( region.id );

                this.setTabContent(locationsInRegion[0])
                locationEventBus.$emit('region-selected', region)
                this.$refs.region_info.openFlyout(region, locationsInRegion)

                locationsInRegion.forEach((loc) => {
                    const circle = document.createElement("div");
                    circle.className = "circle";

                    const inner_circle = document.createElement("div");
                    inner_circle.className = "inner_circle";
                    
                    circle.appendChild(inner_circle);

                    // Marker container.
                    const el = document.createElement("div");
                    el.appendChild(circle);
                    el.className = "marker";
                    el.style.width = "30px";
                    el.style.height = "30px";
                    el.dataset.locationid = loc.id

                    el.addEventListener('mouseenter', () => {
                        el.classList.add('highlighted')
                        this.$refs.region_info.setHighlight(this.locations.indexOf(loc))
                    })

                    el.addEventListener('mouseleave', () => {
                        el.classList.remove('highlighted')
                        this.$refs.region_info.setHighlight(-1)
                    })

                    const pop = new mapboxgl.Popup({
                        offset: [-5, -15]
                    }).setText(loc.title.rendered)

                    const m = new mapboxgl.Marker(el)
                        .setLngLat([loc.longitude, loc.latitude])
                        .setPopup(pop)
                        .addTo(this.map);

                    this.markers.push(m)
                });
                
                return true
            })
        },
        getLocationsInRegion(region_id) {
            return Array.from(
                this.locations.filter((x) => {
                    return x.region.includes(region_id);
                })
            );
        },
        listHighlightEvent(location) {
            const list = document.querySelectorAll(`[data-locationid='${location.id}`)
            for (var i = 0; i < list.length; ++i) {
                list[i].classList.add('highlighted');
            }
        },
        listDeHighlightEvent(location) {
            const list = document.querySelectorAll(`[data-locationid='${location.id}`)
            for (var i = 0; i < list.length; ++i) {
                list[i].classList.remove('highlighted');
            }
        },
        onRegionClick(region) {
            this.$router.push(`/region/${region.slug}`)
        },
        navigateToRegion(region_slug) {
            if ( this.selectedRegionSlug ) {
                return false;
            }

            const region = this.regions.find(x => x.slug == region_slug)

            if ( !region ) {
                return;
            }

            let startLocObj = null


            this.selectedRegionSlug = region.slug;
            
            let ease_to_config = {
                center: this.zoom_to_coordinate_mappings[region.slug],
                zoom: 9,
                duration: 1000,
            }

            if ( this.isSM || this.isXS ) {
                ease_to_config.zoom = 8,
                ease_to_config.center = this.getMobileAdjustedCenterForRegion(region.slug)
            }

            this.map.easeTo(ease_to_config);

            const locationsInRegion = this.$store.getters.getLocationsForRegion( region.id );

            locationsInRegion.forEach((loc) => {
                const circle = document.createElement("div");
                circle.className = "circle";

                const inner_circle = document.createElement("div");
                inner_circle.className = "inner_circle";
                
                circle.appendChild(inner_circle);

                // Marker container.
                const el = document.createElement("div");
                el.appendChild(circle);
                el.className = "marker";
                el.style.width = "30px";
                el.style.height = "30px";
                el.dataset.locationid = loc.id

                el.addEventListener('mouseenter', () => {
                    el.classList.add('highlighted')
                    this.$refs.region_info.setHighlight(this.locations.indexOf(loc))
                })

                el.addEventListener('mouseleave', () => {
                    el.classList.remove('highlighted')
                    this.$refs.region_info.setHighlight(-1)
                })

                const pop = new mapboxgl.Popup({
                    offset: [-5, -15]
                }).setText(loc.title.rendered)

                const m = new mapboxgl.Marker(el)
                    .setLngLat([loc.longitude, loc.latitude])
                    .setPopup(pop)
                    .addTo(this.map);

                this.markers.push(m)

                if ( loc.slug == this.startLocation ) {
                    startLocObj = loc
                }
            });

            if ( !this.startLocation && !startLocObj ) {
                this.setTabContent(locationsInRegion[0])
                locationEventBus.$emit('region-selected', region)
                this.$refs.region_info.openFlyout(region, locationsInRegion)
            } else {
                locationEventBus.$emit('region-selected', region)
                this.$refs.region_info.openFlyoutWithLocation(region, locationsInRegion, startLocObj)
            }
            
            return true
        },

        onInitializedWithLocation() {
            if ( this.startLocation ) {
                const location = this.locations.find( x => x.slug == this.startLocation )
                if ( location && Array.isArray(location.region) && location.region.length > 0 ) {
                    const region = this.regions.find( x => x.id == location.region[0] )
                    if ( region ) {
                        console.log('navigating for on initialized with location')
                        this.onRegionClick(region)
                    }
                }
            }
        },

        getMobileAdjustedCenterForRegion(region_slug) {
            return [
                this.zoom_to_coordinate_mappings[region_slug][0] + 0.4,
                this.zoom_to_coordinate_mappings[region_slug][1] - 0.2,
            ]
        },

        restoreMapIntroduction() {
            if ( window.location.pathname === '/' ) {
                this.selectedRegionSlug = ""
                this.markers.forEach((m) => {
                    m.remove()
                })
                this.markers = []
                this.map.easeTo({
                    center: this.initialMapConfig.center,
                    zoom: this.initialMapConfig.zoom,
                    duration: 1000,
                });
                this.$refs.region_info.navigateToStep(0)
                this.$emit('mapRestoreIntroductoryContent')
            }
            
        },

        addEcoregionsRasterOverlay() {
            this.map.addSource('ecoregions-raster', {
                'type': 'image',
                'url': '/img/ecoregions_notowns_whitechromad.png',
                'coordinates': [
                    [ -73.81504408634417, 42.092473886621255], // Top Left
                    [ -71.47298451603167, 42.092473886621255], // Top Right
                    [ -71.47298451603167, 40.71956334270866], // Bottom Right
                    [ -73.81504408634417, 40.71956334270866], // Bottom Left
                ]
            })
            this.map.addLayer({
                id: 'ecoregions-raster-layer',
                type: 'raster',
                source: 'ecoregions-raster',
                paint: {
                    'raster-fade-duration': 0,
                    'raster-opacity': 0.5
                }
            })
        },

        addGeologicalFeaturesRaster() {
            this.map.addSource('geological-raster-marble_valley', {
                'type': 'image',
                'url': '/img/marble_valley.svg',
                'coordinates': [
                    [ -73.81504408634417, 42.092473886621255], // Top Left
                    [ -71.47298451603167, 42.092473886621255], // Top Right
                    [ -71.47298451603167, 40.71956334270866], // Bottom Right
                    [ -73.81504408634417, 40.71956334270866], // Bottom Left
                ]
            })

            this.map.addLayer({
                id: 'geological-raster-marble_valley-layer',
                type: 'raster',
                source: 'geological-raster-marble_valley',
                paint: {
                    'raster-fade-duration': 0,
                    'raster-opacity': 0.5
                }
            })
        },

        describeLayers() {
            console.log(this.map.getSource('fixed-clean-2xbu8z'))
            console.log(this.map.getLayer('ct-town-county-shapes'))
        },

        addTownLabels() {
            if ( this.showTowns ) {
                // let id = 'fixed-clean-2xbu8z'
                console.log(this.map.getSource('composite'))
                console.log(this.map.getSource('uconndxgroup.85w0ilii'))
                // this.map.addLayer({
                //     id: 'townLabels',
                //     type: 'symbol',
                //     source: ''
                // })
            }
        },
        toggleLayer(layerName) {
            // this.toggleLayerState[layerName] = !this.toggleLayerState[layerName]
            console.log(layerName)
            console.log(this.toggleLayers[layerName])
            console.log(this.toggleLayers)

            if ( this.toggleLayerState[layerName] ) {
                if ( Array.isArray(this.toggleLayers[layerName]) ) {
                    this.toggleLayers[layerName].forEach(x => this.map.setLayoutProperty(x,'visibility','visible'))
                } else {
                    this.map.setLayoutProperty(this.toggleLayers[layerName],'visibility','visible')
                }
                
            } else {
                if ( Array.isArray(this.toggleLayers[layerName]) ) {
                    this.toggleLayers[layerName].forEach(x => this.map.setLayoutProperty(x,'visibility','none'))
                } else {
                    this.map.setLayoutProperty(this.toggleLayers[layerName],'visibility','none')
                }
            }
        }
    },
    mounted() {
        this.fetchMinimumData();
        this.initializeMap();
    },
    watch: {
        '$route.path': function(val) {
            console.log('$route.path changed')
            if ( val === '/' ) {
                this.restoreMapIntroduction()
            } else if ( val.startsWith('/region') ) {
                console.log('navigating to region')
                this.navigateToRegion(this.$route.params.region)
            }
        }
    }
};
</script>

<style>
/* @import '~mapbox-gl/dist/mapbox-gl.css'; */
/* For some reason, the above causes issues in some ad blockers (uBlock Origin).  It tries to throw like custom analytics events which prevents load. */
@import "https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css";
#main-mapbox {
    min-height: 800px;
}

.circle {
    border-radius: 50%;
    position: relative;
    width: 20px;
    height: 20px;
    background-color: white;
    transition: transform 0.2s;
}

.highlighted .circle {
    transform: scale(1.5);
    transform-origin: center center;
}
.highlighted .inner_circle {
    transform: scale(1.3) translate(38%, 38%);
    transform-origin: center center;
}

.inner_circle {
    border-radius: 50%;
    background-color: #628547;
    transform: translate(48%, 48%);
    width: 10px;
    height: 10px;
    transition: transform 0.2s;
}

.component-map {
    position: relative;
}
</style>

<style scoped>
.info-alert {
    background-color: rgba(37, 59, 80, 0.8);
    font-size: 16px;
    color: white;
    display: inline-block;
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 1;
    padding-left: 35px;
    padding-right: 35px;
}
</style>

<style lang="scss" scoped>
.mapLayerToggle {
    z-index: 9999;
    right: 50px;
    position: absolute;
    bottom: 50px;
}

@media #{map-get($display-breakpoints, 'md-and-down')} {
    #main-mapbox {
        min-height: 75vh;
    }

    .mapLayerToggle {
        bottom: 101vh;
    }
}

</style>