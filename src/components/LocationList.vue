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
import { mapGetters, mapActions } from 'vuex'

export default {
    data: () => {
        return {}
    },
    computed: {
        ...mapGetters({
            locations: 'getLocations'
        })
    },
    methods: {
        ...mapActions({
            fetchLocations: 'fetchLocations'
        }),
        fetchMinimumData() {
            if ( Array.isArray(this.locations) && !this.locations.length ) {
                this.fetchLocations().then((resp) => {
                    console.log(resp)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    },
    mounted() {
        this.fetchMinimumData()
    }
}
</script>