<template>
    <div class="left-content-block">
        <div class="left-content-block-content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.left-content-block {
    max-height: 100%;
    min-height: 100%;
    background: rgba(37, 59, 80, 0.9);
    width: 700px;
    color: white;
    padding: 30px;
    display: flex;
    flex-direction:column;
    position: relative;
    
    p, strong, li {
        color: white;
    }

    .left-content-block-content {
        flex-grow: 1;
        flex-basis: 1;
        margin-top: 125px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

@media #{map-get($display-breakpoints, 'md-and-down')} {
    .left-content-block {
        width: 100%;
    }
}
</style>