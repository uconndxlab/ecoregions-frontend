<template>
  <div class="page-home">
    <h1>Home</h1>
    <region-map></region-map>
  </div>
</template>

<script>
import RegionMap from '@/components/RegionMap.vue'

export default {
  components: {
    RegionMap,
  },
  data: () => {
    return {}
  }
}
</script>