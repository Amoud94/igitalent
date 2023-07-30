<template>
    <div>
        <Loading :isActive="loadingOverlay" />
        <RouterView />
    </div>
</template>

<script>
export default {
    name: 'full-screen-layout',
    data() {
        return {
        }
    },
    computed: {
        loadingOverlay() {
            return this.$store.state.loadingOverlay
        },
    },
}
</script>