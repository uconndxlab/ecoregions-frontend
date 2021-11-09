<template>
    <div class="geological-feature-list">
        <h2 v-if="geologicalFeatures" class="mb-4">Explore a Geological Feature</h2>
        <ul v-if="geologicalFeatures">
            <li v-for="geo in geologicalFeatures" :key="`geo-list-${geo.id}`" class="mb-2">
                <!-- <router-link :to="`/region/${geo.slug}`">{{ geo.name }}</router-link> -->
                {{ geo.name }}
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            geologicalFeatures: 'getGeologicalFeatures'
        })
    }
}
</script>

<style lang="scss" scoped>
.geological-feature-list {
    padding-top: 50px;
    ul {
        list-style-type: none;
        padding-left: 0;
    }
} 
</style>