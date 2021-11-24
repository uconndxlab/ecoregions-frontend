<template>
    <div class="region-list">
        <h2 v-if="regions" class="mb-4">Explore a Region</h2>
        <ul v-if="regions">
            <li v-for="region in regions" :key="`region-list-${region.id}`" class="mb-2">
                <router-link :to="`/region/${region.slug}`">{{ region.name }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            regions: 'getRegions'
        })
    }
}
</script>

<style lang="scss" scoped>
.region-list {
    padding-top: 50px;
    ul {
        list-style-type: none;
        padding-left: 0;
    }
} 
</style>