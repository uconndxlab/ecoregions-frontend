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
        content_location:  null
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
        async fetchPageContentForTabs({ commit }, requests = [] ) {
            if ( requests.length > 0 ) {
                let request_slug_string = requests.join(',')
                let tab_objects = requests
                try {
                    const url = ecoconstants.API_URL + '/pages?slug=' + request_slug_string
                    const resp = await axios.get(url)
                    if ( resp && resp.data ) {
                        resp.data.forEach((p) => {
                            const i = requests.indexOf(p.slug)
                            if ( i > -1 ) {
                                tab_objects[i] = {
                                    title: p.title.rendered,
                                    content: p.content.rendered
                                }
                            }
                            
                        })
                        commit('SET_CONTENT_TABS', tab_objects)
                        return true
                    }
                } catch (error) {
                    console.error(error)
                    return false
                }
            }
            return false
        }
    }
})
