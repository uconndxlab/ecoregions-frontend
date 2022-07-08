<template>
  <v-app>
    <top-bar></top-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import TopBar from '@/components/TopBar.vue'

export default {
  name: 'App',
  components: {
    TopBar
  },
  data: () => ({
    //
  }),
  methods: {
    ...mapActions({
      fetchHabitats: 'fetchHabitats',
      fetchSubjects: 'fetchSubjects',
      fetchExplorations: 'fetchExplorations',
      fetchRegions: 'fetchRegions'
    })
  },
  created() {
    Promise.all([
      this.fetchHabitats(),
      this.fetchSubjects(),
      this.fetchExplorations(),
      this.fetchRegions()
    ])
  }
};
</script>
