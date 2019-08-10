<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">常用工具</a>
        </el-col>
        <el-col :span="6">
            <div class="ecrm-floating-panel">
                <div class="ecrm-index-catlog-pic">
                    <a href="javascript:;" @click="goPage('/import')">
                        <img src="static/img/ecr-man3.jpg"/>
                    </a>
                </div>

                <div class="ecrm-index-catlog-name">
                    批量导入
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="ecrm-floating-panel">
                <div class="ecrm-index-catlog-pic">
                    <a href="javascript:;" @click="goPage('/resource')">
                        <img src="static/img/ecr-man4.jpg"/>
                    </a>
                </div>

                <div class="ecrm-index-catlog-name">
                    资源管理
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="ecrm-floating-panel">
                <div class="ecrm-index-catlog-pic">
                    <a href="javascript:;" @click="goPage('/raise')">
                        <img src="static/img/ecr-man5.jpg"/>
                    </a>
                </div>

                <div class="ecrm-index-catlog-name">
                    征集管理
                </div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="ecrm-floating-panel">
                <div class="ecrm-index-catlog-pic">
                    <a href="javascript:;" @click="goPage('/compareappr')">
                        <img src="static/img/ecr-man6.jpg"/>
                    </a>
                </div>

                <div class="ecrm-index-catlog-name">
                    评比管理
                </div>
            </div>
        </el-col>
    </section>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            goPage(url) {
                this.$router.push(url);
            }
        },
        mounted() {
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    section.vscroll {
        text-align: center;
    }
    .ecrm-index-catlog-name {
        height:35px;
        line-height:35px;
        text-align:center;
        font-size:16px;
    }
    .ecrm-floating-panel {
        width: 100%;
        text-align: center;
        padding-top: 65px;
    }
    .ecrm-floating-panel:hover {
        color: $color-primary-light;
    }
    .ecrm-index-catlog-pic {
        overflow:hidden;
        width:220px;
        height:160px;
        margin-left: calc(50% - 110px);
        img {
            transition: all .6s ease;
        }
        img:hover {
            color:#07b9ad;
            transform: scale(1.2);
        }
    }
</style>