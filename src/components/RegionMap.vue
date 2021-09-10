<template>
    <div class="component-map">
        <region-info ref="region_info"></region-info>
        <div id="main-mapbox"></div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mapboxgl from "mapbox-gl";
import RegionInfo from '@/components/RegionInfo.vue'

export default {
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
        };
    },
    computed: {
        ...mapGetters({
            regions: "getRegions",
            locations: "getLocations",
        }),
    },
    methods: {
        ...mapActions({
            fetchRegions: "fetchRegions",
            fetchLocations: "fetchLocations",
        }),
        fetchMinimumData() {
            if (Array.isArray(this.regions) && !this.regions.length) {
                this.fetchRegions()
                    .then((resp) => {
                        console.log(resp);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            if (Array.isArray(this.locations) && !this.locations.length) {
                this.fetchLocations()
                    .then((resp) => {
                        console.log(resp);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        initializeMap() {
            mapboxgl.accessToken =
                "pk.eyJ1IjoidWNvbm5keGdyb3VwIiwiYSI6ImNrcTg4dWc5NzBkcWYyd283amtpNjFiZXkifQ.iGpZ5PfDWFWWPkuDeGQ3NQ";
            this.map = new mapboxgl.Map({
                container: "main-mapbox",
                style: "mapbox://styles/mapbox/outdoors-v11",
                center: [-72.7457, 41.6215],
                zoom: 8,
            });

            this.map.on("load", () => {
                if (Array.isArray(this.regions)) {
                    this.regions.forEach((region) => {
                        const coords =
                            this.region_coordinate_mappings[region.slug];
                        const centerpoint =
                            this.zoom_to_coordinate_mappings[region.slug];
                        if (coords && centerpoint) {
                            this.addMapPolygon(region, coords, centerpoint);
                        }
                    });
                }
            });
        },
        addMapPolygon(region, coordinates, centerpoint) {
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
                if (this.selectedRegionSlug !== region.slug) {
                    this.selectedRegionSlug = region.slug;
                    this.map.easeTo({
                        center: centerpoint,
                        zoom: 9,
                        duration: 1000,
                    });

                    const locationsInRegion = this.getLocationsInRegion(
                        region.id
                    );

                    this.$refs.region_info.openFlyout(region, locationsInRegion)

                    locationsInRegion.forEach((loc) => {
                        console.log("adding marker");
                        const circle = document.createElement("div");
                        const inner_circle = document.createElement("div");
                        circle.className = "circle";
                        inner_circle.className = "inner_circle";
                        circle.appendChild(inner_circle);
                        const el = document.createElement("div");
                        el.appendChild(circle);
                        el.className = "marker";
                        el.style.width = "30px";
                        el.style.height = "30px";

                        new mapboxgl.Marker(el)
                            .setLngLat([loc.longitude, loc.latitude])
                            .addTo(this.map);
                    });
                }
            });
        },
        getLocationsInRegion(region_id) {
            return Array.from(
                this.locations.filter((x) => {
                    return x.region.includes(region_id);
                })
            );
        },
    },
    mounted() {
        this.fetchMinimumData();
        this.initializeMap();
    },
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
}

.inner_circle {
    border-radius: 50%;
    background-color: #628547;
    transform: translate(48%, 48%);
    width: 10px;
    height: 10px;
}

.component-map {
    position: relative;
}
</style>