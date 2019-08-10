<template>
    <section>
        <div class="ecrm-upload-resource-contain">
            <span class="ecrm-upload-resource-contain-wrap">
                <span v-for="(model, index) in models" :key="index" :data="model" class="ecrm-upload-resource-class" v-show="model.label != null">{{ model.label }}</span>
            </span>
            <a href="javascript:;" class="ecrm-upload-resource-icon"></a>
        </div>
    </section>
</template>

<script>
    export default {
        props: {
            models: Array,
        },
        watch: {
        },
        data: function () {
            return {
            }
        },
        computed: {
        },
        methods: {
        }
    }
</script>
<style scoped lang="scss">
// Author : GOD
// Date Start : 2019-2-11 12:00 PM
// Reason : Bug ID 632
    .ecrm-upload-resource-contain{width:calc(100% - 40px);border:1px solid #c8c6c4;min-height:35px;height: auto;line-height:35px;float:left;padding:0px 20px 0px 20px;position:relative; border-radius:5px;}
// Author : GOD
// Date End : 2019-2-11 12:20 PM
// Reason : Bug ID 632
    .ecrm-upload-resource-class{padding-right:15px;margin-right:5px;background:url('../../../../static/img/ecr-dot-right.png') no-repeat right center;}
    .ecrm-upload-resource-icon{display:block;width:30px;height:30px;background:url('../../../../static/img/ecr-arr-up.png') no-repeat center center;position:absolute;right:2px;top:2px;}
    .ecrm-upload-resource-icon:hover{background:url('../../../../static/img/ecr-arr-up-sel.png') no-repeat center center;}
    .ecrm-nobackground{background:none;}
</style>