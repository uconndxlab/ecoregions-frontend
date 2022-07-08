<template>
    <div class="exploration-item">
        <h2>{{ title }}</h2>
        <div v-html="description"></div>
        <v-btn class="mb-2" text>Learn More</v-btn>
        <hr>
    </div>
</template>

<script>
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
            return this.exploration?.excerpt?.rendered ? this.exploration.excerpt.rendered : 'N/A/'
        }
    }
}
</script>

<style>
.exploration-item {
    padding: 20px 20px 0px;
}
</style>