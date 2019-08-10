<template>
    <section>
        <el-col :span="24" class="ecrm-search-title">
            <a class="selected">资源详情</a>
        </el-col>
        <el-col :span="24" class="ecrm-content-panel" style="padding: 20px 0px 0px 0px; border-bottom: 1px dashed #e8e8e8;">
            <h1 v-if="resource!=null">{{ resource.name }}</h1>
        </el-col>
        <el-col :span="24" class="ecrm-content-panel" style="padding: 20px 0px 0px 0px; border-bottom: 1px dashed #e8e8e8;">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="学段:">
                            <span v-if="resource!=null">{{ resource.schoolsection }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="学科:">
                            <span v-if="resource!=null">{{ resource.subject }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="年级:">
                            <span v-if="resource!=null">{{ resource.grade }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="版本:">
                            <span v-if="resource!=null">{{ resource.editiontype }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="册别:">
                            <span v-if="resource!=null">{{ resource.bookmodel }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="教材章节:" class="chapters" >
                            <template>
                                <div :style="{
                                    textOverflow: 'ellipsis',
                                    overflowX: 'hidden',
                                    whiteSpace: 'nowrap'
                                    }" v-tooltip="{
                                            content: resource ? getChapterSection(resource):'',
                                            placement: 'bottom',
                                            classes: ['info'],
                                            targetClasses: ['it-has-a-tooltip'],
                                            offset: 10,
                                            delay: {
                                                show: 100,
                                                hide: 100,
                                            },
                                        }">
                                    <span v-if="resource!=null" >{{ getChapterSection(resource) }}</span>
                                    
                                </div>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="资源类型:">
                            <span v-if="resource!=null">{{ ECRUtil.resourceLabel(resource.contenttype) }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="发布时间:">
                            <span v-if="resource!=null">{{ resource.lastupdatetime }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="共享范围:">
                            <span v-if="resource!=null">{{ SHARE_RANGE[resource.sharerange - 1].label }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="文件大小:">
                            <span v-if="resource!=null">{{ ECRUtil.getFileSize(resource.fileInfo.size, 2) }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="一级标签:">
                            <span v-if="resource!=null">{{ resource.onelabel }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="二级标签:">
                            <span v-if="resource!=null">{{ resource.twolabel }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="三级标签:">
                            <span v-if="resource!=null">{{ resource.threelabel }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-col>
        <el-col :span="24" class="ecrm-content-panel">
            <div class="ecrw-list clearfix">
                <div class="ecrw-list-media-prev" v-loading="loading">
                    <div class="ecrw-list-resource">
                        <ecr-resource-viewer :item="resource" v-if="resource!=null"></ecr-resource-viewer>
                    </div>
                </div>
            </div>
        </el-col>
    </section>
</template>

<script>
    import ECRUtil from '../../common/js/util';
    import { SHARE_RANGE } from '../../common/js/const';
    import { getResource } from '../../api/api';



    export default {
        data() {
            return {
                SHARE_RANGE: SHARE_RANGE,
                ECRUtil:ECRUtil,
                loading: false,
                resource: null
            }
        },
        methods: {
            getChapterSection(resource) {
                if (resource.subnaviInfos!=null) {
                    return resource.subnaviInfos.map(
                        item => 
                            ((item.chapter!=null)?item.chapter: '') + ' ' + 
                            ((item.section!=null)?item.section: '') + ' ' + 
                            ((item.lesson!=null)?item.lesson: '')
                        ).toString();    
                } else {
                    return '';
                }
            },
            load() {
                var resourceId = this.$route.params.id;
                this.loading = true;
                getResource(resourceId).then((res) => {
                    if (res.data.serverResult.resultCode == "200") {
                        this.resource = res.data.responseEntity;
                    } else {
                        this.$message({
                            message: res.data.serverResult.resultMessage,
                            type: 'error'
                        }); 
                    }
                    this.loading = false;
                }).catch((res) => {
                    this.loading = false;
                    this.$message({
                        message: '加载失败!',
                        type: 'error'
                    });
                });
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style lang="scss" >
    @import '~scss_vars';

    .ecrw-list-media-prev {
        width: 880px;
        min-height: 400px;
    }

    .tooltip {
        display: block !important;
        z-index: 10000;

        .tooltip-inner {
            background: black;
            color: white;
            border-radius: 16px;
            padding: 5px 10px 4px;
        }

        .tooltip-arrow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 5px;
            border-color: black;
            z-index: 1;
        }

        &[x-placement^="bottom"] {
            margin-top: 5px;

            .tooltip-arrow {
                border-width: 0 5px 5px 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-top-color: transparent !important;
                top: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }


        &[aria-hidden='true'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity .15s, visibility .15s;
        }

        &[aria-hidden='false'] {
            visibility: visible;
            opacity: 1;
            transition: opacity .15s;
        }
        &.info {
            $color: rgba(#000000, .8);

            .tooltip-inner {
            background: $color;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 5px 30px rgba(black, .1);
            max-width: 250px;
            }

            .tooltip-arrow {
            border-color: $color;
            }
        }
    }
</style>