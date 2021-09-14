<template>
  <div class="page-home">
    <region-map :start="$route.params.region" @mapRestoreIntroductoryContent="restoreIntroContent()"></region-map>
    <content-tabs ref="cont_tabs"></content-tabs>
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
    //   content_tab_page_slugs: ['introduction', 'about']
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