<template>
  <div class="page-home">
    <region-map :start-region="$route.params.region" :start-location="$route.params.location" @mapRestoreIntroductoryContent="restoreIntroContent()"></region-map>
    <content-tabs :requests="content_tab_page_slugs" ref="cont_tabs"></content-tabs>
    <ecoregions-footer></ecoregions-footer>
  </div>
</template>

<script>
import RegionMap from '@/components/RegionMap.vue'
import ContentTabs from '@/components/ContentTabs.vue'
import EcoregionsFooter from '@/components/Footer.vue'

export default {
  components: {
    RegionMap,
    ContentTabs,
    EcoregionsFooter
  },
  data: () => {
    return {
      content_tab_page_slugs: ['introduction']
    }
  },
  methods: {
    restoreIntroContent() {
      this.$refs.cont_tabs.fetchContentBySlugs(['introduction'])
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