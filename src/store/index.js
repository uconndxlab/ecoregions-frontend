import Vue from 'vue'
import Vuex from 'vuex'
import { ecoregions as ecoconstants } from '@/constants/ecoregions'
import axios from 'axios'

Vue.use(Vuex)

const initialState = () => {
    return {
        locations: [],
        regions: []
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
        }
    },
    mutations: {
        SET_LOCATIONS(state, val) {
            state.locations = val
        },
        SET_REGIONS(state, val) {
            state.regions = val
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
        }
    }
})
