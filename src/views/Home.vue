<template>
  <div class="page-home">
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

<style>
/* Temporarily using this for global styles.  variables.scss is for vuetify overrides and not regular styles. */
.v-btn:not(.v-btn--round).v-size--default {
  padding-left: 35px;
  padding-right: 35px;
}
</style>