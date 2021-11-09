<template>
    <div class="content-tabs" v-if="content_tabs">
        <v-tabs
            v-model="current_tab"
            centered
            :show-arrows="'mobile'"
            class="content-tabs-tabselect mb-md-10"
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

        <v-container class="tab-content-container">
            <v-row align="center" justify="center" v-show="!contentIsGeneral" >
                <v-col md="6">
                    <location-list></location-list>
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col>
                    <v-tabs-items v-model="current_tab">
                        <v-tab-item v-for="ct in content_tabs" :key="`tabcontent-` + ct.title">
                            <div v-html="ct.content" class="tab-content" v-if="contentIsGeneral"></div>

                            <region-list></region-list>

                            <div v-if="!contentIsGeneral && ct.title === 'Conversations With'" class="tab-content">
                                <template v-for="(conv, index) in content_location.conversations">
                                    <v-row
                                        
                                        :key="`conv-${conv.id}`"
                                    >
                                        <v-col md="6" cols="12">
                                            <p class="speaker-byline">{{ conv.speaker }}</p>
                                            <h3>{{ conv.post_title }}</h3>
                                            <div class="limited-height" v-html="$options.filters.cleanContent(conv.post_content)"></div>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col md="5" cols="12">
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

                                    <v-divider :key="`convdiv-${conv.id}`" v-if="index < content_location.conversations.length - 1" />
                                </template>

                                <v-row v-if="!content_location.conversations">
                                    <v-col>
                                        <p>No conversations for this location yet.  Stay tuned!</p>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="!contentIsGeneral && ct.title === 'Further Your Exploration'" class="tab-content">
                                <template
                                    v-for="(expl, index) in content_location.explorations"
                                >
                                    <v-row
                                        :key="`expl-${expl.id}`"
                                        class="exploration-content-row mt-6 mb-3"
                                    >
                                        <v-col md="4" cols="12">
                                            <h3>{{ expl.post_title }}</h3>
                                        </v-col>
                                        <v-col md="8" cols="12">
                                            <div v-html="$options.filters.cleanContent(expl.post_content)"></div>
                                        </v-col>
                                    </v-row>
                                    <v-divider :key="`expldiv-${expl.id}`" v-if="index < content_location.explorations.length - 1" />
                                </template>

                                <v-row v-if="!content_location.explorations">
                                    <v-col>
                                        <p>No explorations for this location yet.  Stay tuned!</p>
                                    </v-col>
                                </v-row>
                            </div>

                            <div v-if="!contentIsGeneral && ct.title === 'Community Content'" class="tab-content">
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
import RegionList from '@/components/RegionList.vue'

export default {
    components: { 
        LocationList,
        RegionList
    },
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
    padding: 50px 0;
    min-height: 400px;
}

.tab-content-container {
    padding-left: 20px;
    padding-right: 20px;
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

.tab-content h3 {
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 40px;
}

.tab-content p {
    font-size: 16px;
    line-height: 32px;
}

.tab-content div.limited-height {
    max-height: 300px;
    overflow-y: scroll;
}

.tab-content p.speaker-byline {
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    line-height: 19px;
    font-weight: 600;
    margin-bottom: 20px;
}
</style>

<style lang="scss" scoped>
@media #{map-get($display-breakpoints, 'md-and-down')} {
    .content-tabs {
        margin-top: 0;
    }

    .content-tabs-tab {
        font-size: 16px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .tab-content {
        padding-top: 10px;
        h3 {
            margin-bottom: 16px;
        }
    }
}
</style>

<style lang="scss">
.tab-content {
    h1,h2,h3,h4,h5,h6 {
        margin-bottom: 24px;
    }

    ul,ol {
        margin-bottom: 20px;
    }

    li {
        line-height: 32px;
    }

    @each $size, $props in $headings {
        #{$size} {
            font-size: #{map-get($props, 'size')};
            font-weight: #{map-get($props, 'weight')};
            line-height: #{map-get($props, 'line-height')};
            font-family: #{map-get($props, 'font-family')};
        }
    }
}



@media #{map-get($display-breakpoints, 'md-and-down')} {
    .content-tabs-tabselect {
        .v-slide-group__content {
            padding-right: 10px;
            padding-left: 10px;
            // margin-left: 0;
        }
        .v-slide-group--is-overflowing {
            .v-slide-group__content {
                margin-left: 0;
            }
        }
    } 
}
</style>