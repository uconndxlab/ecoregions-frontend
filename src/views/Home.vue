<template>
  <div class="page-home">
    <region-map></region-map>
    <content-tabs :requests="content_tab_page_slugs"></content-tabs>
  </div>
</template>

<script>
import RegionMap from '@/components/RegionMap.vue'
import ContentTabs from '@/components/ContentTabs.vue'

export default {
  components: {
    RegionMap,
    ContentTabs
  },
  data: () => {
    return {
      content_tab_page_slugs: ['introduction', 'about']
    }
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