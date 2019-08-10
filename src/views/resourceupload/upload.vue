<template>
    <el-row>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">资源上传</a>
        </el-col>
        <div class="ecrm-upload-cond">
            <div class="ecrm-upload-wrap">
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step1' }">
                    <div class="ecrm-step-num">1</div>
                    <div class="ecrm-step-desc">上传文件</div>
                </div>
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step2' }">
                    <div class="ecrm-step-num">2</div>
                    <div class="ecrm-step-desc">完善属性</div>
                </div>
                <div class="ecrm-upload-step" :class="{ 'ecrm-upload-sel':$route.path=='/upload/step3' }">
                    <div class="ecrm-step-num">3</div>
                    <div class="ecrm-step-desc">完成上传</div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <el-col :span="24" class="main">
            <section>
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        mounted() {
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';
    
</style>