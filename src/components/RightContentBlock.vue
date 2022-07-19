<template>
    <div :class="classes">
        <div class="text-center float-right">
            <v-btn fab small dark color="transparent" @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
        <div class="right-content-block-content">
            <slot />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            open: 'getRightContentOpen'
        }),
        classes() {
            let base = 'right-content-block '
            if ( this.open ) {
                return base
            }
            return 'right-content-block closed'
        }
    },
    methods: {
        ...mapMutations({
            setOpenStatus: 'SET_RIGHT_CONTENT_OPEN'
        }),
        close() {
            this.setOpenStatus(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.right-content-block {
    max-height: 100%;
    min-height: 100%;
    background: #41533b;
    color: white;
    padding: 30px;
    position: relative;
    flex-grow: 2;

    transition: opacity 300ms;

    &.closed {
        opacity: 0;
        pointer-events: none;
    }
    
    p, strong, li {
        color: white;
    }
}

@media #{map-get($display-breakpoints, 'md-and-down')} {
    .right-content-block {
        width: 100%;
    }
}
</style>