<template>
    <section>
        <el-button v-for="(item , idx) in items" 
            :key="idx" 
            :data="item" 
            type="bgsmall" 
            :class="{ 'el-button-selected':item === selected}" 
            @click="handleClick(item)">
            {{item.dictname}}
        </el-button>
    </section>
</template>

<script>
    export default {
        props: {
            items:Array,
        },
        watch: {
        },
        data: function () {
            return {
                selected: null,
            }
        },
        computed: {
        },
        methods: {
            handleClick(val) {
                this.selected = val;
                this.$emit('button-click', val);
              }
        }
    }
</script>
<style scoped lang="scss">
    @import '~scss_vars';
</style>