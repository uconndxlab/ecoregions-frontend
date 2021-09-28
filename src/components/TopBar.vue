<template>
    <v-sheet>
        <v-container class="pa-0">
            <v-app-bar
                color="white"
                max-height="90"
                height="82"
                class="ecoregions-top-bar"
                flat
            >
                <v-img
                    max-width="100"
                    max-height="50"
                    src="@/assets/images/csmnh_logo_verytiny.jpg"
                    contain
                    class="ecoregions-top-bar-icon"
                />
                    
                <v-toolbar-title class="ecoregions-top-bar-title ml-2">Connecticut State Museum of Natural History&nbsp;&nbsp;|&nbsp;&nbsp;University of Connecticut</v-toolbar-title>
            </v-app-bar>
        </v-container>
    </v-sheet>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.ecoregions-top-bar {
    .ecoregions-top-bar-title {
        font-family: 'Raleway', sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 21px;

        @media #{map-get($display-breakpoints, 'md-and-down')} {
            font-size: 14px;
            white-space:normal;
            text-overflow: initial;
        }
    }
}
</style>