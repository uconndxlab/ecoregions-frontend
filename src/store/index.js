import Vue from 'vue'
import Vuex from 'vuex'
import { ecoregions as ecoconstants } from '@/constants/ecoregions'
import axios from 'axios'

Vue.use(Vuex)

const initialState = () => {
    return {
        locations: [],
        regions: [],
        content_tabs: [{
            title: 'Introduction',
            content: `<h3>An Introduction to Ecological Regions and Geological Features of Connecticut</h3>
            <p>From one corner to another …… observant passengers traveling in a vehicle following a diagonal route from the town of Stonington, along the southeastern coast of the state, to the town of Salisbury, in the northwestern corner, would notice a myriad of changes as they traverse the landscape.  From standing on the shore and gazing out over Long Island Sound, our travelers would leave the ocean-scented air of the coast, and rise in elevation from less than 100 feet to over 1,500 feet.  They would drive through rural, suburban and urban communities. And, although they would travel through many acres of forest, the presence of numerous stone walls would serve as a reminder of a not-so-distant past when trees did not dominant the land.</p>`
        }],
        content_location:  null,
        geological_features: [],
        habitats: [],
        subjects: [],
        explorations: [],
        filter: {
            subject: [],
            habitat: []
        }
    }
}

export default new Vuex.Store({
    state: initialState(),
    getters: {
        getLocations(state) {
            return state.locations
        },
        getRegions(state) {
            return state.regions
        },
        getContentTabs(state) {
            return state.content_tabs
        },
        // Not instance, so no caching on this.
        getLocationsForRegion: (state) => (region_id) => {
            return state.locations.filter((x) => {
                return x.region.includes(region_id);
            })
        },
        getContentLocation(state) {
            return state.content_location
        },
        getGeologicalFeatures(state) {
            return state.geological_features
        },
        getHabitats(state) {
            return state.habitats
        },
        getHabitatsDropdownItems(state) {
            return state.habitats.map(x => {
                return {
                    name: x.name,
                    value: x.id
                }
            })
        },
        getSubjects(state) {
            return state.subjects
        },
        getSubjectsDropdownItems(state) {
            return state.subjects.map(x => {
                return {
                    name: x.name,
                    value: x.id
                }
            })
        },
        getExplorations(state) {
            return state.explorations
        },
        getFilter(state) {
            return state.filter
        }
    },
    mutations: {
        SET_LOCATIONS(state, val) {
            state.locations = val
        },
        SET_REGIONS(state, val) {
            state.regions = val
        },
        SET_CONTENT_TABS(state, val) {
            state.content_location = {}
            state.content_tabs = val
        },
        REPLACE_CONTENT_TAB(state, val) {
            state.content_tabs.forEach((tab, index) => {
                if ( tab.title === val.title ) {
                    state.content_tabs[index] = val
                }
            })
        },
        SET_CONTENT_LOCATION(state, val) {
            state.content_location = JSON.parse(JSON.stringify(val))
            state.content_tabs = [{
                title: 'Conversations With',
                content: ''
            },{
                title: 'Further Your Exploration',
                content: ''
            },{
                title: 'Community Content',
                content: ''
            }]
        },
        SET_GEOLOGICAL_FEATURES(state, val) {
            state.geological_features = val
        },
        SET_HABITATS(state, val) {
            state.habitats = val
        },
        SET_SUBJECTS(state, val) {
            state.subjects = val
        },
        SET_EXPLORATIONS(state, val) {
            state.explorations = val
        },
        SET_FILTER(state, { value, which }) {
            if ( state.filter[which] ) {
                state.filter[which] = value
            }
        }
    },
    actions: {
        async fetchRegions({ commit }) {
            try {
                const url = ecoconstants.API_URL + '/region'
                const resp = await axios.get(url)
                if (resp && resp.data) {
                    commit('SET_REGIONS', resp.data)
                    return true
                }
            } catch (error) {
                console.error(error)
                return false
            }
            return false
        },
        async fetchLocations({ commit }) {
            try {
                const url = ecoconstants.API_URL + '/location'
                const resp = await axios.get(url)
                if ( resp && resp.data ) {
                    commit('SET_LOCATIONS', resp.data)
                    return true
                }
            } catch (error) {
                console.error(error)
                return false
            }
            return false
        },
        async fetchGeologicalFeatures({ commit }) {
            try {
                const url = ecoconstants.API_URL + '/geological_feature'
                const resp = await axios.get(url)
                if ( resp && resp.data ) {
                    commit('SET_GEOLOGICAL_FEATURES', resp.data)
                    return true
                }
            } catch (error) {
                console.error(error)
                return false
            }
            return false
        },
        async fetchHabitats({ commit }) {
            try {
                const url = ecoconstants.API_URL + '/habitat'
                const resp = await axios.get(url)
                if ( resp && resp.data ) {
                    commit('SET_HABITATS', resp.data)
                    return true
                }
            } catch(error) {
                console.error(error)
            }
            return false
        },
        async fetchSubjects({ commit }) {
            try {
                const url = ecoconstants.API_URL + '/subject'
                const resp = await axios.get(url)
                if ( resp && resp.data ) {
                    commit('SET_SUBJECTS', resp.data)
                    return true
                }
            } catch(error) {
                console.error(error)
            }
            return false
        },
        async fetchExplorations({ commit, state }, useFilter = false) {
            try {
                let url = ecoconstants.API_URL + '/exploration'

                if ( useFilter ) {
                    let query = '?'
                    let count = 0
                    for ( const [index, val] of Object.entries(state.filter)) {
                        val.forEach((id) => {
                            if ( count > 0 ) {
                                query += '&'
                            }
                            query += `${index}[]=${id}`
                            count++
                        })
                    }
                    url += query
                }

                const resp = await axios.get(url)
                if ( resp && resp.data ) {
                    commit('SET_EXPLORATIONS', resp.data)
                    return true
                }
            } catch(error) {
                console.error(error)
            }
            return false
        },
        async fetchPageContentForTabs({ commit, dispatch }, requests = [] ) {
            const content_response = await dispatch('fetchPageContent', requests)

            if ( content_response ) {
                console.log(requests)
                console.log(content_response)
                commit('SET_CONTENT_TABS', content_response)
                return true
            }
            return false
        },
        async fetchPageContent(context, requests = []) {
            if ( requests.length > 0 ) {
                let request_slug_string = requests.join(',')
                let content_keys = requests
                let content = []

                try {
                    const url = ecoconstants.API_URL + '/pages?slug=' + request_slug_string
                    const resp = await axios.get(url)

                    if ( resp && resp.data ) {
                        resp.data.forEach((p) => {
                            const i = content_keys.indexOf(p.slug)
                            if ( i > -1 ) {
                                content[i] = {
                                    title: p.title.rendered,
                                    content: p.content.rendered
                                }
                            }
                        })
                    }
                    return content
                } catch (error) {
                    console.error(error)
                    return false
                }
            }
            return false
        },

        async changeFilter({ commit, dispatch }, { value, which }) {
            commit('SET_FILTER', { value, which })
            return await dispatch('fetchExplorations', true)
        }
    }
})
