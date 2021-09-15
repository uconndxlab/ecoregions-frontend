<template>
    <div class="content-tabs" v-if="content_tabs">
        <v-tabs
            v-model="current_tab"
            centered
            class="content-tabs-tabselect mb-10"
            background-color="transparent"
            @change="onTabChange"
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

        <v-container>
            <v-row align="center" justify="center" v-if="!contentIsGeneral">
                <v-col md="6">
                    <location-list></location-list>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col>
                    <v-tabs-items v-model="current_tab">
                        <v-tab-item v-for="ct in content_tabs" :key="`tabcontent-` + ct.title">
                            <div v-html="ct.content" class="tab-content" v-if="contentIsGeneral"></div>

                            <div v-if="!contentIsGeneral && ct.title === 'Conversations With'">
                                <h2 class="mb-6">Conversations</h2>
                                <v-row
                                    v-for="conv in content_location.conversations"
                                    :key="`conv-${conv.id}`"
                                >
                                    <v-col md="6">
                                        <p>{{ conv.speaker }}</p>
                                        <h3>{{ conv.post_title }}</h3>
                                        <p>{{ conv.post_content }}</p>
                                    </v-col>
                                    <v-col md="6">
                                        <iframe
                                            v-if="conv.video_link"
                                            width="560"
                                            height="315"
                                            :src="youtubeEmbedLink(conv.video_link)"
                                            frameborder="0"
                                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen
                                        ></iframe>
                                    </v-col>
                                </v-row>

                                <v-row v-if="!content_location.conversations">
                                    <v-col>
                                        <p>No conversations for this location yet.  Stay tuned!</p>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="!contentIsGeneral && ct.title === 'Further Your Exploration'">
                                <h2 class="mb-6">Exploration</h2>

                                <v-row
                                    v-for="expl in content_location.explorations"
                                    :key="`expl-${expl.id}`"
                                >
                                    <v-col md="4">
                                        <h3>{{ expl.post_title }}</h3>
                                    </v-col>
                                    <v-col md="8">
                                        <p>{{ expl.post_content }}</p>
                                    </v-col>
                                </v-row>

                                <v-row v-if="!content_location.explorations">
                                    <v-col>
                                        <p>No explorations for this location yet.  Stay tuned!</p>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="!contentIsGeneral && ct.title === 'Community Content'">
                                <h2 class="mb-6">Community Content</h2>
                                <p>Coming soon.</p>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-container>

        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LocationList from '@/components/LocationList.vue'

export default {
    components: { LocationList },
    props: {
        requests: Array
    },
    data: () => {
        return {
            current_tab: 0,
            show_locations: true,
            current_content_tabs_length: 0
        }
    },
    computed: {
        ...mapGetters({
            content_tabs: 'getContentTabs',
            content_location: 'getContentLocation'
        }),
        contentIsGeneral() {
            if ( this.content_location && Object.keys(this.content_location).length === 0 ) {
                return true
            }
            return false
        }
    },
    methods: {
        ...mapActions({
            fetchContentForTabs: 'fetchPageContentForTabs'
        }),
        fetchContentBySlugs(slug_array) {
            this.fetchContentForTabs(slug_array)
            this.current_tab = null
        },
        enableLocationList() {
            this.show_locations = true
        },
        disableLocationList() {
            this.show_locations = false
        },
        // This hack is purely to get around the 'automatic scroll to tab' functionality that vuetify has when you dynamically change tabs
        onTabChange() {
            if ( this.current_content_tabs_length !== this.content_tabs.length ) {
                this.$nextTick(() => {
                    this.current_tab = 0
                    this.current_content_tabs_length = this.content_tabs.length
                })
            }
        },
        youtubeEmbedLink( link ) {
            const youtubeEmbedTemplate = 'https://www.youtube.com/embed/'
            const url = link.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
            const YId = undefined !== url[2] ? url[2].split(/[^0-9a-z_/\\-]/i)[0] : url[0]
            if (YId === url[0]) {
                // Not YT video
            } else {
                // Is YT video
                const fullEmbedUrl = youtubeEmbedTemplate.concat(YId)
                return fullEmbedUrl
            }
            return ''
        }
    },
    created() {
        this.current_content_tabs_length = this.content_tabs.length
        if ( this.requests ) {
            console.log(this.requests)
            this.fetchContentForTabs(this.requests)
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