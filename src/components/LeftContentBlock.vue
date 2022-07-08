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

<style scoped>
.left-content-block {
    max-height: 100%;
    background: rgba(37, 59, 80, 0.9);
    width: 50%;
    color: white;
    padding: 10px;
}

.left-content-block p,
.left-content-block strong,
.left-content-block li {
    color: white;
}
</style>