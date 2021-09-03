<template>
    <div class="component-location-list">
        <h2>Locations</h2>
        <ul v-if="locations">
            <li
                v-for="loc in locations"
                :key="'loc'+loc.id"
            >
                <strong>{{ loc.title.rendered }}</strong>
                <p>{{ loc.flavor_text }}</p>

                <h3>Conversations With</h3>
                <ul v-if="loc.conversations">
                    <li v-for="conv in loc.conversations" :key="'conv'+conv.id">
                        <em>{{ conv.speaker }}</em>
                        <strong>{{ conv.post_title }}</strong>
                        <p>{{ conv.post_content }}</p>
                        <p>{{ conv.video_link }}</p>
                    </li>
                </ul>

                <h3>Further Your Exploration</h3>
                <ul v-if="loc.explorations">
                    <li v-for="expl in loc.explorations" :key="'expl'+expl.id">
                        <strong>{{ expl.post_title }}</strong>
                        <p>{{ expl.post_content }}</p>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: () => {
        return {
            locations: []
        }
    },
    methods: {
        async fetchLocations() {
            try {
                const resp = await axios.get('https://dev-ecoregions.pantheonsite.io/wp-json/wp/v2/location')
                if ( resp && resp.data ) {
                    this.locations = resp.data
                }
            } catch (error) {
                console.error(error)
            }
        }
    },
    mounted() {
        this.fetchLocations()
    }
}
</script>