<template>
    <section>
        <img :src="url"></img>
    </section>
</template>

<script>
    export default {
        props: {
            path: String
        },
        computed: {
            url() {
                return ECO_MEDIA_PATH + this.path;
            }
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
    img {
        width:100%;
        height: 100%;
    }
</style>