<template>
    <div class="content-tabs">
        <v-tabs
            v-model="current_tab"
            centered
            class="content-tabs-tabselect"
            background-color="transparent"
        >
            <v-tabs-slider color="transparent"></v-tabs-slider>

            <template v-for="(ct, index) in content_tabs">
                <v-tab
                    :key="`tab-` + ct.title"
                    class="content-tabs-tab"
                >{{ ct.title }}</v-tab>
                <div class="tab-divider" :key="`tab-divide`+ct.title" v-if="index < content_tabs.length - 1"></div>
            </template>
            
        </v-tabs>

        <v-tabs-items v-model="current_tab">
            <v-tab-item v-for="ct in content_tabs" :key="`tabcontent-` + ct.title">
                <div v-html="ct.content" class="tab-content"></div>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            current_tab: null,
            content_tabs: [
                {
                    title: 'Introduction',
                    content: `<h3>An Introduction to Ecological Regions and Geological Features of Connecticut</h3>
                    <p>From one corner to another …… observant passengers traveling in a vehicle following a diagonal route from the town of Stonington, along the southeastern coast of the state, to the town of Salisbury, in the northwestern corner, would notice a myriad of changes as they traverse the landscape.  From standing on the shore and gazing out over Long Island Sound, our travelers would leave the ocean-scented air of the coast, and rise in elevation from less than 100 feet to over 1,500 feet.  They would drive through rural, suburban and urban communities. And, although they would travel through many acres of forest, the presence of numerous stone walls would serve as a reminder of a not-so-distant past when trees did not dominant the land.</p>`
                },
                {
                    title: 'Introduction Two',
                    content: `<h3>An Introduction to Ecological Regions and Geological Features of Connecticut</h3>
                    <p>From one corner to another …… observant passengers traveling in a vehicle following a diagonal route from the town of Stonington, along the southeastern coast of the state, to the town of Salisbury, in the northwestern corner, would notice a myriad of changes as they traverse the landscape.  From standing on the shore and gazing out over Long Island Sound, our travelers would leave the ocean-scented air of the coast, and rise in elevation from less than 100 feet to over 1,500 feet.  They would drive through rural, suburban and urban communities. And, although they would travel through many acres of forest, the presence of numerous stone walls would serve as a reminder of a not-so-distant past when trees did not dominant the land.</p>`
                }
            ]
        }
    }
}
</script>

<style scoped>
.content-tabs {
    margin-top: -60px; /* 77 height - 18 offset in design */
    z-index: 1000;
    position:relative;
}

.content-tabs-tab {
    background-color: white;
    text-transform: none;
    font-family: 'Raleway', sans-serif;
}

.tab-divider {
    height: 100%;
    width: 1px;
    background-color: rgba(55, 64, 68, 0.37);
}

.tab-content {
    padding: 50px;
}
</style>

<style>
.content-tabs-tabselect .v-slide-group__content {
    margin-left: auto;
    margin-right: auto;
    flex-grow:0;
    background-color: white;
    padding: 16px 30px;
    border-radius: 6px;
}
</style>