<template>
    <div class="exploration-item">
        <div class="exploration-item-content" @click="setSelectedExploration(exploration)">
            <h2 class="mb-2">{{ title }}</h2>
            <div v-html="description"></div>
            <v-btn class="exploration-item-btn mb-2 text--white" dark text>Learn More</v-btn>
        </div>
        <hr style="border-top-width: 1px; border-bottom-width: 0px">
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    props: {
        exploration: {
            type: Object,
            required: true
        }
    },
    computed: {
        title() {
            return this.exploration?.title?.rendered ? this.exploration.title.rendered : 'N/A'
        },
        description() {
            return this.exploration?.excerpt?.rendered ? this.exploration.excerpt.rendered : 'N/A'
        }
    },
    methods: {
        ...mapMutations({
            setSelectedExploration: 'SET_SELECTED_EXPLORATION'
        })
    }
}
</script>

<style>
.exploration-item {
    padding: 10px 20px 0px;
    font-family: 'Open Sans', sans-serif;
}

.exploration-item-content:hover {
    background-color: rgba(255,255,255,0.1);
}

.exploration-item-content {
    padding: 10px;
}

.exploration-item-btn {
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1px;
    margin-left: -17.7px;
}
</style>