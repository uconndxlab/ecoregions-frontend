<template>
    <div class="region-list">
        <ul v-if="regions">
            <li v-for="region in regions" :key="`region-list-${region.id}`">
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