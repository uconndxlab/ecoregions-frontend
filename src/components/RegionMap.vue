<template>
    <div class="component-map">
        <h2>Regions</h2>
        <ul v-if="mapRegions">
            <li
                v-for="region in mapRegions"
                :key="region.id"
            >
                <strong>{{ region.name }}</strong>
                <p>{{ region.overview }}</p>
            </li>
        </ul>
        <p v-else>No regions.</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => {
        return {
            mapRegions: []
        }
    },
    methods: {
        async fetchMapRegions() {
            try {
                const resp = await axios.get('https://dev-ecoregions.pantheonsite.io/wp-json/wp/v2/region')
                if ( resp && resp.data ) {
                    this.mapRegions = resp.data
                }
            } catch (error) {
                console.error(error)
            }
            
        }
    },
    mounted() {
        this.fetchMapRegions()
    }
}
</script>