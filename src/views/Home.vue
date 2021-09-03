<template>
  <div class="page-home">
    <h1>Home</h1>
    <region-map></region-map>
    <location-list></location-list>
  </div>
</template>

<script>
import RegionMap from '@/components/RegionMap.vue'
import LocationList from '@/components/LocationList.vue'

export default {
  components: {
    RegionMap,
    LocationList
  },
  data: () => {
    return {}
  }
}
</script>